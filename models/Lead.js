// models/Lead.js
// Sequelize model — matches the pattern used in models/AdminUser.js.
// NOTE: enum types render as ENUM on Postgres/MySQL, but Sequelize falls back
// to a plain string column on SQLite (same as the ENUM usage already in
// models/NoticeBoardJob.js's quoteStatus field), so this is safe locally.

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Lead = sequelize.define('Lead', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    leadType: {
      type: DataTypes.ENUM('website_review', 'service_request', 'membership'),
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    businessName: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    websiteUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    industry: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '',
    },
    agreeToContact: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },

    // Website Review specific fields
    reviewStatus: {
      type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'sent'),
      allowNull: false,
      defaultValue: 'pending',
    },
    reviewerAssigned: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    reviewCompleted: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    reviewSent: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    reviewResults: {
      type: DataTypes.JSON,
      allowNull: true,
    },

    // Lead scoring
    leadScore: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    leadSource: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'website_review_form',
    },

    // Pipeline tracking
    pipelineStage: {
      type: DataTypes.ENUM(
        'review_requested',
        'review_in_progress',
        'review_sent',
        'discovery_call',
        'quote_requested',
        'proposal_sent',
        'project_won',
        'project_started'
      ),
      allowNull: false,
      defaultValue: 'review_requested',
    },

    dateSubmitted: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    lastContact: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: '',
    },
  }, {
    timestamps: true,
  });

  return Lead;
};