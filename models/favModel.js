module.exports = (Sequelize, sequelize, DataTypes) => {
  return sequelize.define(
    "favourites",
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
      favId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    { tableName: "favourites" }
  );
};
