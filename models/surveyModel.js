module.exports = (Sequelize, sequelize, DataTypes) => {
  return sequelize.define(
    "questions",
    {
      ...require("./core")(Sequelize, DataTypes),
      questions: {
        type: DataTypes.STRING(200),
        defaultValue: null,
      },
    },
    { tableName: "questions" }
  );
};
