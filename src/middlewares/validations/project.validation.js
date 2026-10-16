// * ARCHIVO A COMPLETAR
import { body } from "express-validator";
import { Op } from "sequelize";
import {
  ProjectModel,
  TechnologyModel,
  UserModel,
} from "../../models/index.js";

const STATUSES = ["planning", "in_progress", "paused", "finished"];

// findByPk respeta paranoid: un usuario eliminado lógicamente no aparece.
const activeUser = async (id) => {
  const user = await UserModel.findByPk(id);
  if (!user) throw new Error("El líder no existe o fue eliminado");
};

const existingTechnologies = async (ids) => {
  const uniqueIds = [...new Set(ids)];
  const found = await TechnologyModel.count({ where: { id: uniqueIds } });
  if (found !== uniqueIds.length)
    throw new Error("Alguna de las technologies no existe");
};

export const createProjectValidation = [
  // TODO: 1. Validar code: obligatorio y único (ProjectModel).
  body("code")
    .trim()
    .notEmpty()
    .withMessage("El code es obligatorio")
    .custom(async (code) => {
      const project = await ProjectModel.findOne({ where: { code } });
      if (project) throw new Error("El code ya está en uso");
    }),
  // TODO: 2. Validar name y description como obligatorios.
  body("name").trim().notEmpty().withMessage("El name es obligatorio"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("La description es obligatoria"),
  // TODO: 3. Validar status: opcional y limitado a los estados permitidos.
  body("status")
    .optional()
    .isIn(STATUSES)
    .withMessage(`El status debe ser uno de: ${STATUSES.join(", ")}`),
  // TODO: 4. Validar start_date como fecha válida y budget como número positivo, ambos obligatorios.
  body("start_date")
    .notEmpty()
    .withMessage("La start_date es obligatoria")
    .isISO8601()
    .withMessage("La start_date debe ser una fecha válida (YYYY-MM-DD)"),
  body("budget")
    .notEmpty()
    .withMessage("El budget es obligatorio")
    .isFloat({ gt: 0 })
    .withMessage("El budget debe ser un número positivo"),
  // TODO: 5. Validar leader_id: debe existir y pertenecer a un usuario activo (UserModel).
  // El leader es el usuario logueado (req.user.id), no un dato que mande el cliente.
  body("leader_id").custom((_value, { req }) => activeUser(req.user.id)),
  // TODO: 6. Validar technologies: lista de ids que existan (TechnologyModel).
  body("technologies")
    .optional()
    .isArray()
    .withMessage("Las technologies deben ser una lista de ids")
    .custom(existingTechnologies),
  body("technologies.*")
    .isInt({ min: 1 })
    .withMessage("Cada technology debe ser un id válido"),
  // ? Un usuario eliminado lógicamente no puede ser líder: comprobar que la búsqueda lo deje afuera.
];

export const updateProjectValidation = [
  // TODO: 7. Validar code como opcional y único, excluyendo el propio proyecto que se edita.
  body("code")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El code no puede estar vacío")
    .custom(async (code, { req }) => {
      const project = await ProjectModel.findOne({
        where: { code, id: { [Op.ne]: req.params.id } },
      });
      if (project) throw new Error("El code ya está en uso");
    }),
  // TODO: 8. Validar name y description como opcionales y no vacíos.
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El name no puede estar vacío"),
  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("La description no puede estar vacía"),
  // TODO: 9. Validar status, start_date y budget como opcionales, con las mismas reglas que al crear.
  body("status")
    .optional()
    .isIn(STATUSES)
    .withMessage(`El status debe ser uno de: ${STATUSES.join(", ")}`),
  body("start_date")
    .optional()
    .isISO8601()
    .withMessage("La start_date debe ser una fecha válida (YYYY-MM-DD)"),
  body("budget")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("El budget debe ser un número positivo"),
  // TODO: 10. Validar leader_id como opcional, existente y de un usuario activo.
  body("leader_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("El leader_id debe ser un id válido")
    .custom(activeUser),
  // TODO: 11. Validar technologies como opcional, con ids que existan.
  body("technologies")
    .optional()
    .isArray()
    .withMessage("Las technologies deben ser una lista de ids")
    .custom(existingTechnologies),
  body("technologies.*")
    .isInt({ min: 1 })
    .withMessage("Cada technology debe ser un id válido"),
  // ? Para saber qué proyecto se edita, el id se obtiene de los parámetros de la ruta (req.params).
];
