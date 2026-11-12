const db = require('../database/db');

function advanceSpeakerQueue(meetingId = 'meet_current') {
  const queue = db.getTable('speakerQueue');
  const activeIdx = queue.findIndex(item => item.status === 'active');

  let previousSpeaker = null;
  let currentSpeaker = null;
  let nextSpeaker = null;

  if (activeIdx !== -1) {
    queue[activeIdx].status = 'completed';
    previousSpeaker = queue[activeIdx];

    const nextIdx = activeIdx + 1;
    if (nextIdx < queue.length) {
      queue[nextIdx].status = 'active';
      currentSpeaker = queue[nextIdx];
      if (nextIdx + 1 < queue.length) {
        nextSpeaker = queue[nextIdx + 1];
      }
    }
  } else {
    // If no active speaker, activate the first upcoming
    const firstUpcomingIdx = queue.findIndex(item => item.status === 'upcoming');
    if (firstUpcomingIdx !== -1) {
      queue[firstUpcomingIdx].status = 'active';
      currentSpeaker = queue[firstUpcomingIdx];
      if (firstUpcomingIdx + 1 < queue.length) {
        nextSpeaker = queue[firstUpcomingIdx + 1];
      }
    }
  }

  db.persist();

  return {
    previousSpeaker,
    currentSpeaker,
    nextSpeaker,
    queue
  };
}

function generateMeetingReport(meetingId = 'meet_current') {
  const meetings = db.getTable('meetings');
  const meeting = meetings.find(m => m.id === meetingId) || meetings[0];
  const queue = db.getTable('speakerQueue');
  const referrals = db.getTable('referrals');

  const completedSpeakers = queue.filter(q => q.status === 'completed');
  const totalSpeakers = queue.length;
  const attendanceRate = totalSpeakers > 0 ? Math.round((completedSpeakers.length / totalSpeakers) * 100) : 100;

  // Recent referrals passed in meeting
  const recentLeads = referrals.slice(0, 5);
  const totalDealValue = recentLeads.reduce((acc, r) => acc + (Number(r.expectedValue) || 0), 0);

  const report = {
    meetingId,
    taluk: meeting ? meeting.talukId : 'harur',
    date: meeting ? meeting.date : new Date().toISOString().split('T')[0],
    time: meeting ? meeting.time : '07:30 AM',
    meetingLink: meeting ? meeting.meetingLink : 'https://meet.google.com/nbn-harur-sat',
    attendance: {
      totalInvited: totalSpeakers,
      attended: completedSpeakers.length,
      absent: totalSpeakers - completedSpeakers.length,
      ratePercentage: attendanceRate
    },
    businessStats: {
      leadsExchanged: recentLeads.length,
      announcedBusinessValue: totalDealValue,
      formattedBusinessValue: `₹${(totalDealValue / 100000).toFixed(1)} லட்சம்`
    },
    speakersList: queue.map(q => ({
      order: q.order,
      speaker: q.speaker,
      businessName: q.businessName,
      status: q.status
    })),
    generatedAt: new Date().toISOString()
  };

  return report;
}

module.exports = {
  advanceSpeakerQueue,
  generateMeetingReport
};
