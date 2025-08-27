module.exports = (Sequelize, sequelize, DataTypes) => {
  return sequelize.define(
    "subOrders",
    {
      ...require("./core")(Sequelize, DataTypes),
      orderId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "orders",
          key: "id",
        },
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "products",
          key: "id",
        },
      },
      productQuantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "completed", "failed"),
        defaultValue: "pending",
      },
      paymentStatus: {
        type: DataTypes.ENUM("pending", "completed", "failed"),
        defaultValue: "pending",
      },
      refundStatus: {
        type: DataTypes.ENUM("pending", "completed", "failed"),
        defaultValue: "pending",
      },
      refundRequested: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    { tableName: "subOrders" }
  );
};
