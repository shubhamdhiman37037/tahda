module.exports = (Sequelize, sequelize, DataTypes) => {
  return sequelize.define(
    "reports",
    {
      ...require("./core")(Sequelize, DataTypes),
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      image: {
        type: DataTypes.STRING(100),
        defaultValue: null,
      },
    },
    { tableName: "reports" }
  );
};
