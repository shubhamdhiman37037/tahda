module.exports = (Sequelize, sequelize, DataTypes) => {
  return sequelize.define(
    "users",
    {
      ...require("./core")(Sequelize, DataTypes),
      firstName: {
        type: DataTypes.STRING(50),
        defaultValue: null,
      },
      lastName: {
        type: DataTypes.STRING(50),
        defaultValue: null,
      },
      email: {
        type: DataTypes.STRING(100),
        defaultValue: null,
      },
      password: {
        type: DataTypes.STRING(100),
        defaultValue: null,
      },
      otp: {
        type: DataTypes.INTEGER(6),
        defaultValue: null,
      },
      token: {
        type: DataTypes.STRING(500),
        defaultValue: null,
      },
      lat: {
        type: DataTypes.DECIMAL(10, 8),
        defaultValue: null,
      },
      long: {
        type: DataTypes.DECIMAL(10, 8),
        defaultValue: null,
      },
      location: {
        type: DataTypes.STRING(100),
        defaultValue: null,
      },
      countryCode: {
        type: DataTypes.INTEGER,
        defaultValue: null,
      },
      mobileNo: {
        type: DataTypes.STRING(50),
        defaultValue: null,
      },
    },
    { tableName: "users" }
  );
};
