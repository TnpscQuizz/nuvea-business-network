const db = require('../database/db');

function logStrike(memberId, reason, actorId = 'system') {
  const strikes = db.getTable('strikes');
  const memberships = db.getTable('memberships');
  const businesses = db.getTable('businesses');

  const mem = memberships.find(m => m.id === memberId);
  if (!mem) throw new Error('உறுப்பினர் கிடைக்கவில்லை (Member not found)');

  const memberStrikes = strikes.filter(s => s.memberId === memberId && s.status !== 'resolved');
  const currentCount = memberStrikes.length + 1;

  let severity = 'warning';
  if (currentCount === 2) severity = 'final_warning';
  else if (currentCount >= 3) severity = 'under_admin_review';

  const newStrike = {
    id: `strk_${Date.now()}`,
    memberId,
    talukId: mem.talukId,
    reason,
    strikeNumber: currentCount,
    severity,
    status: 'active',
    appealNote: null,
    appealedAt: null,
    reviewedBy: null,
    reviewedAt: null,
    createdAt: new Date().toISOString()
  };

  strikes.push(newStrike);

  db.logAudit(actorId, 'ISSUE_STRIKE', 'strikes', newStrike.id, {
    memberId,
    reason,
    strikeNumber: currentCount,
    severity
  });

  db.persist();

  return {
    strike: newStrike,
    currentCount,
    severity,
    message: currentCount >= 3 
      ? 'உறுப்பினர் 3வது ஸ்ட்ரைக்கை எட்டியுள்ளார். அட்மின் மறுஆய்வு தேவைப்படுகிறது (Placed under Admin Review).'
      : `ஸ்ட்ரைக் #${currentCount} பதிவு செய்யப்பட்டது (${severity}).`
  };
}

function submitAppeal(strikeId, appealNote, memberId) {
  const strikes = db.getTable('strikes');
  const strike = strikes.find(s => s.id === strikeId);
  if (!strike) throw new Error('ஸ்ட்ரைக் விபரம் கிடைக்கவில்லை (Strike record not found)');

  strike.appealNote = appealNote;
  strike.appealedAt = new Date().toISOString();
  strike.status = 'appealed';

  db.logAudit(memberId || strike.memberId, 'SUBMIT_STRIKE_APPEAL', 'strikes', strikeId, { appealNote });
  db.persist();

  return strike;
}

function resolveStrikeByAdmin(strikeId, action, adminId, reason) {
  const strikes = db.getTable('strikes');
  const memberships = db.getTable('memberships');
  const strike = strikes.find(s => s.id === strikeId);
  if (!strike) throw new Error('Strike not found');

  strike.reviewedBy = adminId;
  strike.reviewedAt = new Date().toISOString();

  if (action === 'dismiss') {
    strike.status = 'resolved_dismissed';
    db.logAudit(adminId, 'DISMISS_STRIKE', 'strikes', strikeId, { reason });
  } else if (action === 'revoke_membership') {
    strike.status = 'membership_revoked';
    const mem = memberships.find(m => m.id === strike.memberId);
    if (mem) {
      mem.status = 'revoked';
      mem.revokedReason = reason;
      mem.revokedAt = new Date().toISOString();
    }
    db.logAudit(adminId, 'REVOKE_MEMBERSHIP_STRIKE', 'memberships', strike.memberId, { reason });
  }

  db.persist();
  return strike;
}

module.exports = {
  logStrike,
  submitAppeal,
  resolveStrikeByAdmin
};
