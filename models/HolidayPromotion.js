const { DataTypes } = require('sequelize');

function generateSlug(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

module.exports = (sequelize) => {
  const HolidayPromotion = sequelize.define('HolidayPromotion', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    // Internal campaign identification
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Holiday category/event name (Christmas, Easter, Black Friday, etc.)
    holidayName: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Black Friday',
    },
    // Editable promotional headline
    mainHeading: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Build Smarter. Grow Faster. Save 20% This Holiday Season.',
    },
    // Editable supporting message
    subheading: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: 'Give your business a head start on the new year. Save up to $400 on selected website development, CRM automation, and digital business improvement projects.',
    },
    // Editable announcement-bar message
    bannerText: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'HOLIDAY GROWTH EVENT — SAVE 20% ON ELIGIBLE PROJECTS — UP TO $400 OFF — EXPLORE OFFERS',
    },
    showBanner: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    // Primary CTA wording and link
    buttonText: {
      type: DataTypes.STRING,
      defaultValue: 'Claim Your Holiday Discount',
    },
    buttonDestination: {
      type: DataTypes.STRING,
      defaultValue: '/holiday-offer',
    },
    // Secondary CTA wording and link
    secondaryButtonText: {
      type: DataTypes.STRING,
      defaultValue: 'Get a Free Website Review',
    },
    secondaryButtonDestination: {
      type: DataTypes.STRING,
      defaultValue: '/free-website-review',
    },
    // Discount structure
    discountType: {
      type: DataTypes.ENUM('percentage', 'fixed'),
      defaultValue: 'percentage',
      allowNull: false,
    },
    discountValue: {
      type: DataTypes.FLOAT,
      defaultValue: 20.0, // e.g. 20% or $20
      allowNull: false,
    },
    maxDiscount: {
      type: DataTypes.FLOAT,
      defaultValue: 400.0, // e.g. $400 maximum cap per eligible project
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: 'USD',
      allowNull: false,
    },
    // Array of eligible service slugs or categories, e.g. ["website-development", "e-commerce-development"]
    eligibleServices: {
      type: DataTypes.TEXT('long'),
      get() {
        const val = this.getDataValue('eligibleServices');
        if (!val) return [];
        try {
          return typeof val === 'string' ? JSON.parse(val) : val;
        } catch (e) {
          return [];
        }
      },
      set(val) {
        this.setDataValue('eligibleServices', typeof val === 'string' ? val : JSON.stringify(val || []));
      }
    },
    // Explicitly excluded services, e.g. recurring subscriptions, maintenance
    excludedServices: {
      type: DataTypes.TEXT('long'),
      get() {
        const val = this.getDataValue('excludedServices');
        if (!val) return [];
        try {
          return typeof val === 'string' ? JSON.parse(val) : val;
        } catch (e) {
          return [];
        }
      },
      set(val) {
        this.setDataValue('excludedServices', typeof val === 'string' ? val : JSON.stringify(val || []));
      }
    },
    // Scheduling & timezone
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    timezone: {
      type: DataTypes.STRING,
      defaultValue: 'America/Chicago',
      allowNull: false,
    },
    // Visual theme preset: christmas, black_friday, new_year, easter, independence_day, general_holiday
    holidayTheme: {
      type: DataTypes.ENUM('christmas', 'black_friday', 'new_year', 'easter', 'independence_day', 'general_holiday'),
      defaultValue: 'black_friday',
      allowNull: false,
    },
    bannerImage: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    mobileImage: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    // Discount stacking rule: Disabled by default
    allowStacking: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    // Lifecycle status: draft, scheduled, active, expired, disabled
    status: {
      type: DataTypes.ENUM('draft', 'scheduled', 'active', 'expired', 'disabled'),
      defaultValue: 'draft',
      allowNull: false,
    },
    termsAndConditions: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    // Administrative Reporting & Analytics counters (Section 9)
    bannerClicks: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    landingPageVisits: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    inquiryCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    ordersCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalDiscountGranted: {
      type: DataTypes.INTEGER, // Stored in cents
      defaultValue: 0,
    },
    totalRevenueGenerated: {
      type: DataTypes.INTEGER, // Stored in cents
      defaultValue: 0,
    },
  }, {
    timestamps: true,
    hooks: {
      beforeValidate: (promo) => {
        if (!promo.slug && promo.name) {
          promo.slug = generateSlug(promo.name);
        }
      }
    }
  });

  return HolidayPromotion;
};

