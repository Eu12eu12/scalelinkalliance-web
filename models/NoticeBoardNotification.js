const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const NoticeBoardNotification = sequelize.define('NoticeBoardNotification', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    jobId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Some notifications might be general
    },
    type: {
      type: DataTypes.ENUM(
        'assignment', 
        'acceptance', 
        'check_out', 
        'review', 
        'completed', 
        'returned', 
        '24h_reminder', 
        '2h_reminder', 
        'overdue',
        'cancelled',
        'service_request',
        'comment',
        'file'
      ),
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    sentTo: {
      type: DataTypes.STRING, // Recipient email
      allowNull: false,
    },
    fromUser: {
      type: DataTypes.STRING, // Sender email/name
      allowNull: true,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    actionStatus: {
      type: DataTypes.ENUM('pending', 'accepted', 'declined', 'cancelled'),
      defaultValue: 'pending',
    }
  }, {
    timestamps: true
  });

  return NoticeBoardNotification;
};
