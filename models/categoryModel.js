module.exports = (Sequelize, sequelize, DataTypes) => {
  return sequelize.define(
    "categories",
    {
      ...require("./core")(Sequelize, DataTypes),
      title: {
        type: DataTypes.STRING(100),
        defaultValue: null,
      },
      image: {
        type: DataTypes.STRING(50),
        defaultValue: null,
      },
    },
    { tableName: "categories" }
  );
};
