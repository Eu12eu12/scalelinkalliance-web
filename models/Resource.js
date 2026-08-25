const { Sequelize, DataTypes, Op } = require('sequelize');

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
    slug: {
      type: DataTypes.STRING,
      allowNull: true, // Set to true for model definition; unique index enforced
      unique: true,
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
      type: DataTypes.TEXT('long'),
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
    timestamps: true,
    hooks: {
      beforeValidate: async (resource) => {
        if (!resource.slug && resource.title) {
          resource.slug = generateSlug(resource.title);
        } else if (resource.slug) {
          resource.slug = generateSlug(resource.slug);
        }
      },
      beforeSave: async (resource) => {
        if (!resource.slug && resource.title) {
          resource.slug = generateSlug(resource.title);
        }
        // Ensure uniqueness
        if (resource.changed('slug') || !resource.slug) {
          let baseSlug = generateSlug(resource.slug || resource.title) || 'resource';
          let slugCandidate = baseSlug;
          let counter = 1;
          
          while (true) {
            const whereClause = { slug: slugCandidate };
            if (resource.id) {
              whereClause.id = { [Op.ne]: resource.id };
            }
            const existing = await Resource.findOne({ where: whereClause, attributes: ['id'] });
            if (!existing) {
              resource.slug = slugCandidate;
              break;
            }
            counter += 1;
            slugCandidate = `${baseSlug}-${counter}`;
          }
        }
      }
    }
  });

  return Resource;
};