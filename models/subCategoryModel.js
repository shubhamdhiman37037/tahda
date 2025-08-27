module.exports = (Sequelize, sequelize, DataTypes) => {
  return sequelize.define(
    "subCategories",
    {
      ...require("./core")(Sequelize, DataTypes),
      categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "categories",
          key: "id",
        },
      },
      title: {
        type: DataTypes.STRING(50),
        defaultValue: null,
      },
      image: {
        type: DataTypes.STRING(200),
        defaultValue: null,
      },
    },
    { tableName: "subCategories" }
  );
};
