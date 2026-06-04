const { Sequelize } = require('sequelize');
const path = require('path');

let sequelize;

if (process.env.NODE_ENV === 'production' && process.env.DB_NAME) {
  // Production: MySQL (Hostinger)
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host: process.env.DB_HOST || 'localhost',
      dialect: 'mysql',
      logging: false,
    }
  );
} else {
  // Local dev: SQLite
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', 'cms_database.sqlite'),
    logging: false,
  });
}

const AdminUser = require('./AdminUser')(sequelize);
const ResourceType = require('./ResourceType')(sequelize);
const Resource = require('./Resource')(sequelize);
const Partner = require('./Partner')(sequelize);
const NoticeBoardJob = require('./NoticeBoardJob')(sequelize);
const NoticeBoardFile = require('./NoticeBoardFile')(sequelize);
const NoticeBoardComment = require('./NoticeBoardComment')(sequelize);
const NoticeBoardActivity = require('./NoticeBoardActivity')(sequelize);
const NoticeBoardNotification = require('./NoticeBoardNotification')(sequelize);

// Associations Configuration
Resource.belongsTo(ResourceType, { foreignKey: 'typeId', as: 'type' });

// Notice Board Associations
NoticeBoardJob.hasMany(NoticeBoardFile, { foreignKey: 'jobId', as: 'files', onDelete: 'CASCADE' });
NoticeBoardFile.belongsTo(NoticeBoardJob, { foreignKey: 'jobId' });

NoticeBoardJob.hasMany(NoticeBoardComment, { foreignKey: 'jobId', as: 'comments', onDelete: 'CASCADE' });
NoticeBoardComment.belongsTo(NoticeBoardJob, { foreignKey: 'jobId' });

NoticeBoardJob.hasMany(NoticeBoardActivity, { foreignKey: 'jobId', as: 'activities', onDelete: 'CASCADE' });
NoticeBoardActivity.belongsTo(NoticeBoardJob, { foreignKey: 'jobId' });

NoticeBoardJob.hasMany(NoticeBoardNotification, { foreignKey: 'jobId', as: 'notifications', onDelete: 'CASCADE' });
NoticeBoardNotification.belongsTo(NoticeBoardJob, { foreignKey: 'jobId', as: 'job' });

const db = {
  sequelize,
  Sequelize,
  AdminUser,
  ResourceType,
  Resource,
  Partner,
  NoticeBoardJob,
  NoticeBoardFile,
  NoticeBoardComment,
  NoticeBoardActivity,
  NoticeBoardNotification
};

module.exports = db;
