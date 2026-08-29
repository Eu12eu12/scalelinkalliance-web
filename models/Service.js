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
  const Service = sequelize.define('Service', {
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
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'creative-support',
    },
    isCustomQuote: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    showOnCatalogGrid: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    iconName: {
      type: DataTypes.STRING,
      defaultValue: 'FaCogs',
    },
    startingPrice: {
      type: DataTypes.STRING,
      defaultValue: '$35',
    },
    intro: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    longDescription: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    features: {
      type: DataTypes.TEXT('long'),
      get() {
        const val = this.getDataValue('features');
        if (!val) return [];
        return typeof val === 'string' ? JSON.parse(val) : val;
      },
      set(val) {
        this.setDataValue('features', typeof val === 'string' ? val : JSON.stringify(val || []));
      }
    },
    whatItHelpsAchieve: {
      type: DataTypes.TEXT('long'),
      get() {
        const val = this.getDataValue('whatItHelpsAchieve');
        if (!val) return [];
        return typeof val === 'string' ? JSON.parse(val) : val;
      },
      set(val) {
        this.setDataValue('whatItHelpsAchieve', typeof val === 'string' ? val : JSON.stringify(val || []));
      }
    },
    howMeasured: {
      type: DataTypes.TEXT('long'),
      get() {
        const val = this.getDataValue('howMeasured');
        if (!val) return [];
        return typeof val === 'string' ? JSON.parse(val) : val;
      },
      set(val) {
        this.setDataValue('howMeasured', typeof val === 'string' ? val : JSON.stringify(val || []));
      }
    },
    servicesInclude: {
      type: DataTypes.TEXT('long'),
      get() {
        const val = this.getDataValue('servicesInclude');
        if (!val) return [];
        return typeof val === 'string' ? JSON.parse(val) : val;
      },
      set(val) {
        this.setDataValue('servicesInclude', typeof val === 'string' ? val : JSON.stringify(val || []));
      }
    },
    tools: {
      type: DataTypes.TEXT('long'),
      get() {
        const val = this.getDataValue('tools');
        if (!val) return [];
        return typeof val === 'string' ? JSON.parse(val) : val;
      },
      set(val) {
        this.setDataValue('tools', typeof val === 'string' ? val : JSON.stringify(val || []));
      }
    },
    sellerInfo: {
      type: DataTypes.TEXT('long'),
      get() {
        const val = this.getDataValue('sellerInfo');
        if (!val) return {
          name: 'ScaleLink Alliance Team',
          level: 'Professional',
          rating: 4.9,
          reviews: 150,
          ordersInQueue: 4,
          verified: true
        };
        return typeof val === 'string' ? JSON.parse(val) : val;
      },
      set(val) {
        this.setDataValue('sellerInfo', typeof val === 'string' ? val : JSON.stringify(val));
      }
    },
    complementaryServices: {
      type: DataTypes.TEXT('long'),
      get() {
        const val = this.getDataValue('complementaryServices');
        if (!val) return [];
        return typeof val === 'string' ? JSON.parse(val) : val;
      },
      set(val) {
        this.setDataValue('complementaryServices', typeof val === 'string' ? val : JSON.stringify(val || []));
      }
    },
    packages: {
      type: DataTypes.TEXT('long'),
      get() {
        const val = this.getDataValue('packages');
        if (!val) return {};
        return typeof val === 'string' ? JSON.parse(val) : val;
      },
      set(val) {
        this.setDataValue('packages', typeof val === 'string' ? val : JSON.stringify(val || {}));
      }
    },
    packageComparison: {
      type: DataTypes.TEXT('long'),
      get() {
        const val = this.getDataValue('packageComparison');
        if (!val) return null;
        return typeof val === 'string' ? JSON.parse(val) : val;
      },
      set(val) {
        this.setDataValue('packageComparison', typeof val === 'string' ? val : (val ? JSON.stringify(val) : null));
      }
    },
    sampleProject: {
      type: DataTypes.TEXT('long'),
      get() {
        const val = this.getDataValue('sampleProject');
        if (!val) return null;
        return typeof val === 'string' ? JSON.parse(val) : val;
      },
      set(val) {
        this.setDataValue('sampleProject', typeof val === 'string' ? val : (val ? JSON.stringify(val) : null));
      }
    },
    mainImage: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    galleryImages: {
      type: DataTypes.TEXT('long'),
      get() {
        const val = this.getDataValue('galleryImages');
        if (!val) return [];
        return typeof val === 'string' ? JSON.parse(val) : val;
      },
      set(val) {
        this.setDataValue('galleryImages', typeof val === 'string' ? val : JSON.stringify(val || []));
      }
    },
    seoTitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    seoDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    seoKeywords: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'published',
    }
  }, {
    timestamps: true,
    hooks: {
      beforeValidate: (service) => {
        if (!service.slug && service.title) {
          service.slug = generateSlug(service.title);
        } else if (service.slug) {
          service.slug = generateSlug(service.slug);
        }
      }
    }
  });

  return Service;
};
