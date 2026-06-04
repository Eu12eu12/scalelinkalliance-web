const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Resource = sequelize.define('Resource', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    richHtmlContent: {
      type: DataTypes.TEXT('long'), // Uses LONGTEXT in MySQL
      allowNull: false,
    },
    plainTextSnippet: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'ScaleLink Alliance'
    },
    publishedDate: {
      type: DataTypes.DATEONLY,
      defaultValue: Sequelize.NOW
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'published' // 'draft' or 'published'
    }
    // Note: typeId is added by the association logic
  }, {
    timestamps: true
  });

  return Resource;
};
