module.exports = (Sequelize, DataTypes) => {
  return {
    id: {
      type: Sequelize.UUID, // 32 charater UUID
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW(0),
      field: "createdAt",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW(0),
      field: "updatedAt",
    },
  };
};
