const db = require('../database/db');

function reserveCategorySeat({
  userId,
  talukId,
  chapterId,
  categoryId,
  businessName,
  ownerName,
  phone,
  email,
  address,
  gstNumber,
  tagline,
  description
}) {
  // Resolve chapterId if not explicitly passed
  let resolvedChapterId = chapterId;
  if (!resolvedChapterId) {
    const chapters = db.getTable('chapters');
    const defaultChap = chapters.find(c => c.talukId === talukId && c.status === 'active') || chapters.find(c => c.talukId === talukId);
    resolvedChapterId = defaultChap ? defaultChap.id : `${talukId}_titans`;
  }

  // 1. Capacity check
  const occupancy = db.getTalukOccupancy(talukId, resolvedChapterId);
  if (occupancy.isFull) {
    const error = new Error(`மன்னிக்கவும்! இந்த சாப்டரில் அனுமதிக்கப்பட்ட அதிகபட்ச ${occupancy.maxSeats} இடங்களும் நிரம்பிவிட்டன! (Chapter capacity reached)`);
    error.statusCode = 400;
    throw error;
  }

  // 2. Strict Category Exclusivity Check on (talukId, categoryId, chapterId)
  const exclusivity = db.checkCategoryExclusivity(talukId, categoryId, resolvedChapterId);
  if (!exclusivity.available) {
    const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
    const isSameOwner = exclusivity.occupiedBy && (
      exclusivity.occupiedBy.userId === userId ||
      (cleanPhone && exclusivity.occupiedBy.phone && exclusivity.occupiedBy.phone.replace(/\D/g, '') === cleanPhone)
    );

    if (!isSameOwner) {
      const error = new Error(
        `மன்னிக்கவும்! இந்த கேட்டகிரி ஏற்கனவே "${exclusivity.occupiedBy ? exclusivity.occupiedBy.businessName : 'மற்றொரு நிறுவனம்'}" என்பவரால் பூட்டப்பட்டுள்ளது! (Category already locked by another owner in this chapter)`
      );
      error.statusCode = 409; // HTTP 409 Conflict as specified in Master Prompt
      error.occupiedBy = exclusivity.occupiedBy;
      throw error;
    }

    // Reuse and re-activate existing business for the same owner
    const existingBiz = exclusivity.occupiedBy;
    existingBiz.businessName = businessName || existingBiz.businessName;
    existingBiz.ownerName = ownerName || existingBiz.ownerName;
    existingBiz.phone = cleanPhone || existingBiz.phone;
    existingBiz.email = email || existingBiz.email;
    existingBiz.status = 'active';

    const memberships = db.getTable('memberships');
    let mem = memberships.find(m => m.businessId === existingBiz.id && m.status === 'active');
    if (!mem) {
      mem = {
        id: `mem_${Date.now()}`,
        businessId: existingBiz.id,
        userId: userId || existingBiz.userId,
        talukId,
        chapterId: resolvedChapterId,
        categoryId,
        tier: 'taluk',
        status: 'active',
        startDate: new Date().toISOString().split('T')[0],
        expiryDate: new Date(Date.now() + 365*24*3600*1000).toISOString().split('T')[0],
        annualFee: 1,
        gstAmount: 0,
        totalAmount: 1,
        invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
      };
      memberships.push(mem);
    }

    return {
      success: true,
      business: existingBiz,
      membership: mem,
      isRenewal: true
    };
  }

  const settings = db.getSettings();
  const annualFee = settings.annualFeeTaluk || 1500;
  const gstRate = (settings.gstPercentage || 18) / 100;
  const gstAmount = Math.round(annualFee * gstRate);
  const totalAmount = annualFee + gstAmount;

  // 3. Create Business record
  const newBusinessId = `biz_${Date.now()}`;
  const newBusiness = {
    id: newBusinessId,
    userId: userId || `usr_${Date.now()}`,
    talukId,
    chapterId: resolvedChapterId,
    categoryId,
    businessName,
    ownerName,
    phone: phone.replace(/\D/g, ''),
    email: email || `${phone}@nbn.in`,
    address: address || 'தமிழ்நாடு',
    gstNumber: gstNumber || '',
    tagline: tagline || 'அங்கீகரிக்கப்பட்ட வணிகம்',
    description: description || 'NBN அதிகாரப்பூர்வ உறுப்பினர்.',
    videoBenefitStatus: 'scheduled',
    videoUrl: '',
    rating: 5.0,
    reviewCount: 1,
    status: 'active',
    createdAt: new Date().toISOString()
  };

  const businesses = db.getTable('businesses');
  businesses.push(newBusiness);

  // 4. Create Membership record
  const newMembershipId = `mem_${Date.now()}`;
  const invoiceNumber = `INV-${new Date().getFullYear()}-${String(db.getTable('invoices').length + 1).padStart(4, '0')}`;
  
  const newMembership = {
    id: newMembershipId,
    businessId: newBusinessId,
    userId: newBusiness.userId,
    talukId,
    chapterId: resolvedChapterId,
    categoryId,
    tier: 'taluk',
    status: 'active',
    startDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    annualFee,
    gstAmount,
    totalAmount,
    invoiceNumber
  };

  const memberships = db.getTable('memberships');
  memberships.push(newMembership);

  // 5. Generate Tax Invoice
  const newInvoice = {
    id: `inv_${Date.now()}`,
    invoiceNumber,
    membershipId: newMembershipId,
    businessName: newBusiness.businessName,
    gstin: newBusiness.gstNumber || 'UNREGISTERED',
    sacCode: '998314', // B2B Advertising and Networking Services
    baseAmount: annualFee,
    cgst: Math.round(gstAmount / 2),
    sgst: Math.round(gstAmount / 2),
    totalAmount,
    status: 'paid',
    date: new Date().toISOString().split('T')[0]
  };

  const invoices = db.getTable('invoices');
  invoices.push(newInvoice);

  // 6. Automatically provision Nuvea Studio 4K Video Promotion Benefit
  const newVideoProject = {
    id: `vid_${Date.now()}`,
    businessId: newBusinessId,
    status: 'scheduled',
    shootDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 weeks out
    videoUrl: '',
    cameraGear: 'Sony A7 IV & FX3 Cinema Line',
    notes: '₹25,000 மதிப்பிலான 4K சினிமாடிக் விளம்பர வீடியோ ஷூட் திட்டமிடப்பட்டுள்ளது.'
  };

  const videoProjects = db.getTable('videoProjects');
  videoProjects.push(newVideoProject);

  // 7. Initialize Performance Score Record
  const newPerformance = {
    memberId: newMembershipId,
    leadsGiven: 0,
    leadsReceived: 0,
    closedValue: 0,
    attendancePercent: 100,
    conversionRate: 0,
    score: 50.0,
    eligibleTier: 'Taluk Member'
  };

  const performanceScores = db.getTable('performanceScores');
  performanceScores.push(newPerformance);

  // 8. Add to weekly meeting speaker queue
  const categories = db.getTable('categories');
  const catObj = categories.find(c => c.id === categoryId);
  const speakerQueue = db.getTable('speakerQueue');
  speakerQueue.push({
    id: `spk_${Date.now()}`,
    meetingId: 'meet_current',
    memberId: newMembershipId,
    businessName: newBusiness.businessName,
    speaker: newBusiness.ownerName,
    category: catObj ? catObj.nameTa : 'வணிகம்',
    order: speakerQueue.length + 1,
    speakingPoints: [
      `1. எங்கள் சேவை: ${newBusiness.businessName} - தரமான சேவை & வாடிக்கையாளர் திருப்தி.`,
      `2. எனக்கு வேண்டிய லீட்: புதிய வணிக வாடிக்கையாளர்கள் & B2B தொடர்புகள்.`,
      `3. அடுத்த வாரம் உறுதி: சக உறுப்பினர்களுக்கு குறைந்தபட்சம் 2 தரமான லீட்கள் வழங்குவேன்.`
    ],
    status: 'upcoming'
  });

  // Audit
  db.logAudit(userId || 'public', 'LOCK_CATEGORY_SEAT', 'memberships', newMembershipId, {
    talukId,
    categoryId,
    businessName,
    totalAmount
  });

  db.persist();

  return {
    success: true,
    message: `வாழ்த்துகள்! ${businessName} நிறுவனத்திற்கு எக்ஸ்க்ளூசிவ் சீட் வெற்றிகரமாக லாக் செய்யப்பட்டது!`,
    business: newBusiness,
    membership: newMembership,
    invoice: newInvoice,
    videoProject: newVideoProject
  };
}

module.exports = {
  reserveCategorySeat
};
