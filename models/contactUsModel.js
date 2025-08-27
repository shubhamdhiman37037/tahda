module.exports = (Sequelize, sequelize, DataTypes) => {
  return sequelize.define(
    "contactUs",
    {
      ...require("./core")(Sequelize, DataTypes),
      title: {
        type: DataTypes.STRING(50),
        defaultValue: null,
      },
      email: {
        type: DataTypes.STRING(100),
        defaultValue: null,
      },
      message: {
        type: DataTypes.STRING(255),
        defaultValue: null,
      },
    },
    { tableName: "contactUs" }
  );
};
