const express = require('express');
const router = express.Router();
const db = require('../models');
const authMiddleware = require('../middlewares/auth');
const enforceProfileComplete = require('../middlewares/profileComplete');

// Get all notifications for current user
router.get('/', authMiddleware, enforceProfileComplete, async (req, res) => {
  try {
    const notifications = await db.NoticeBoardNotification.findAll({
      where: { sentTo: req.user.email },
      include: [{
        model: db.NoticeBoardJob,
        as: 'job',
        attributes: ['id', 'title', 'category', 'projectFee', 'dueAt', 'description', 'status', 'assignedTo']
      }],
      order: [['createdAt', 'DESC']]
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark notification as read
router.patch('/:id/read', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await db.NoticeBoardNotification.findOne({
      where: { id, sentTo: req.user.email }
    });
    
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    
    notification.isRead = true;
    await notification.save();
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark all as read
router.post('/read-all', authMiddleware, async (req, res) => {
  try {
    await db.NoticeBoardNotification.update(
      { isRead: true },
      { where: { sentTo: req.user.email, isRead: false } }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Clear read notifications
router.post('/clear', authMiddleware, async (req, res) => {
  try {
    await db.NoticeBoardNotification.destroy({
      where: { sentTo: req.user.email, isRead: true }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
