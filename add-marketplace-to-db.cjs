const fs = require('fs');
const path = require('path');

const dbJsPath = path.join(__dirname, 'backend', 'database', 'db.js');
let code = fs.readFileSync(dbJsPath, 'utf8');

console.log('--- ADDING MARKETPLACE MODULE METHODS TO db.js ---');

// 1. In ensureStructure(), add marketplace collections
if (!code.includes("'customerRequirements'")) {
  code = code.replace(
    "'announcements', 'notifications', 'awards'",
    "'announcements', 'notifications', 'awards', 'customerRequirements', 'quotations', 'marketplaceOrders', 'transactionReviews', 'disputes'"
  );
}

// 2. Add methods before "const db = new DatabaseEngine();"
const marketplaceMethods = `
  // ==========================================
  // MODULE B: MARKETPLACE DATABASE METHODS
  // ==========================================
  
  createCustomerRequirement(data) {
    if (!this.data.customerRequirements) this.data.customerRequirements = [];
    const id = 'REQ-' + Date.now().toString(36).toUpperCase();
    
    // Auto-match eligible active verified members across ALL chapters
    const allMembers = this.data.businesses || [];
    const matchedMembers = allMembers.filter(m => {
      const catMatch = m.categoryId === data.categoryId || (m.category && m.category.toLowerCase().includes((data.categoryName || '').toLowerCase()));
      return catMatch;
    });

    const matchedChapterIds = Array.from(new Set(matchedMembers.map(m => m.chapterId).filter(Boolean)));
    const matchedMemberIds = matchedMembers.map(m => m.id);

    const reqRecord = {
      id,
      customerId: data.customerId || 'cust_' + Date.now(),
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail || '',
      title: data.title || \`\${data.quantity || ''} \${data.unit || ''} \${data.categoryName || 'தயாரிப்பு'} தேவை\`,
      categoryId: data.categoryId,
      categoryName: data.categoryName,
      quantity: parseInt(data.quantity) || 1,
      unit: data.unit || 'அலகுகள் (Units)',
      brandPreference: data.brandPreference || 'விருப்பத்தேர்வு (Any)',
      specifications: data.specifications || '',
      deliveryDistrict: (data.deliveryDistrict || 'dharmapuri').toLowerCase(),
      deliveryTaluk: (data.deliveryTaluk || 'harur').toLowerCase(),
      deliveryAddress: data.deliveryAddress || '',
      pinCode: data.pinCode || '',
      deliveryRequired: data.deliveryRequired !== false,
      requiredDate: data.requiredDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      status: 'open',
      matchedChapterIds: matchedChapterIds.length > 0 ? matchedChapterIds : ['harur_titans', 'palacode_titans', 'dharmapuri_central'],
      matchedMemberIds,
      selectedQuotationId: null,
      selectedSupplierId: null,
      contactConsent: false,
      consentTimestamp: null,
      createdAt: new Date().toISOString(),
      deadline: data.deadline || new Date(Date.now() + 5 * 86400000).toISOString()
    };

    this.data.customerRequirements.unshift(reqRecord);

    // Notify matching members
    matchedMemberIds.forEach(memId => {
      this.createNotification(memId, {
        title: '🛒 புதிய மார்க்கெட்பிளேஸ் தேவை (New Marketplace Requirement)',
        message: \`உங்கள் பிரிவில் புதிய தேவை சமர்ப்பிக்கப்பட்டுள்ளது: \${reqRecord.title} (\${reqRecord.deliveryTaluk.toUpperCase()})\`,
        type: 'marketplace_lead'
      });
    });

    this.persist();
    return reqRecord;
  }

  getCustomerRequirements(filter = {}, requestingUser = null) {
    let reqs = this.data.customerRequirements || [];
    
    if (filter.customerId) {
      reqs = reqs.filter(r => r.customerId === filter.customerId);
    }
    if (filter.categoryId) {
      reqs = reqs.filter(r => r.categoryId === filter.categoryId);
    }
    if (filter.status) {
      reqs = reqs.filter(r => r.status === filter.status);
    }
    if (filter.talukId && filter.talukId !== 'all') {
      reqs = reqs.filter(r => r.deliveryTaluk === filter.talukId.toLowerCase());
    }
    if (filter.matchedMemberId) {
      reqs = reqs.filter(r => (r.matchedMemberIds || []).includes(filter.matchedMemberId) || r.selectedSupplierId === filter.matchedMemberId);
    }

    // PRIVACY FILTER: Hide customer direct phone/email from suppliers unless consented & selected!
    return reqs.map(r => {
      const isOwner = requestingUser && (requestingUser.id === r.customerId || requestingUser.role === 'super_admin');
      const isSelectedSupplierWithConsent = requestingUser && requestingUser.id === r.selectedSupplierId && r.contactConsent === true;

      if (isOwner || isSelectedSupplierWithConsent) {
        return r; // Full customer details
      }

      // Mask contact info for bidding suppliers / public
      return {
        ...r,
        customerPhone: r.customerPhone ? r.customerPhone.substring(0, 4) + 'XXXXXX' : 'XXXXXX',
        customerEmail: r.customerEmail ? r.customerEmail.substring(0, 2) + '***@***.com' : '',
        deliveryAddress: r.deliveryTaluk ? \`\${r.deliveryTaluk.toUpperCase()}, \${r.deliveryDistrict.toUpperCase()} (விவரம் ஆர்டர் தேர்வுக்குப் பின் வெளிப்படும்)\` : 'மாவட்டம்'
      };
    });
  }

  getCustomerRequirementById(id, requestingUser = null) {
    const r = (this.data.customerRequirements || []).find(req => req.id === id);
    if (!r) return null;

    const isOwner = requestingUser && (requestingUser.id === r.customerId || requestingUser.role === 'super_admin');
    const isSelectedSupplierWithConsent = requestingUser && requestingUser.id === r.selectedSupplierId && r.contactConsent === true;

    if (isOwner || isSelectedSupplierWithConsent) {
      return r;
    }

    return {
      ...r,
      customerPhone: r.customerPhone ? r.customerPhone.substring(0, 4) + 'XXXXXX' : 'XXXXXX',
      customerEmail: r.customerEmail ? r.customerEmail.substring(0, 2) + '***@***.com' : '',
      deliveryAddress: r.deliveryTaluk ? \`\${r.deliveryTaluk.toUpperCase()}, \${r.deliveryDistrict.toUpperCase()}\` : ''
    };
  }

  submitQuotation(data) {
    if (!this.data.quotations) this.data.quotations = [];
    const id = 'QUO-' + Date.now().toString(36).toUpperCase();

    const unitPrice = parseFloat(data.unitPrice) || 0;
    const quantity = parseInt(data.quantity) || 1;
    const subtotal = unitPrice * quantity;
    const gstAmount = parseFloat(data.gstAmount) !== undefined && !isNaN(parseFloat(data.gstAmount)) ? parseFloat(data.gstAmount) : Math.round(subtotal * 0.18);
    const deliveryCharges = parseFloat(data.deliveryCharges) || 0;
    const installationCharges = parseFloat(data.installationCharges) || 0;
    const discount = parseFloat(data.discount) || 0;
    const finalTotal = subtotal + gstAmount + deliveryCharges + installationCharges - discount;

    const quotation = {
      id,
      requirementId: data.requirementId,
      supplierMemberId: data.supplierMemberId,
      supplierBusinessName: data.supplierBusinessName,
      supplierChapterId: data.supplierChapterId || 'harur_titans',
      supplierPhone: data.supplierPhone || '',
      unitPrice,
      quantity,
      subtotal,
      gstAmount,
      deliveryCharges,
      installationCharges,
      discount,
      finalTotal,
      deliveryTimeline: data.deliveryTimeline || '2-3 நாட்களில் டெலிவரி',
      validityDays: parseInt(data.validityDays) || 7,
      validUntil: data.validUntil || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      stockAvailability: data.stockAvailability || 'ரெடி ஸ்டாக் (Ready in Stock)',
      paymentTerms: data.paymentTerms || 'பொருட்கள் கிடைத்ததும் NEFT/UPI',
      warrantyTerms: data.warrantyTerms || 'நிறுவன தயாரிப்பு உத்தரவாதம்',
      notes: data.notes || '',
      status: 'submitted',
      version: 1,
      history: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // If quotation already exists from this supplier for this requirement, update version
    const existingIdx = this.data.quotations.findIndex(q => q.requirementId === data.requirementId && q.supplierMemberId === data.supplierMemberId);
    if (existingIdx !== -1) {
      const prev = this.data.quotations[existingIdx];
      quotation.version = (prev.version || 1) + 1;
      quotation.history = [...(prev.history || []), { ...prev, history: undefined }];
      this.data.quotations[existingIdx] = quotation;
    } else {
      this.data.quotations.unshift(quotation);
    }

    // Notify customer
    const req = (this.data.customerRequirements || []).find(r => r.id === data.requirementId);
    if (req) {
      this.createNotification(req.customerId, {
        title: '💼 புதிய விலைப்புள்ளி வந்தது (New Quotation Received)',
        message: \`\${quotation.supplierBusinessName} உங்கள் தேவைக்கு ₹\${finalTotal} விலையை சமர்ப்பித்துள்ளனர்.\`,
        type: 'quotation_received'
      });
    }

    this.persist();
    return quotation;
  }

  getQuotationsForRequirement(requirementId, requestingUser = null) {
    const allQuotes = (this.data.quotations || []).filter(q => q.requirementId === requirementId);
    if (allQuotes.length === 0) return [];

    // Calculate minimum finalTotal for the "Lowest Quote" badge
    const minTotal = Math.min(...allQuotes.map(q => q.finalTotal));

    const req = (this.data.customerRequirements || []).find(r => r.id === requirementId);
    const isCustomer = requestingUser && req && (requestingUser.id === req.customerId || requestingUser.role === 'customer');
    const isSuperAdmin = requestingUser && requestingUser.role === 'super_admin';

    // COMPETITOR PRIVACY RULE:
    // If user is a supplier/member, they should ONLY see their own quote!
    if (!isCustomer && !isSuperAdmin) {
      const myQuote = allQuotes.find(q => requestingUser && q.supplierMemberId === requestingUser.id);
      return myQuote ? [{ ...myQuote, isLowestQuote: myQuote.finalTotal === minTotal }] : [];
    }

    // Customer or Admin gets to see all quotes with Lowest Price badge
    return allQuotes.map(q => ({
      ...q,
      isLowestQuote: q.finalTotal === minTotal
    }));
  }

  shortlistQuotation(requirementId, quotationId) {
    const quote = (this.data.quotations || []).find(q => q.id === quotationId && q.requirementId === requirementId);
    if (!quote) throw new Error('விலைப்புள்ளி காணப்படவில்லை (Quotation not found)');

    quote.status = 'shortlisted';
    this.persist();
    return quote;
  }

  selectQuotationWithConsent(requirementId, quotationId, customerConsent, customerUser) {
    if (!customerConsent) {
      throw new Error('வாடிக்கையாளர் சம்மதம் கட்டாயம் (Customer explicit consent is required to share contact details)');
    }

    const req = (this.data.customerRequirements || []).find(r => r.id === requirementId);
    if (!req) throw new Error('தேவை விவரம் காணப்படவில்லை (Requirement not found)');

    const quote = (this.data.quotations || []).find(q => q.id === quotationId && q.requirementId === requirementId);
    if (!quote) throw new Error('விலைப்புள்ளி காணப்படவில்லை (Quotation not found)');

    // 1. Mark requirement as selected & record consent
    req.status = 'selected';
    req.selectedQuotationId = quotationId;
    req.selectedSupplierId = quote.supplierMemberId;
    req.contactConsent = true;
    req.consentTimestamp = new Date().toISOString();

    // 2. Mark winning quotation as selected, others as not_selected
    quote.status = 'selected';
    (this.data.quotations || []).forEach(q => {
      if (q.requirementId === requirementId && q.id !== quotationId) {
        q.status = 'not_selected';
      }
    });

    // 3. Create real Order in marketplaceOrders
    if (!this.data.marketplaceOrders) this.data.marketplaceOrders = [];
    const orderId = 'ORD-' + Date.now().toString(36).toUpperCase();
    const newOrder = {
      id: orderId,
      requirementId: req.id,
      quotationId: quote.id,
      customerId: req.customerId,
      customerName: req.customerName,
      customerPhone: req.customerPhone, // UNLOCKED by consent!
      customerEmail: req.customerEmail || '',
      supplierMemberId: quote.supplierMemberId,
      supplierBusinessName: quote.supplierBusinessName,
      itemTitle: req.title,
      finalDealValue: quote.finalTotal,
      orderStatus: 'confirmed',
      orderDate: new Date().toISOString(),
      expectedDeliveryDate: quote.validUntil || req.requiredDate,
      completedDate: null,
      verifiedBusinessValue: quote.finalTotal,
      statusUpdates: [
        { status: 'confirmed', note: 'வாடிக்கையாளர் விலைப்புள்ளியை தேர்வு செய்து ஆர்டர் உறுதிப்படுத்தினார்', time: new Date().toISOString() }
      ],
      disputeId: null
    };

    this.data.marketplaceOrders.unshift(newOrder);

    // Notify selected supplier with unlocked contact details
    this.createNotification(quote.supplierMemberId, {
      title: '🎉 வாழ்த்துகள்! உங்கள் விலைப்புள்ளி தேர்வு செய்யப்பட்டது (Quotation Selected!)',
      message: \`வாடிக்கையாளர் \${req.customerName} உங்கள் ₹\${quote.finalTotal} விலைப்புள்ளியை ஏற்றுக்கொண்டார். தொடர்பு எண்: \${req.customerPhone}\`,
      type: 'deal_won'
    });

    this.persist();
    return { success: true, order: newOrder, requirement: req, quotation: quote };
  }

  updateMarketplaceOrderStatus(orderId, status, actorId, note = '') {
    const order = (this.data.marketplaceOrders || []).find(o => o.id === orderId);
    if (!order) throw new Error('ஆர்டர் காணப்படவில்லை (Order not found)');

    order.orderStatus = status;
    if (status === 'delivered' || status === 'closed' || status === 'customer_confirmed') {
      order.completedDate = new Date().toISOString();
    }

    if (!order.statusUpdates) order.statusUpdates = [];
    order.statusUpdates.push({
      status,
      note: note || \`நிலை "\${status}" என மாற்றப்பட்டது\`,
      actorId,
      time: new Date().toISOString()
    });

    // If order confirmed or completed, record in closed business analytics
    this.persist();
    return order;
  }

  submitTransactionReview(data) {
    if (!this.data.transactionReviews) this.data.transactionReviews = [];
    
    // Integrity check: Order must exist and be completed
    const order = (this.data.marketplaceOrders || []).find(o => o.id === data.orderId);
    if (!order) throw new Error('சரிபார்க்கப்பட்ட ஆர்டர் எண் தேவை (Valid order required)');

    const reviewId = 'REV-' + Date.now().toString(36).toUpperCase();
    const review = {
      id: reviewId,
      orderId: data.orderId,
      customerId: data.customerId || order.customerId,
      customerName: data.customerName || order.customerName,
      supplierMemberId: order.supplierMemberId,
      supplierBusinessName: order.supplierBusinessName,
      rating: parseInt(data.rating) || 5,
      qualityRating: parseInt(data.qualityRating) || 5,
      communicationRating: parseInt(data.communicationRating) || 5,
      deliveryRating: parseInt(data.deliveryRating) || 5,
      comment: data.comment || '',
      createdAt: new Date().toISOString(),
      verifiedPurchase: true
    };

    this.data.transactionReviews.unshift(review);
    this.persist();
    return review;
  }

  lodgeDispute(data) {
    if (!this.data.disputes) this.data.disputes = [];
    const id = 'DISP-' + Date.now().toString(36).toUpperCase();
    const dispute = {
      id,
      orderId: data.orderId,
      customerId: data.customerId,
      supplierMemberId: data.supplierMemberId,
      issueType: data.issueType || 'general',
      description: data.description,
      supplierResponse: '',
      adminNotes: '',
      status: 'lodged',
      createdAt: new Date().toISOString(),
      resolvedAt: null
    };

    this.data.disputes.unshift(dispute);
    
    // Link to order
    const order = (this.data.marketplaceOrders || []).find(o => o.id === data.orderId);
    if (order) order.disputeId = id;

    this.persist();
    return dispute;
  }

  resolveDispute(disputeId, resolutionNotes, adminId) {
    const disp = (this.data.disputes || []).find(d => d.id === disputeId);
    if (!disp) throw new Error('புகார் விபரம் காணப்படவில்லை (Dispute not found)');

    disp.status = 'resolved';
    disp.adminNotes = resolutionNotes;
    disp.resolvedBy = adminId;
    disp.resolvedAt = new Date().toISOString();

    this.persist();
    return disp;
  }

  searchMarketplace(query = '', categoryId = '', districtId = '', talukId = '') {
    const businesses = this.data.businesses || [];
    const categories = this.data.categories || [];
    const q = (query || '').toLowerCase().trim();

    return businesses.filter(b => {
      const matchCat = !categoryId || b.categoryId === categoryId;
      const matchDist = !districtId || districtId === 'all' || (b.districtId || '').toLowerCase() === districtId.toLowerCase();
      const matchTaluk = !talukId || talukId === 'all' || (b.talukId || '').toLowerCase() === talukId.toLowerCase();
      
      let matchQuery = true;
      if (q) {
        matchQuery = (b.businessName || '').toLowerCase().includes(q) ||
                     (b.ownerName || '').toLowerCase().includes(q) ||
                     (b.category || '').toLowerCase().includes(q) ||
                     (b.description || '').toLowerCase().includes(q) ||
                     (b.specialOffer || '').toLowerCase().includes(q);
      }

      return matchCat && matchDist && matchTaluk && matchQuery;
    });
  }
`;

const insertTarget = 'const db = new DatabaseEngine();';
if (code.includes(insertTarget)) {
  code = code.replace(insertTarget, marketplaceMethods + '\n' + insertTarget);
  fs.writeFileSync(dbJsPath, code, 'utf8');
  console.log('✓ Successfully injected all marketplace methods into backend/database/db.js');
} else {
  console.error('Could not find insertTarget in db.js');
}
