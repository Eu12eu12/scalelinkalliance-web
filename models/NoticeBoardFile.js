const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const NoticeBoardFile = sequelize.define('NoticeBoardFile', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    jobId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'NoticeBoardJobs',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileSize: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    mimeType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    uploadedBy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    visibility: {
      type: DataTypes.ENUM('internal', 'client', 'both'),
      defaultValue: 'internal',
      allowNull: false
    },
    uploadedByRole: {
      type: DataTypes.ENUM('super_admin', 'worker', 'client'),
      defaultValue: 'super_admin',
      allowNull: false
    }
  }, {
    timestamps: true
  });

  return NoticeBoardFile;
};
