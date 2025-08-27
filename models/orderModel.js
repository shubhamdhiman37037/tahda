module.exports = (Sequelize, sequelize, DataTypes) => {
  return sequelize.define(
    "orders",
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
      addressId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "shippingaddresses",
          key: "id",
        },
      },

      totalPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      totalItems: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
    },
    { tableName: "orders" }
  );
};
