module.exports = (Sequelize, sequelize, DataTypes) => {
  return sequelize.define(
    "products",
    {
      ...require("./core")(Sequelize, DataTypes),
      subCategoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "subcategories",
          key: "id",
        },
      },
      name: {
        type: DataTypes.STRING(50),
        defaultValue: null,
      },

      price: {
        type: DataTypes.INTEGER(6),
        defaultValue: null,
      },
      quantity: {
        type: DataTypes.INTEGER(6),
        defaultValue: null,
      },
      image: {
        type: DataTypes.STRING(255),
        defaultValue: null,
      },
    },
    { tableName: "products" }
  );
};
