const { v4: uuidv4 } = require('uuid');
const db = require('../models');

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

const migrate = async () => {
  console.log('🔄 Starting Database Migration for Client Portal & Resources...');
  const queryInterface = db.sequelize.getQueryInterface();
  const transaction = await db.sequelize.transaction();

  try {
    const isSqlite = db.sequelize.options.dialect === 'sqlite';

    // 1. Migrate NoticeBoardJobs
    try {
      const jobsTable = await queryInterface.describeTable('NoticeBoardJobs');
      
      if (!jobsTable.clientToken) {
        console.log('➕ Adding clientToken column to NoticeBoardJobs...');
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
    } catch (jobsErr) {
      console.warn('⚠️ NoticeBoardJobs migration skipped (table might not exist yet):', jobsErr.message);
    }

    // 2. Migrate NoticeBoardComments
    try {
      const commentsTable = await queryInterface.describeTable('NoticeBoardComments');
      if (!commentsTable.visibility) {
        console.log('➕ Adding visibility column to NoticeBoardComments...');
        await queryInterface.addColumn('NoticeBoardComments', 'visibility', {
          type: db.Sequelize.TEXT,
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
    } catch (commentsErr) {
      console.warn('⚠️ NoticeBoardComments migration skipped (table might not exist yet):', commentsErr.message);
    }

    // 3. Migrate NoticeBoardFiles
    try {
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
    } catch (filesErr) {
      console.warn('⚠️ NoticeBoardFiles migration skipped (table might not exist yet):', filesErr.message);
    }

    // 4. Migrate Resources (Add slug column)
    try {
      const resourcesTable = await queryInterface.describeTable('Resources');
      if (!resourcesTable.slug) {
        console.log('➕ Adding slug column to Resources...');
        await queryInterface.addColumn('Resources', 'slug', {
          type: db.Sequelize.STRING,
          allowNull: true
        }, { transaction });
      }
    } catch (resErr) {
      console.warn('⚠️ Resources migration skipped (table might not exist yet):', resErr.message);
    }

    // 5. Migrate NoticeBoardNotifications (ensure type column is VARCHAR/supports website_review_request)
    try {
      if (!isSqlite) {
        console.log('➕ Ensuring NoticeBoardNotifications type column is VARCHAR(50)...');
        await queryInterface.changeColumn('NoticeBoardNotifications', 'type', {
          type: db.Sequelize.STRING(50),
          allowNull: false
        }, { transaction });
      }
    } catch (notifErr) {
      console.warn('⚠️ NoticeBoardNotifications migration skipped:', notifErr.message);
    }

    await transaction.commit();

    // 6. Backfill Retroactive Client Tokens for Existing Jobs
    try {
      console.log('🩹 Backfilling unique clientTokens for existing jobs...');
      const jobs = await db.NoticeBoardJob.findAll({ where: { clientToken: null } });
      if (jobs.length > 0) {
        for (const job of jobs) {
          job.clientToken = uuidv4();
          await job.save();
        }
        console.log(`✅ Backfilled ${jobs.length} jobs with retrofitted UUID client tokens.`);
      } else {
        console.log('✅ No job token backfilling needed.');
      }
    } catch (backfillErr) {
      console.warn('⚠️ Backfill unique clientTokens skipped:', backfillErr.message);
    }

    // 7. Backfill Retroactive Slugs for Existing Resources
    try {
      console.log('🩹 Backfilling unique slugs for existing resources...');
      const resources = await db.Resource.findAll();
      const usedSlugs = new Set();
      let updatedCount = 0;

      for (const r of resources) {
        let baseSlug = r.slug || generateSlug(r.title) || `resource-${r.id}`;
        let candidate = baseSlug;
        let counter = 1;

        while (usedSlugs.has(candidate)) {
          counter++;
          candidate = `${baseSlug}-${counter}`;
        }

        usedSlugs.add(candidate);

        if (r.slug !== candidate) {
          r.slug = candidate;
          await r.save();
          updatedCount++;
          console.log(`   ✨ Assigned slug "${candidate}" to resource ID ${r.id} ("${r.title}")`);
        }
      }

      if (updatedCount > 0) {
        console.log(`✅ Backfilled ${updatedCount} resources with clean permalink slugs.`);
      } else {
        console.log('✅ All existing resources have verified slugs.');
      }
    } catch (slugBackfillErr) {
      console.warn('⚠️ Backfill resource slugs skipped:', slugBackfillErr.message);
    }

    // 9. Sync & Migrate Services Table
    try {
      console.log('?? Ensuring Services table is created and synced...');
      await db.Service.sync();
      console.log('? Services table synced successfully.');

      // Check if services need full comparison matrix synchronization
      const sampleSvc = await db.Service.findOne({ where: { slug: "graphic-design" } });
      const currentRows = sampleSvc?.packageComparison?.rows?.length || 0;
      
      // If table is empty or has old short 7-row matrix, run idempotent seeder
      if (!sampleSvc || currentRows < 15) {
        console.log('?? Updating comparison matrices in database (found ' + currentRows + ' rows, upgrading to full 19+ rows)...');
        const seedServices = require('./seed-services.cjs');
        if (typeof seedServices === 'function') {
          await seedServices();
        }
      } else {
        console.log('? Services table already has full ' + currentRows + ' comparison matrix rows.');
      }
    } catch (serviceSyncErr) {
      console.warn('?? Services table sync error:', serviceSyncErr.message);
    }

    // 8. Backfill Retroactive Notification Types for Website Reviews
    try {
      console.log('🩹 Backfilling notification types for website review requests...');
      const reviewNotifs = await db.NoticeBoardNotification.findAll({
        where: {
          message: {
            [db.Sequelize.Op.like]: '%Website Review%'
          }
        }
      });
      for (const n of reviewNotifs) {
        if (n.type !== 'website_review_request') {
          n.type = 'website_review_request';
          await n.save();
        }
      }
      if (reviewNotifs.length > 0) {
        console.log(`✅ Backfilled ${reviewNotifs.length} notifications to website_review_request type.`);
      }
    } catch (notifBackfillErr) {
      console.warn('⚠️ Backfill notification types skipped:', notifBackfillErr.message);
    }

    // 9. Enforce schema sync
    console.log('🚀 Running final Sequelize Sync...');
    if (isSqlite) {
      await db.sequelize.query('PRAGMA foreign_keys = OFF');
    }
    await db.sequelize.sync();
    if (isSqlite) {
      await db.sequelize.query('PRAGMA foreign_keys = ON');
    }

    console.log('🎉 Database Migration completed successfully!');
  } catch (err) {
    await transaction.rollback().catch(() => {});
    console.error('❌ Migration failed:', err);
    throw err;
  }
};

if (require.main === module) {
  migrate()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
} else {
  module.exports = migrate;
}
