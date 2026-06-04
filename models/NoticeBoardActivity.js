const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const NoticeBoardActivity = sequelize.define('NoticeBoardActivity', {
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
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING, // e.g. 'Status Changed', 'File Uploaded', 'Assigned'
      allowNull: false,
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  }, {
    timestamps: true
  });

  return NoticeBoardActivity;
};
