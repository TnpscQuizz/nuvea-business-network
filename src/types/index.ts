export type Member = {
  id: string;
  businessName: string;
  ownerName: string;
  categoryId: string;
  categoryName?: string;
  talukId: string;
  chapterId?: string;
  phone: string;
  email?: string;
  address?: string;
  specialOffer?: string;
  tagline?: string;
  rating?: number;
  bestPriceRank?: number;
  accountType?: 'networking_marketplace' | 'marketplace_only';
  businessWon?: number;
  referralsReceived?: number;
  referralsGiven?: number;
  logo?: string;
  cover?: string;
  videoUrl?: string;
  mapAddress?: string;
  locationTag?: string;
  mapEmbedUrl?: string;
  latitude?: number;
  longitude?: number;
  status?: string;
  membershipStartDate?: string;
  membershipExpiryDate?: string;
  membershipValidityDays?: number;
  membershipFeePaid?: number;
};

export type Chapter = {
  id: string;
  name: string;
  nameTa?: string;
  nameEn?: string;
  talukId?: string;
  districtId?: string;
  location?: string;
  meetingDay?: string;
  directorName?: string;
  maxSeats?: number;
  filledSeats?: number;
  availableSeats?: number;
};

export type Quotation = {
  id: string;
  supplierId: string;
  supplierName: string;
  basePrice: number;
  taxAmount: number;
  totalPrice: number;
  notes?: string;
  deliveryDays?: number;
  createdAt: string;
};

export type Requirement = {
  id: string;
  title: string;
  category: string;
  budget: number;
  description: string;
  talukId?: string;
  urgency?: string;
  status?: string;
  quotes?: Quotation[];
  createdAt: string;
};

export type Order = {
  id: string;
  buyerName?: string;
  sellerId?: string;
  sellerName?: string;
  items?: Array<{ name: string; qty: number; price: number }>;
  totalAmount: number;
  taxAmount: number;
  status: string;
  createdAt: string;
};

export type User = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  accountType?: string;
  registrationNumber?: string;
  chapterId?: string;
  districtId?: string;
  status?: string;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  sellerId?: string;
  sellerName?: string;
};

export type AppState = {
  members: Member[];
  chapters: Chapter[];
  marketplaceRequirements: Requirement[];
  marketplaceOrders: Order[];
  users: User[];
};

export type BizPost = {
  id: string;
  memberId: string;
  businessName: string;
  ownerName: string;
  avatar: string;
  taluk: string;
  category: string;
  type: 'video' | 'image';
  mediaUrl: string;
  thumbnailUrl?: string;
  caption: string;
  priceTag?: string;
  wholesalePrice?: string;
  retailPrice?: string;
  actionText: string;
  phone: string;
  likes: number;
  isLiked?: boolean;
  dislikes?: number;
  isDisliked?: boolean;
  enquiriesCount: number;
  commentsCount: number;
  createdAt: string;
  isReel?: boolean;
  status?: 'approved' | 'pending' | 'rejected';
  tradeIntent?: 'need' | 'offer' | 'collaborate' | 'general'; // Pillar 4: I NEED / I OFFER / I COLLABORATE
  isSponsored?: boolean; // Pillar 9: Subscription & Advertisements
};

export interface BizReview {
  id: string;
  reviewerBizName: string;
  reviewerAvatar: string;
  rating: number;
  date: string;
  text: string;
  verifiedTrade: boolean;
  dealAmount?: string;
  category?: string;
}

export interface BizReferralSlip {
  id: string;
  fromBizName: string;
  toBizName: string;
  clientName: string;
  clientPhone: string;
  requirement: string;
  estimatedValue: string;
  status: 'submitted' | 'contacted' | 'quoted' | 'deal_won';
  date: string;
}

export type BizStory = {
  id: string;
  memberId: string;
  businessName: string;
  avatar: string;
  mediaUrl: string;
  caption: string;
  offerBadge?: string;
  expiresAt: string;
  hasUnseen?: boolean;
};

export type BizEnquiryMessage = {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  text: string;
  attachedPostId?: string;
  attachedPostTitle?: string;
  attachedPostThumb?: string;
  attachedPrice?: string;
  isQuotation?: boolean;
  quotationData?: { items: string; amount: number; gst: number; total: number };
  timestamp: string;
};

export interface BizOutlet {
  id: string;
  name: string;
  address: string;
  phone: string;
  timing: string;
  isPrimary: boolean;
  district?: string;
}

export interface BizFollowRequest {
  id: string;
  username: string;
  businessName: string;
  avatar: string;
  category: string;
  requestedAt: string;
}

export interface BizProduct {
  id: string;
  sellerId: string;
  sellerName: string;
  name: string;
  category: string;
  price: number; // Unit wholesale price in INR
  moq: number; // Minimum Order Quantity
  unit: string; // e.g. "pieces", "meters", "tons", "sets"
  image: string;
  description: string;
  inStock: boolean;
  gstRate: number; // e.g. 18
  sampleAvailable: boolean;
  samplePrice?: number;
}

export interface BizOrder {
  id: string;
  orderNumber: string; // e.g. "SHN-ORD-88219"
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerAddress: string;
  buyerGstin?: string;
  sellerId: string;
  sellerName: string;
  productId: string;
  productName: string;
  productImage: string;
  qty: number;
  unitPrice: number;
  subtotal: number;
  gstAmount: number;
  totalAmount: number;
  paymentMethod: 'upi_razorpay' | 'net_banking' | 'invoice_credit' | 'pod';
  paymentStatus: 'paid' | 'pending' | 'escrow_hold';
  status: 'placed' | 'confirmed' | 'processing' | 'dispatched' | 'delivered';
  trackingNumber?: string;
  courierPartner?: string;
  estimatedDelivery?: string;
  createdAt: string;
}

export type BizUser = {
  id: string;
  username: string; // Unique Instagram-style handle (e.g. "chandru_nuvea")
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  password?: string;
  avatar: string;
  coverUrl?: string; // Customizable & editable background banner
  taluk: string;
  category: string;
  bio?: string;
  locationTag?: string;
  website?: string;
  gstin?: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  validityDaysLeft: number;
  isPrivateAccount: boolean;
  requiresFollowApproval?: boolean; // Must approve follower requests
  approvedConnections?: string[]; // Usernames/IDs who can chat
  followRequests?: BizFollowRequest[]; // Pending follow requests
  outlets?: BizOutlet[]; // Physical business outlets / branches
  reviews?: BizReview[]; // Pillar 7: Reviews & Trust
  referralsReceived?: BizReferralSlip[]; // Pillar 5: Networking & Referrals
  trustScore?: number; // Pillar 7: Trust Score (e.g. 98%)
  elevationTier?: 'Silver' | 'Gold' | 'Diamond'; // Pillar 5: Elevation Engine
  products?: BizProduct[]; // Phase 1: Mini Store Catalog
  ordersPlaced?: BizOrder[]; // Phase 2: User Order History ("My Purchases")
  ordersReceived?: BizOrder[]; // Phase 2: Business User Dashboard ("Sales & Order Management")
  blockedUsers: string[];
  liveLocationEnabled: boolean;
  mediaUploadQuality: 'high' | 'data_saver';
  devicePermissions: {
    camera: boolean;
    microphone: boolean;
    location: boolean;
    contacts: boolean;
    notifications: boolean;
    talkBox: boolean;
  };
  contentPreferences: string[];
};
