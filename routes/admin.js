// routes/admin.js (or create a new file)
router.get('/reviews/pending', protect, authorize('admin'), async (req, res) => {
  try {
    const leads = await Lead.find({ 
      reviewStatus: 'pending',
      leadType: 'website_review'
    }).sort({ dateSubmitted: -1 });
    
    res.json({ success: true, data: leads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/reviews/completed', protect, authorize('admin'), async (req, res) => {
  try {
    const leads = await Lead.find({ 
      reviewStatus: 'completed',
      leadType: 'website_review'
    }).sort({ reviewCompleted: -1 });
    
    res.json({ success: true, data: leads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});