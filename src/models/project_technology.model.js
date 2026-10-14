// * ARCHIVO A COMPLETAR
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const ProjectTechnologyModel = sequelize.define(
  "ProjectTechnology",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    technology_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // TODO: 1. id: entero, clave primaria y autoincremental.
    // TODO: 2. project_id: entero, obligatorio, clave foránea hacia Project.
    // TODO: 3. technology_id: entero, obligatorio, clave foránea hacia Technology.
  },
  {
    createdAt: false,
    updatedAt: false,
    // TODO: 4. Desactivar las columnas createdAt y updatedAt.
  },
);
ProjectTechnologyModel.belongsTo(ProjectModel, {
  foreignKey: "project_id",
});
ProjectTechnologyModel.belongsTo(TechnologyModel, {
  foreignKey: "technology_id",
});
