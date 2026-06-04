const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const NoticeBoardComment = sequelize.define('NoticeBoardComment', {
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
    userEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    visibility: {
      type: DataTypes.ENUM('internal', 'client'),
      defaultValue: 'internal',
      allowNull: false
    },
    fromUserRole: {
      type: DataTypes.ENUM('super_admin', 'worker', 'client'),
      defaultValue: 'super_admin',
      allowNull: false
    }
  }, {
    timestamps: true
  });

  return NoticeBoardComment;
};
