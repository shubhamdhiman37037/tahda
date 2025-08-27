module.exports = (Sequelize, sequelize, DataTypes) => {
  return sequelize.define(
    "reviews",
    {
      ...require("./core")(Sequelize, DataTypes),
      ratedBy: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      ratedTo: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      review: {
        type: DataTypes.STRING,
        defaultValue: null,
      },
      rating: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
    },
    { tableName: "reviews" }
  );
};
