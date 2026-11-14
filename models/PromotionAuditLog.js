const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PromotionAuditLog = sequelize.define('PromotionAuditLog', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    promotionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    adminEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING, // e.g. 'Created', 'Updated', 'Published', 'Scheduled', 'Disabled', 'Deleted'
      allowNull: false,
    },
    details: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    previousValues: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    newValues: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    }
  }, {
    timestamps: true
  });

  return PromotionAuditLog;
};

