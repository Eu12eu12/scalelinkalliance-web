const { v4: uuidv4 } = require('uuid');
const db = require('../models');

const migrate = async () => {
  console.log('🔄 Starting Database Migration for Client Portal...');
  const queryInterface = db.sequelize.getQueryInterface();
  const transaction = await db.sequelize.transaction();

  try {
    const isSqlite = db.sequelize.options.dialect === 'sqlite';

    // 1. Migrate NoticeBoardJobs
    const jobsTable = await queryInterface.describeTable('NoticeBoardJobs');
    
    if (!jobsTable.clientToken) {
      console.log('➕ Adding clientToken column to NoticeBoardJobs...');
      // To bypass SQLite strict non-null/unique constraint failures on existing rows,
      // we initially add the column as nullable.
      await queryInterface.addColumn('NoticeBoardJobs', 'clientToken', {
        type: db.Sequelize.UUID,
        allowNull: true
      }, { transaction });
    }

    if (!jobsTable.clientSatisfied) {
      console.log('➕ Adding clientSatisfied column to NoticeBoardJobs...');
      await queryInterface.addColumn('NoticeBoardJobs', 'clientSatisfied', {
        type: db.Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      }, { transaction });
    }

    const customQuoteColumns = {
      clientFirstName: { type: db.Sequelize.STRING, allowNull: true },
      clientLastName: { type: db.Sequelize.STRING, allowNull: true },
      clientEmail: { type: db.Sequelize.STRING, allowNull: true },
      clientPhone: { type: db.Sequelize.STRING, allowNull: true },
      clientDialCode: { type: db.Sequelize.STRING(10), allowNull: true, defaultValue: '+1' },
      clientTimeline: { type: db.Sequelize.STRING, allowNull: true },
      otherServiceDescription: { type: db.Sequelize.TEXT, allowNull: true },
      services: { type: db.Sequelize.JSON, allowNull: true },
      budget: { type: db.Sequelize.STRING, allowNull: true },
      currency: { type: db.Sequelize.STRING(3), allowNull: true },
      projectFee: { type: db.Sequelize.INTEGER, allowNull: true },
      workerFee: { type: db.Sequelize.INTEGER, allowNull: true, defaultValue: 0 },
      clientWebsite: { type: db.Sequelize.STRING, allowNull: true },
      clientLocation: { type: db.Sequelize.STRING, allowNull: true },
      clientIndustry: { type: db.Sequelize.STRING, allowNull: true },
      projectGoal: { type: db.Sequelize.STRING, allowNull: true },
      projectScope: { type: db.Sequelize.JSON, allowNull: true },
      levelOfSupport: { type: db.Sequelize.STRING, allowNull: true },
      clientAssets: { type: db.Sequelize.JSON, allowNull: true },
      currentProblem: { type: db.Sequelize.TEXT, allowNull: true },
      recommendedPackage: { type: db.Sequelize.STRING, allowNull: true },
      customQuoteAmount: { type: db.Sequelize.INTEGER, allowNull: true },
      depositRequired: { type: db.Sequelize.INTEGER, allowNull: true },
      stripeCheckoutUrl: { type: db.Sequelize.STRING, allowNull: true },
      stripeSessionId: { type: db.Sequelize.STRING, allowNull: true },
      estimatedCompletionTime: { type: db.Sequelize.STRING, allowNull: true },
      includedServices: { type: db.Sequelize.TEXT, allowNull: true },
      notIncluded: { type: db.Sequelize.TEXT, allowNull: true },
      optionalAddOns: { type: db.Sequelize.JSON, allowNull: true },
      monthlySupportOption: { type: db.Sequelize.STRING, allowNull: true },
      specialDiscount: { type: db.Sequelize.INTEGER, allowNull: true },
      quoteExpirationDate: { type: db.Sequelize.DATE, allowNull: true },
      clientUrgency: { type: db.Sequelize.STRING, allowNull: true },
      clientQuality: { type: db.Sequelize.STRING, allowNull: true },
      potentialUpsell: { type: db.Sequelize.STRING, allowNull: true },
      followUpReminder: { type: db.Sequelize.DATE, allowNull: true },
      salesStatus: { type: db.Sequelize.STRING, allowNull: true },
      lastContactDate: { type: db.Sequelize.DATE, allowNull: true },
      nextFollowUpDate: { type: db.Sequelize.DATE, allowNull: true },
      quoteStatus: {
        type: db.Sequelize.ENUM('new_request', 'under_review', 'quote_sent', 'follow_up_needed', 'approved', 'deposit_paid', 'in_progress', 'completed', 'declined'),
        allowNull: true,
        defaultValue: 'new_request'
      }
    };

    for (const [colName, colSpec] of Object.entries(customQuoteColumns)) {
      if (!jobsTable[colName]) {
        console.log(`➕ Adding ${colName} column to NoticeBoardJobs...`);
        await queryInterface.addColumn('NoticeBoardJobs', colName, colSpec, { transaction });
      }
    }

    // 2. Migrate NoticeBoardComments
    const commentsTable = await queryInterface.describeTable('NoticeBoardComments');
    if (!commentsTable.visibility) {
      console.log('➕ Adding visibility column to NoticeBoardComments...');
      await queryInterface.addColumn('NoticeBoardComments', 'visibility', {
        type: db.Sequelize.TEXT, // SQLite enum fallback
        defaultValue: 'internal',
        allowNull: false
      }, { transaction });
    }
    if (!commentsTable.fromUserRole) {
      console.log('➕ Adding fromUserRole column to NoticeBoardComments...');
      await queryInterface.addColumn('NoticeBoardComments', 'fromUserRole', {
        type: db.Sequelize.TEXT,
        defaultValue: 'super_admin',
        allowNull: false
      }, { transaction });
    }

    // 3. Migrate NoticeBoardFiles
    const filesTable = await queryInterface.describeTable('NoticeBoardFiles');
    if (!filesTable.visibility) {
      console.log('➕ Adding visibility column to NoticeBoardFiles...');
      await queryInterface.addColumn('NoticeBoardFiles', 'visibility', {
        type: db.Sequelize.TEXT,
        defaultValue: 'internal',
        allowNull: false
      }, { transaction });
    }
    if (!filesTable.uploadedByRole) {
      console.log('➕ Adding uploadedByRole column to NoticeBoardFiles...');
      await queryInterface.addColumn('NoticeBoardFiles', 'uploadedByRole', {
        type: db.Sequelize.TEXT,
        defaultValue: 'super_admin',
        allowNull: false
      }, { transaction });
    }

    await transaction.commit();

    // 4. Backfill Retroactive Client Tokens for Existing Jobs
    console.log('🩹 Backfilling unique clientTokens for existing jobs...');
    const jobs = await db.NoticeBoardJob.findAll({ where: { clientToken: null } });
    if (jobs.length > 0) {
      for (const job of jobs) {
        job.clientToken = uuidv4();
        await job.save();
      }
      console.log(`✅ Backfilled ${jobs.length} jobs with retrofitted UUID client tokens.`);
    } else {
      console.log('✅ No backfilling needed.');
    }

    // 5. Enforce clientToken constraints if SQLite or other dialect allows it post-fill
    // (Sequelize sync alter will now run without breaking since all rows possess values).
    console.log('🚀 Running final Sequelize Sync...');
    if (isSqlite) {
      await db.sequelize.query('PRAGMA foreign_keys = OFF');
    }
    await db.sequelize.sync(isSqlite ? { alter: true } : {});
    if (isSqlite) {
      await db.sequelize.query('PRAGMA foreign_keys = ON');
    }

    console.log('🎉 Database Migration completed successfully!');
    process.exit(0);
  } catch (err) {
    await transaction.rollback().catch(() => {});
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
};

migrate();
