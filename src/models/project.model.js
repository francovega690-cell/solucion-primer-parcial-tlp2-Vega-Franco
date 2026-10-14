// * ARCHIVO A COMPLETAR
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const ProjectModel = sequelize.define("Project", {
  // TODO: 1. code: string, único y obligatorio.
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("plannig", "in_progress", "paused", "finished"),
    defaultValue: "planning",
  },
  start_date: {
    type: DataTypes.DATE(), //como se ponia n=en dia profe? :c
    allowNull: false,
  },
  buget: {
    type: DataTypes.DECIMAL,
    allowNull: false,
  },
  leader_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // TODO: 2. name: string, obligatorio.
  // TODO: 3. description: texto, obligatorio.
  // TODO: 4. status: ENUM con los valores planning, in_progress, paused y finished; obligatorio y con planning como valor por defecto.
  // TODO: 5. start_date: fecha (solo día), obligatoria.
  // TODO: 6. budget: decimal, obligatorio.
  // TODO: 7. leader_id: entero, obligatorio, clave foránea hacia User.
});
UserModel.belongsTo(UserModel, {
  foreignKey: "user",
});
