module.exports = (Sequelize, sequelize, DataTypes) => {
  return sequelize.define(
    "answers",
    {
      ...require("./core")(Sequelize, DataTypes),
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      answers: {
        type: DataTypes.STRING(200),
        defaultValue: null,
      },
    },
    { tableName: "answers" }
  );
};
