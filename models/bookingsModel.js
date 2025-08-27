const { types } = require("joi");

module.exports = (Sequelize, sequelize, DataTypes) => {
  return sequelize.define(
    "bookings",
    {
      ...require("./core")(Sequelize, DataTypes),
      bookedBy: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      bookedTo: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        defaultValue: null,
      },
      time: {
        type: DataTypes.TIME,
        defaultValue: null,
      },
    },
    { tableName: "bookings" }
  );
};
