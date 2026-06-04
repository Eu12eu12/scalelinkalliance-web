const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ResourceType = sequelize.define('ResourceType', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    shortForm: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: false
  });

  return ResourceType;
};
