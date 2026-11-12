const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { advanceSpeakerQueue, generateMeetingReport } = require('../services/meetingService');

router.get('/current', (req, res) => {
  const meetings = db.getTable('meetings');
  const queue = db.getTable('speakerQueue');
  const settings = db.getSettings();

  const currentMeeting = meetings[0] || {
    id: 'meet_current',
    talukId: 'harur',
    date: '2024-11-16',
    time: '07:30 AM',
    meetingLink: 'https://meet.google.com/nbn-harur-sat',
    status: 'live'
  };

  const activeSpeaker = queue.find(q => q.status === 'active') || queue[0];
  const upcomingSpeaker = queue.find(q => q.status === 'upcoming') || null;

  res.json({
    meeting: currentMeeting,
    speakerDurationSeconds: settings.speakerDurationSeconds || 45,
    speakerWarningSeconds: settings.speakerWarningSeconds || 10,
    activeSpeaker,
    upcomingSpeaker,
    queue
  });
});

router.post('/advance', (req, res) => {
  try {
    const result = advanceSpeakerQueue();
    res.json({
      success: true,
      ...result
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/report', (req, res) => {
  try {
    const report = generateMeetingReport();
    res.json(report);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Record Weekly Meeting Attendance
router.post('/attendance', (req, res) => {
  try {
    const { meetingId, memberId, status } = req.body;
    const attendance = db.getTable('attendance');
    const record = {
      id: `att_${Date.now()}`,
      meetingId: meetingId || 'meet_current',
      memberId: memberId || 'mem_001',
      status: status || 'present', // present, late, absent, excused
      timestamp: new Date().toISOString()
    };
    attendance.push(record);
    db.persist();
    res.json({ success: true, message: `வருகை நிலை "${record.status}" என பதிவு செய்யப்பட்டது`, record });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
