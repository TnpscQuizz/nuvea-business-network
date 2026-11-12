const db = require('../database/db');

function calculatePerformanceScore({ leadsGiven, closedValue, attendancePercent, conversionRate }) {
  const settings = db.getSettings();
  const weights = (settings && settings.elevationWeights) || {
    leadsGiven: 0.30,
    closedBusinessValue: 0.40,
    attendancePercent: 0.20,
    conversionRate: 0.10
  };

  // Normalized scoring (out of 100)
  // Leads: 30 leads = 100 pts
  const leadsScore = Math.min(100, (leadsGiven / 30) * 100);
  // Value: 25 Lakhs = 100 pts
  const valueScore = Math.min(100, (closedValue / 2500000) * 100);
  // Attendance: 100% = 100 pts
  const attendanceScore = Math.min(100, attendancePercent);
  // Conversion: 100% = 100 pts
  const conversionScore = Math.min(100, conversionRate);

  const composite = (
    leadsScore * weights.leadsGiven +
    valueScore * weights.closedBusinessValue +
    attendanceScore * weights.attendancePercent +
    conversionScore * weights.conversionRate
  );

  return Math.round(composite * 10) / 10;
}

function determineEligibleTier(perf, score) {
  const settings = db.getSettings();
  const minLeads = (settings && settings.elevationMinLeads) || 10;
  const minAttendance = (settings && settings.elevationMinAttendance) || 85;

  if (perf.leadsGiven >= 50 && perf.closedValue >= 10000000 && perf.attendancePercent >= 95) {
    return 'National Apex Council';
  } else if (perf.leadsGiven >= 25 && perf.closedValue >= 2500000 && perf.attendancePercent >= 90) {
    return 'Tamil Nadu State Titans';
  } else if (perf.leadsGiven >= minLeads && perf.closedValue >= 1000000 && perf.attendancePercent >= minAttendance) {
    return 'District VIP Titans';
  }
  return 'Taluk Member';
}

function recalculateAllScores() {
  const performances = db.getTable('performanceScores');
  const referrals = db.getTable('referrals');
  const memberships = db.getTable('memberships');

  performances.forEach(perf => {
    // Tally actual closed value from referrals
    const memberReferralsGiven = referrals.filter(r => r.fromMemberId === perf.memberId);
    const wonReferrals = memberReferralsGiven.filter(r => r.status === 'won');
    
    if (wonReferrals.length > 0) {
      const totalWon = wonReferrals.reduce((sum, r) => sum + (Number(r.closedValue) || 0), 0);
      if (totalWon > 0) perf.closedValue = totalWon;
    }

    if (memberReferralsGiven.length > 0) {
      perf.leadsGiven = memberReferralsGiven.length;
      perf.conversionRate = Math.round((wonReferrals.length / memberReferralsGiven.length) * 100);
    }

    perf.score = calculatePerformanceScore(perf);
    perf.eligibleTier = determineEligibleTier(perf, perf.score);

    // Auto-update membership tier if qualified for district VIP
    const mem = memberships.find(m => m.id === perf.memberId);
    if (mem && perf.eligibleTier === 'District VIP Titans' && mem.tier === 'taluk') {
      mem.tier = 'district_vip';
    }
  });

  db.persist();
  return performances;
}

function getLeaderboard(talukId = null) {
  recalculateAllScores();

  const performances = db.getTable('performanceScores');
  const memberships = db.getTable('memberships');
  const businesses = db.getTable('businesses');
  const categories = db.getTable('categories');

  let list = performances.map(perf => {
    const mem = memberships.find(m => m.id === perf.memberId) || {};
    const biz = businesses.find(b => b.id === mem.businessId) || {};
    const cat = categories.find(c => c.id === mem.categoryId) || {};

    return {
      memberId: perf.memberId,
      talukId: mem.talukId,
      tier: mem.tier || 'taluk',
      businessName: biz.businessName || 'நிறுவனம்',
      ownerName: biz.ownerName || 'உரிமையாளர்',
      phone: biz.phone || '',
      categoryNameTa: cat.nameTa || '',
      categoryNameEn: cat.nameEn || '',
      leadsGiven: perf.leadsGiven,
      leadsReceived: perf.leadsReceived,
      closedValue: perf.closedValue,
      attendancePercent: perf.attendancePercent,
      conversionRate: perf.conversionRate,
      compositeScore: perf.score,
      eligibleTier: perf.eligibleTier,
      isDistrictPromoted: mem.tier === 'district_vip' || mem.tier === 'state_titan'
    };
  });

  if (talukId) {
    list = list.filter(item => item.talukId === talukId);
  }

  // Sort by composite score descending
  list.sort((a, b) => b.compositeScore - a.compositeScore);
  return list;
}

module.exports = {
  calculatePerformanceScore,
  recalculateAllScores,
  getLeaderboard
};
