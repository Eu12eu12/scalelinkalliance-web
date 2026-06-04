const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const NoticeBoardJob = sequelize.define('NoticeBoardJob', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    client: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    assignedTo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    assignedBy: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    receivedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    checkedOutAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dueAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
      allowNull: false,
      defaultValue: 'medium',
    },
    status: {
      type: DataTypes.ENUM('new', 'assigned', 'in_progress', 'checked_out', 'waiting_review', 'completed', 'overdue', 'archived'),
      allowNull: false,
      defaultValue: 'new',
    },
    warningLevel: {
      type: DataTypes.ENUM('green', 'yellow', 'orange', 'red'),
      allowNull: false,
      defaultValue: 'green',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Aligned fields from ServiceRequest
    clientFirstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    clientLastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    clientEmail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    clientPhone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    clientDialCode: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: '+1',
    },
    clientTimeline: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otherServiceDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    services: {
      type: DataTypes.JSON, // Stores { serviceName: packageName }
      allowNull: true,
    },
    budget: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    currency: {
      type: DataTypes.STRING(3),
      allowNull: true,
    },
    projectFee: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    clientToken: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true
    },
    clientSatisfied: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    workerFee: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    // Custom Quote & Dynamic Form Fields
    clientWebsite: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    clientLocation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    clientIndustry: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    projectGoal: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    projectScope: {
      type: DataTypes.JSON, // For website, marketing, app scope details & category-specific extra details
      allowNull: true,
    },
    levelOfSupport: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    clientAssets: {
      type: DataTypes.JSON, // Brand assets checklist
      allowNull: true,
    },
    currentProblem: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    recommendedPackage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    customQuoteAmount: {
      type: DataTypes.INTEGER, // Stored in cents
      allowNull: true,
    },
    depositRequired: {
      type: DataTypes.INTEGER, // Stored in cents
      allowNull: true,
    },
    stripeCheckoutUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    stripeSessionId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    estimatedCompletionTime: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    includedServices: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    notIncluded: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    optionalAddOns: {
      type: DataTypes.JSON, // array of { name, price }
      allowNull: true,
    },
    monthlySupportOption: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    specialDiscount: {
      type: DataTypes.INTEGER, // Stored in cents
      allowNull: true,
    },
    quoteExpirationDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    clientUrgency: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    clientQuality: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    potentialUpsell: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    followUpReminder: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    salesStatus: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastContactDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    nextFollowUpDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    quoteStatus: {
      type: DataTypes.ENUM('new_request', 'under_review', 'quote_sent', 'follow_up_needed', 'approved', 'deposit_paid', 'in_progress', 'completed', 'declined'),
      allowNull: true,
      defaultValue: 'new_request'
    }
  }, {
    timestamps: true
  });

  return NoticeBoardJob;
};
