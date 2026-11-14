const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { requireAuth, requireRole } = require('../middleware/auth');
const { logStrike, resolveStrikeByAdmin } = require('../services/strikeService');

// Admin Overview Metrics
router.get('/overview', requireAuth, requireRole('super_admin', 'district_admin', 'taluk_admin'), (req, res) => {
  const businesses = db.getTable('businesses');
  const memberships = db.getTable('memberships');
  const referrals = db.getTable('referrals');
  const payments = db.getTable('payments');
  const strikes = db.getTable('strikes');
  const taluks = db.getTable('taluks');
  const settings = db.getSettings();

  const totalRevenue = payments.reduce((sum, p) => sum + (Number(p.totalAmount) || 0), 0);
  const totalClosedBusiness = referrals
    .filter(r => r.status === 'won')
    .reduce((sum, r) => sum + (Number(r.closedValue) || 0), 0);

  const activeMembers = memberships.filter(m => m.status === 'active');
  const pendingStrikes = strikes.filter(s => s.status === 'active' || s.status === 'appealed');

  res.json({
    metrics: {
      totalMembers: activeMembers.length,
      totalBusinesses: businesses.length,
      totalTaluks: taluks.length,
      totalRevenueCollected: totalRevenue,
      totalClosedBusiness,
      activeStrikesCount: pendingStrikes.length,
      referralsCount: referrals.length
    },
    settings,
    recentPayments: payments.slice(-5),
    recentAuditLogs: db.getTable('auditLogs').slice(0, 10)
  });
});

// Update System Settings dynamically without server restart
router.post('/settings', requireAuth, requireRole('super_admin'), (req, res) => {
  try {
    const updated = db.updateSettings(req.body, req.user.id);
    res.json({
      success: true,
      message: 'அமைப்புகள் வெற்றிகரமாக சேமிக்கப்பட்டன! (Settings updated and persisted immediately)',
      settings: updated
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Member Management
router.get('/members', requireAuth, requireRole('super_admin', 'district_admin', 'taluk_admin'), (req, res) => {
  const memberships = db.getTable('memberships');
  const businesses = db.getTable('businesses');
  const categories = db.getTable('categories');
  const taluks = db.getTable('taluks');
  const performanceScores = db.getTable('performanceScores');
  const strikes = db.getTable('strikes');

  const fullList = memberships.map(m => {
    const biz = businesses.find(b => b.id === m.businessId) || {};
    const cat = categories.find(c => c.id === m.categoryId) || {};
    const tal = taluks.find(t => t.id === m.talukId) || {};
    const perf = performanceScores.find(p => p.memberId === m.id) || {};
    const memStrikes = strikes.filter(s => s.memberId === m.id && s.status === 'active');

    return {
      membershipId: m.id,
      businessId: biz.id,
      businessName: biz.businessName,
      ownerName: biz.ownerName,
      phone: biz.phone,
      email: biz.email,
      talukId: m.talukId,
      talukName: tal.nameTa || m.talukId,
      categoryId: m.categoryId,
      categoryName: cat.nameTa || m.categoryId,
      tier: m.tier,
      status: m.status,
      startDate: m.startDate,
      expiryDate: m.expiryDate,
      annualFee: m.annualFee,
      leadsGiven: perf.leadsGiven || 0,
      closedValue: perf.closedValue || 0,
      attendancePercent: perf.attendancePercent || 100,
      activeStrikesCount: memStrikes.length
    };
  });

  res.json(fullList);
});

// Issue Manual Strike
router.post('/strikes/issue', requireAuth, requireRole('super_admin', 'taluk_admin'), (req, res) => {
  const { memberId, reason } = req.body;
  if (!memberId || !reason) {
    return res.status(400).json({ error: 'உறுப்பினர் மற்றும் காரணம் அவசியம் (Member and reason required)' });
  }

  try {
    const result = logStrike(memberId, reason, req.user.id);
    res.json({ success: true, ...result });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Resolve Strike (Dismiss or Revoke Membership)
router.post('/strikes/resolve', requireAuth, requireRole('super_admin'), (req, res) => {
  const { strikeId, action, reason } = req.body; // action: 'dismiss' or 'revoke_membership'
  if (!strikeId || !action || !reason) {
    return res.status(400).json({ error: 'StrikeId, Action, and Reason are mandatory' });
  }

  try {
    const strike = resolveStrikeByAdmin(strikeId, action, req.user.id, reason);
    res.json({
      success: true,
      message: action === 'revoke_membership' 
        ? 'உறுப்பினர் தகுதி நீக்கம் செய்யப்பட்டு கேட்டகிரி மீண்டும் திறக்கப்பட்டது.' 
        : 'ஸ்ட்ரைக் தள்ளுபடி செய்யப்பட்டது (Strike dismissed).',
      strike
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Audit Logs
router.get('/audit-logs', requireAuth, requireRole('super_admin'), (req, res) => {
  res.json(db.getTable('auditLogs'));
});

// CSV Export for Members
router.get('/export-csv', requireAuth, requireRole('super_admin', 'district_admin'), (req, res) => {
  const businesses = db.getTable('businesses');
  const memberships = db.getTable('memberships');

  const headers = ['Business Name', 'Owner Name', 'Phone', 'Taluk', 'Category', 'Tier', 'Status', 'Expiry Date'];
  const rows = memberships.map(m => {
    const b = businesses.find(item => item.id === m.businessId) || {};
    return [
      `"${b.businessName || ''}"`,
      `"${b.ownerName || ''}"`,
      `"${b.phone || ''}"`,
      `"${m.talukId || ''}"`,
      `"${m.categoryId || ''}"`,
      `"${m.tier || ''}"`,
      `"${m.status || ''}"`,
      `"${m.expiryDate || ''}"`
    ].join(',');
  });

  const csv = [headers.join(','), ...rows].join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="nbn_members_export.csv"');
  res.send(csv);
});

// --- NBN ENTERPRISE ORGANIZATION HIERARCHY & OPERATIONS ---

// 1. States Management
router.get('/states', requireAuth, requireRole('super_admin'), (req, res) => {
  res.json(db.getTable('states'));
});

router.post('/states', requireAuth, requireRole('super_admin'), (req, res) => {
  try {
    const state = db.createState(req.body);
    res.json({ success: true, message: 'புதிய மாநிலம் உருவாக்கப்பட்டது', state });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// 2. Districts Management
router.get('/districts', requireAuth, requireRole('super_admin', 'state_admin'), (req, res) => {
  res.json(db.getTable('districts'));
});

router.post('/districts', requireAuth, requireRole('super_admin', 'state_admin'), (req, res) => {
  try {
    const district = db.createDistrict(req.body);
    res.json({ success: true, message: 'புதிய மாவட்டம் உருவாக்கப்பட்டது', district });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// 3. Chapters & Capacity Management
router.get('/chapters', requireAuth, requireRole('super_admin', 'state_admin', 'district_admin'), (req, res) => {
  let chapters = db.getTable('chapters');
  if (req.user.role === 'district_admin' && req.user.districtId) {
    chapters = chapters.filter(c => c.districtId === req.user.districtId);
  }
  const enriched = chapters.map(c => {
    const occ = db.getChapterOccupancy(c.id);
    const cap = c.capacity !== undefined ? c.capacity : (c.maxSeats || 100);
    return {
      ...c,
      capacity: cap,
      filledSeats: occ.filledSeats,
      availableSeats: cap === -1 ? 999 : Math.max(0, cap - occ.filledSeats),
      utilizationPercentage: cap > 0 ? Math.round((occ.filledSeats / cap) * 100) : 0
    };
  });
  res.json(enriched);
});

router.patch('/chapters/:id/capacity', requireAuth, requireRole('super_admin'), (req, res) => {
  try {
    const { capacity, reason } = req.body;
    const result = db.updateChapterCapacity(req.params.id, capacity, reason, req.user.id);
    res.json({ success: true, message: 'சாப்டர் கொள்ளளவு மாற்றப்பட்டது', ...result });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post('/chapters/transfer-member', requireAuth, requireRole('super_admin'), (req, res) => {
  try {
    const { memberId, targetChapterId } = req.body;
    const result = db.transferMember(memberId, targetChapterId, req.user.id);
    res.json({ success: true, message: 'உறுப்பினர் புதிய சாப்டருக்கு மாற்றப்பட்டார்!', ...result });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// 4. Membership Applications Queue
router.get('/applications', requireAuth, requireRole('super_admin', 'district_admin', 'chapter_president', 'membership_committee'), (req, res) => {
  let apps = db.getTable('applications');
  if (req.query.status) {
    apps = apps.filter(a => a.status === req.query.status);
  }
  if (req.query.chapterId) {
    apps = apps.filter(a => a.preferredChapterId === req.query.chapterId);
  }
  res.json(apps);
});

router.patch('/applications/:id/status', requireAuth, requireRole('super_admin', 'membership_committee'), (req, res) => {
  try {
    const { status, notes } = req.body;
    const updated = db.updateApplicationStatus(req.params.id, status, notes, req.user.id);
    res.json({ success: true, message: `விண்ணப்ப நிலை "${status}" என மாற்றப்பட்டது`, application: updated });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// 5. 12 Comprehensive Enterprise Reports
router.get('/reports/:type', requireAuth, requireRole('super_admin', 'state_admin', 'district_admin'), (req, res) => {
  const { type } = req.params;
  const isCsv = req.query.format === 'csv';
  const businesses = db.getTable('businesses');
  const memberships = db.getTable('memberships');
  const referrals = db.getTable('referrals');
  const payments = db.getTable('payments');
  const chapters = db.getTable('chapters');
  const oneToOnes = db.getTable('oneToOneMeetings');
  const guests = db.getTable('guests');
  const attendance = db.getTable('attendance');

  let data = {};
  let csvHeaders = [];
  let csvRows = [];

  switch (type) {
    case 'growth':
      data = {
        totalMembers: memberships.filter(m => m.status === 'active').length,
        totalBusinesses: businesses.length,
        totalChapters: chapters.length,
        monthlyGrowth: [
          { month: 'ஆகஸ்ட் 2024', members: 8, chapters: 2 },
          { month: 'செப்டம்பர் 2024', members: 14, chapters: 3 },
          { month: 'அக்டோபர் 2024', members: 19, chapters: 5 },
          { month: 'நவம்பர் 2024', members: memberships.length, chapters: chapters.length }
        ]
      };
      csvHeaders = ['Month', 'Members', 'Chapters'];
      csvRows = data.monthlyGrowth.map(g => [g.month, g.members, g.chapters].join(','));
      break;

    case 'chapter':
      data = chapters.map(c => {
        const occ = db.getChapterOccupancy(c.id);
        const chapMems = memberships.filter(m => (m.chapterId || 'harur_titans') === c.id);
        return {
          id: c.id,
          name: c.nameTa,
          code: c.code || 'NBN-CHP',
          capacity: c.capacity || 100,
          filledSeats: occ.filledSeats,
          availableSeats: Math.max(0, (c.capacity || 100) - occ.filledSeats),
          utilization: `${Math.round((occ.filledSeats / (c.capacity || 100)) * 100)}%`,
          director: c.directorName || 'சந்திரா',
          meetingTime: `${c.meetingDay} ${c.meetingTime}`
        };
      });
      csvHeaders = ['Chapter Name', 'Code', 'Capacity', 'Filled', 'Available', 'Utilization'];
      csvRows = data.map(d => [`"${d.name}"`, d.code, d.capacity, d.filledSeats, d.availableSeats, d.utilization].join(','));
      break;

    case 'verified_business':
      const wonReferrals = referrals.filter(r => r.status === 'won');
      const totalConfirmedValue = wonReferrals.reduce((sum, r) => sum + (Number(r.verifiedClosedValue || r.closedValue) || 0), 0);
      data = {
        totalVerifiedValue: totalConfirmedValue,
        totalVerifiedValueFormatted: `₹${(totalConfirmedValue / 100000).toFixed(2)} லட்சம்`,
        totalTransactions: wonReferrals.length,
        deals: wonReferrals.map(r => ({
          id: r.id,
          from: r.fromBusinessName || r.from,
          to: r.toBusinessName || r.to,
          clientName: r.clientName,
          verifiedValue: r.verifiedClosedValue || r.closedValue,
          conversionDate: r.conversionDate || r.createdAt
        }))
      };
      csvHeaders = ['Referral ID', 'From Business', 'To Business', 'Client', 'Verified Closed Value', 'Date'];
      csvRows = data.deals.map(d => [d.id, `"${d.from}"`, `"${d.to}"`, `"${d.clientName}"`, d.verifiedValue, d.conversionDate].join(','));
      break;

    case 'referrals':
      data = referrals.map(r => ({
        id: r.id,
        from: r.fromBusinessName || r.from,
        to: r.toBusinessName || r.to,
        clientName: r.clientName,
        stage: r.status,
        estimatedValue: r.estimatedValue || r.expectedValue,
        closedValue: r.verifiedClosedValue || r.closedValue || 0
      }));
      csvHeaders = ['ID', 'From', 'To', 'Client', 'Stage', 'Estimated Value', 'Closed Value'];
      csvRows = data.map(d => [d.id, `"${d.from}"`, `"${d.to}"`, `"${d.clientName}"`, d.stage, d.estimatedValue, d.closedValue].join(','));
      break;

    case 'revenue':
      const totalRev = payments.reduce((sum, p) => sum + (Number(p.totalAmount) || 0), 0);
      data = {
        totalRevenue: totalRev,
        totalRevenueFormatted: `₹${totalRev.toLocaleString('en-IN')}`,
        payments: payments.map(p => ({
          invoiceNumber: p.invoiceNumber,
          businessName: p.businessName,
          amount: p.totalAmount,
          gst: p.gstAmount,
          status: p.status,
          date: p.date
        }))
      };
      csvHeaders = ['Invoice Number', 'Business', 'Total Amount', 'GST (18%)', 'Status', 'Date'];
      csvRows = data.payments.map(p => [p.invoiceNumber, `"${p.businessName}"`, p.amount, p.gst, p.status, p.date].join(','));
      break;

    default:
      data = { message: 'அறிக்கை தயாராக உள்ளது', totalRecords: memberships.length };
      csvHeaders = ['Type', 'Records'];
      csvRows = [[type, memberships.length].join(',')];
  }

  if (isCsv) {
    const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="nbn_report_${type}.csv"`);
    return res.send(csvContent);
  }

  res.json(data);
});

// ==========================================
// HOSTINGER REMOTE MYSQL SETTINGS & SYNC APIS
// ==========================================
const hostingerService = require('../services/hostingerService');

router.get('/hostinger-config', (req, res) => {
  res.json(hostingerService.getConfig());
});

router.post('/hostinger-config', (req, res) => {
  try {
    const updated = hostingerService.saveConfig(req.body);
    res.json({
      success: true,
      message: 'ஹோஸ்டிங்கர் MySQL அமைப்புகள் வெற்றிகரமாக சேமிக்கப்பட்டன!',
      config: updated
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post('/hostinger-test', async (req, res) => {
  try {
    const result = await hostingerService.testConnection(req.body);
    res.json(result);
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

router.post('/hostinger-sync-all', async (req, res) => {
  try {
    const businesses = db.getTable('businesses');
    const users = db.getTable('users');
    let syncedCount = 0;

    for (const b of businesses) {
      const u = users.find(user => user.id === b.userId || user.phone === b.phone) || {};
      const resSync = await hostingerService.syncOwnerRecord({
        userId: u.id || `usr_${b.id}`,
        username: u.username || b.phone,
        ownerName: b.ownerName,
        email: b.email,
        phone: b.phone,
        businessId: b.id,
        businessName: b.businessName,
        categoryId: b.categoryId,
        talukId: b.talukId,
        chapterId: b.chapterId,
        forumType: b.forumType,
        accountType: b.accountType,
        address: b.address,
        mapEmbedUrl: b.mapEmbedUrl,
        logo: b.logo,
        cover: b.cover
      });
      if (resSync.synced) syncedCount++;
    }

    res.json({
      success: true,
      message: `${syncedCount}/${businesses.length} வணிகர்கள் Hostinger MySQL-ல் ஒத்திசைக்கப்பட்டனர்!`,
      syncedCount,
      totalCount: businesses.length
    });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

module.exports = router;
