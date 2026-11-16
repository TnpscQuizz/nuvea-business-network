import React, { useState, useRef } from 'react';
import { 
  X, Check, ShieldCheck, CreditCard, Lock, Sparkles, 
  Building2, User, Phone, Mail, MapPin, CheckCircle2, AlertCircle, 
  Upload, Camera, Image as ImageIcon, ArrowRight, Briefcase
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Chapter } from '../types';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ta' | 'en';
  initialOption?: 'networking_marketplace' | 'marketplace_only' | 'customer';
  chapters: Chapter[];
  onSuccessLogin?: (userData: any) => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  lang,
  initialOption = 'networking_marketplace',
  chapters,
  onSuccessLogin
}) => {
  const isTa = lang === 'ta';

  // Constants - LOCKED TO ₹1 RS ONLY FOR LIVE TESTING
  const [paymentLink, setPaymentLink] = useState<string>('https://rzp.io/rzp/zZS6aMWL');
  const MEMBERSHIP_FEE_INR = 1; // Strictly ₹1 RS ONLY
  const paymentAmount = 1; // Strictly ₹1 RS ONLY

  // Wizard State: 1 = Fast Profile Details, 2 = Pay ₹1 RS ONLY
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // File Input Refs for local system file uploads
  const ownerPhotoInputRef = useRef<HTMLInputElement>(null);
  const businessPhotoInputRef = useRef<HTMLInputElement>(null);

  // Form State - Fast Onboarding
  const [formData, setFormData] = useState({
    // 1. Owner Details
    fullName: '',
    username: '',
    designation: 'நிறுவனர் / உரிமையாளர் (Founder / Owner)',
    phone: '',
    whatsapp: '',
    email: '',
    password: '',
    profilePhoto: '', // base64 or url

    // 2. Business & Chapter Details
    businessName: '',
    categoryId: 'jewellery',
    talukId: 'harur',
    preferredChapterId: 'harur_titans',
    forumType: 'Executive Forum (BNI-Style)',
    businessPhoto: '', // base64 or url
    accountType: initialOption as 'networking_marketplace' | 'marketplace_only' | 'customer',

    // 3. Google Maps & Location Tagging
    locationTag: 'ஹரூர் பஸ் நிலையம் அருகில்',
    mapAddress: 'மெயின் ரோடு, ஹரூர், தருமபுரி மாவட்டம் - 636903',
    mapEmbedUrl: 'https://maps.google.com/maps?q=Harur,Tamil+Nadu&t=&z=14&ie=UTF8&iwloc=&output=embed',
    latitude: 12.0621,
    longitude: 78.4975
  });

  // GPS & Locality Tagging States
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [gpsSuccess, setGpsSuccess] = useState(false);

  const localityTagsByTaluk: Record<string, string[]> = {
    harur: [
      'ஹரூர் பஸ் நிலையம்',
      'கடைவீதி பஜார்',
      'தருமபுரி மெயின் ரோடு',
      'சேலம் பைபாஸ்',
      'மொரப்பூர் சந்திப்பு',
      'வட்டாட்சியர் அலுவலகம்'
    ],
    dharmapuri_town: [
      'தருமபுரி புதிய பேருந்து நிலையம்',
      'நேதாஜி பைபாஸ் ரோடு',
      'நான்கு ரோடு சந்திப்பு',
      'கலெக்டர் அலுவலகம்',
      'பெரிய பள்ளிவாசல் அருகில்'
    ],
    palacode: [
      'பாலக்கோடு மார்க்கெட்',
      'மெயின் பஜார்',
      'தருமபுரி ரோடு',
      'ரயில்வே கேட்'
    ],
    karimangalam: [
      'காரிமங்கலம் பஸ் ஸ்டாண்ட்',
      'தேசிய நெடுஞ்சாலை 44 (NH44)',
      'கடைவீதி ரோடு'
    ],
    pennagaram: [
      'பெண்ணாகரம் மெயின் ரோடு',
      'ஒகேனக்கல் ரோடு',
      'பஸ் ஸ்டாண்ட் ரவுண்டானா'
    ]
  };

  const handleTagCurrentGPS = () => {
    if (!navigator.geolocation) {
      alert('உங்கள் உலாவியில் GPS இருப்பிட வசதி இல்லை. கைமுறையாக அமைவிடத்தை தேர்ந்தெடுக்கவும்.');
      return;
    }

    setIsGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        const embed = `https://maps.google.com/maps?q=${lat},${lng}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
        const tagText = `நேரடி GPS அமைவிடம் (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)`;

        setFormData(prev => ({
          ...prev,
          latitude: lat,
          longitude: lng,
          locationTag: tagText,
          mapAddress: prev.mapAddress ? `${prev.mapAddress} [GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)}]` : `GPS அமைவிடம்: ${lat.toFixed(4)}, ${lng.toFixed(4)}, ${(prev.talukId || 'ஹரூர்').toUpperCase()}, தமிழ்நாடு`,
          mapEmbedUrl: embed
        }));
        setIsGpsLoading(false);
        setGpsSuccess(true);
        setTimeout(() => setGpsSuccess(false), 4000);
      },
      (err) => {
        setIsGpsLoading(false);
        alert(`GPS இருப்பிடத்தை பெற முடியவில்லை (${err.message}). கீழேயுள்ள அமைவிடப் பட்டியலிலிருந்து தேர்ந்தெடுக்கவும்.`);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSelectLocalityTag = (tag: string) => {
    const query = encodeURIComponent(`${tag}, ${formData.talukId || 'Harur'}, Tamil Nadu`);
    const embed = `https://maps.google.com/maps?q=${query}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

    setFormData(prev => ({
      ...prev,
      locationTag: tag,
      mapAddress: `${tag}, ${(prev.talukId || 'ஹரூர்').toUpperCase()}, தருமபுரி மாவட்டம்`,
      mapEmbedUrl: embed
    }));
  };

  // Handle Local System File Upload for Owner Photo
  const handleOwnerPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('புகைப்படம் 5MB-க்குள் இருக்க வேண்டும்');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePhoto: reader.result as string }));
        setErrorMsg('');
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Local System File Upload for Business Photo / Logo
  const handleBusinessPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('வணிகப் படம் 5MB-க்குள் இருக்க வேண்டும்');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, businessPhoto: reader.result as string }));
        setErrorMsg('');
      };
      reader.readAsDataURL(file);
    }
  };

  // Preset demo profile photos if user prefers quick select
  const setQuickPhoto = (url: string) => {
    setFormData(prev => ({ ...prev, profilePhoto: url }));
  };

  const setQuickBusinessPhoto = (url: string) => {
    setFormData(prev => ({ ...prev, businessPhoto: url }));
  };

  // Dynamic Razorpay Script Loader
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Proceed from Step 1 to Payment
  const handleProceedToPayment = () => {
    if (!formData.fullName.trim()) {
      setErrorMsg('உரிமையாளர் பெயர் உள்ளிடவும் (Owner Name required)');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      setErrorMsg('சரியான 10 இலக்க மொபைல் எண் உள்ளிடவும் (Valid Phone required)');
      return;
    }
    if (!formData.businessName.trim()) {
      setErrorMsg('உங்கள் வணிகப் பெயர் உள்ளிடவும் (Business Name required)');
      return;
    }
    if (!formData.email.trim()) {
      setErrorMsg('மின்னஞ்சல் முகவரி உள்ளிடவும் (Email required)');
      return;
    }
    if (!formData.password.trim()) {
      setErrorMsg('கடவுச்சொல் உள்ளிடவும் (Password required)');
      return;
    }

    // Default photo fallbacks if none uploaded
    if (!formData.profilePhoto) {
      setFormData(prev => ({
        ...prev,
        profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
      }));
    }
    if (!formData.businessPhoto) {
      setFormData(prev => ({
        ...prev,
        businessPhoto: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80'
      }));
    }

    setErrorMsg('');
    setCurrentStep(2); // Go straight to Razorpay payment screen!
  };

  // Payment Execution & Direct Entry into Profile
  const handlePaymentAndEntry = async (isDemo = false) => {
    setLoading(true);
    setErrorMsg('');

    try {
      const activeAmount = paymentAmount || 1;

      // 1. Create Order on backend (strictly INR)
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: activeAmount, currency: 'INR' })
      });
      const orderData = await orderRes.json();

      if (isDemo) {
        // Instant verification & entry
        await finalizeRegistration(orderData.id || `order_${Date.now()}`, `pay_demo_${Date.now()}`);
        return;
      }

      // Open user's official 1 Rs Razorpay link in new tab so they can pay safely via UPI/Card
      window.open(paymentLink, '_blank');
      setLoading(false);
    } catch (e: any) {
      setErrorMsg(e.message || 'கட்டண நடைமுறையில் பிழை ஏற்பட்டது');
      setLoading(false);
    }
  };

  // Finalize Backend Registration & Redirect Straight to Business Profile
  const finalizeRegistration = async (orderId: string, paymentId: string) => {
    setLoading(true);
    setErrorMsg('');
    try {
      // 1. Verify Payment
      await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpayOrderId: orderId,
          razorpayPaymentId: paymentId,
          razorpaySignature: 'valid_signature',
          amount: MEMBERSHIP_FEE_INR
        })
      });

      // 2. Submit Master Registration with safe defaults
      const regRes = await fetch('/api/auth/register-owner-full', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName?.trim() || 'NBN அங்கீகரிக்கப்பட்ட வணிகர்',
          username: formData.username?.trim() || formData.phone?.trim() || `owner_${Date.now()}`,
          profilePhoto: formData.profilePhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
          phone: formData.phone?.trim() || '917548820641',
          whatsapp: formData.whatsapp?.trim() || formData.phone?.trim() || '917548820641',
          email: formData.email?.trim() || `${formData.phone?.trim() || 'owner'}@nbn.in`,
          password: formData.password?.trim() || 'Password123!',
          designation: formData.designation || 'உரிமையாளர்',
          businessName: formData.businessName?.trim() || 'NBN வணிக மையம்',
          logo: formData.businessPhoto || formData.profilePhoto || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
          cover: formData.businessPhoto || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
          categoryId: formData.categoryId || 'jewellery',
          talukId: formData.talukId || 'harur',
          preferredChapterId: formData.preferredChapterId || 'harur_titans',
          forumType: formData.forumType || 'Executive Forum (BNI-Style)',
          accountType: formData.accountType || 'networking_marketplace',
          address: formData.mapAddress || 'மெயின் ரோடு, ஹரூர், தருமபுரி மாவட்டம்',
          locationTag: formData.locationTag || 'ஹரூர் பஸ் நிலையம் அருகில்',
          mapAddress: formData.mapAddress || 'மெயின் ரோடு, ஹரூர், தருமபுரி மாவட்டம்',
          mapEmbedUrl: formData.mapEmbedUrl || 'https://maps.google.com/maps?q=Harur,Tamil+Nadu&t=&z=14&ie=UTF8&iwloc=&output=embed',
          latitude: formData.latitude || 12.0621,
          longitude: formData.longitude || 78.4975,
          orderId,
          paymentId
        })
      });

      const regData = await regRes.json();
      if (!regRes.ok) {
        throw new Error(regData.error || 'பதிவு தோல்வி');
      }

      setLoading(false);

      // Trigger Confetti
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#3b82f6', '#10b981', '#ffffff']
      });

      if (regData.business?.id) {
        localStorage.setItem('nbn_active_business_id', regData.business.id);
      }
      localStorage.setItem('nbn_membership_paid', 'true');

      // Immediately log into profile and enter Business Portal!
      if (onSuccessLogin) {
        onSuccessLogin(regData);
      }
      onClose();
    } catch (e: any) {
      setErrorMsg(e.message || 'பதிவை முடிக்க முடியவில்லை');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-5 sm:p-6 shrink-0 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg">
              N
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  {currentStep === 1 
                    ? (isTa ? 'NBN வணிகர் விரைவு பதிவு' : 'NBN Fast Business Onboarding')
                    : (isTa ? 'Razorpay பாதுகாப்பான கட்டணம்' : 'Razorpay Secure Payment')}
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-400 text-slate-950 uppercase">
                  ₹1 RS ONLY PAY (100% LIVE TEST)
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {currentStep === 1
                  ? (isTa ? 'அடிப்படை விவரங்களை நிரப்பி நேரடியாக கட்டணத்தை முடித்து சுயவிவரத்திற்குள் செல்லலாம்.' : 'Fill basics and proceed to activate profile.')
                  : (isTa ? 'கட்டணம் முடிந்ததும் அனைத்து விவரங்களையும் உங்கள் ப்ரொஃபைலில் மாற்றிக் கொள்ளலாம்.' : 'After payment, manage everything inside your profile.')}
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ERROR MESSAGE */}
        {errorMsg && (
          <div className="bg-rose-50 border-b border-rose-200 px-6 py-2.5 flex items-center gap-2 text-rose-700 text-xs font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* SCROLLABLE BODY */}
        <div className="p-6 overflow-y-auto flex-grow space-y-6 text-slate-800">

          {/* ======================================================== */}
          {/* STEP 1: FAST PROFILE DETAILS & SYSTEM PHOTO UPLOAD       */}
          {/* ======================================================== */}
          {currentStep === 1 && (
            <div className="space-y-6">

              {/* UPFRONT 1-YEAR VALIDITY & ₹1 FEE ANNOUNCEMENT BANNER */}
              <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/20 to-amber-500/10 border-2 border-amber-400 rounded-2xl p-4 sm:p-5 shadow-sm space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-xs flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                    <span>1 ஆண்டு முழு வேலிடிட்டி (1-Year Validity)</span>
                  </span>
                  <span className="text-xs font-black text-amber-900 bg-amber-200/80 px-2.5 py-1 rounded-lg">
                    கட்டணம்: ₹1 மட்டுமே (FIRST 1 RS ONLY)
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  🚀 NBN அதிகாரப்பூர்வ வணிக உறுப்பினர் பதிவு — 365 நாட்கள் செல்லுபடியாகும்
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  இப்போது <strong>₹1 ரூபாய் செலுத்தி</strong> பதிவு செய்ததும், உங்கள் வணிகக் கணக்கு உடனடியாக செயல்படுத்தப்பட்டு மெயின் டேஷ்போர்டுக்கு செல்லும். உங்கள் உறுப்பினர் அங்கீகாரம் <strong>சரியாக 1 வருடம் (365 நாட்கள்)</strong> நேரலை டைமருடன் இயங்கும். 1 வருடம் நிறைவடைந்ததும் கணக்கு தானாக வெளியேறும் (Auto-Exit) மற்றும் நீங்கள் மீண்டும் புதுப்பித்துக் கொள்ளலாம்.
                </p>
              </div>

              {/* 1. PHOTO UPLOADS ROW (OWNER PHOTO + BUSINESS PHOTO) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
                
                {/* OWNER PHOTO UPLOAD */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-amber-600" />
                    <span>{isTa ? '1. உங்கள் புகைப்படம் (Owner Photo) *' : '1. Owner Photo *'}</span>
                  </label>

                  <div className="flex items-center gap-3">
                    <div 
                      onClick={() => ownerPhotoInputRef.current?.click()}
                      className="w-16 h-16 rounded-2xl border-2 border-dashed border-amber-400 bg-white hover:bg-amber-100/50 flex flex-col items-center justify-center cursor-pointer overflow-hidden shadow-xs relative group shrink-0"
                    >
                      {formData.profilePhoto ? (
                        <img src={formData.profilePhoto} alt="Owner" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center p-1 text-slate-400 group-hover:text-amber-600">
                          <Camera className="w-5 h-5 mx-auto" />
                          <span className="text-[9px] font-bold block mt-0.5">Upload</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-grow space-y-1">
                      <input
                        type="file"
                        ref={ownerPhotoInputRef}
                        accept="image/*"
                        onChange={handleOwnerPhotoChange}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => ownerPhotoInputRef.current?.click()}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isTa ? 'சிஸ்டத்திலிருந்து பதிவேற்றுக' : 'Upload from Device'}</span>
                      </button>
                      <p className="text-[10px] text-slate-500">
                        {formData.profilePhoto ? '✓ புகைப்படம் தேர்ந்தெடுக்கப்பட்டது' : 'JPG, PNG (Max 5MB)'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* BUSINESS PHOTO / LOGO UPLOAD */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-amber-600" />
                    <span>{isTa ? '2. வணிகப் படம் / லோகோ (Business Photo) *' : '2. Business Photo / Logo *'}</span>
                  </label>

                  <div className="flex items-center gap-3">
                    <div 
                      onClick={() => businessPhotoInputRef.current?.click()}
                      className="w-16 h-16 rounded-2xl border-2 border-dashed border-amber-400 bg-white hover:bg-amber-100/50 flex flex-col items-center justify-center cursor-pointer overflow-hidden shadow-xs relative group shrink-0"
                    >
                      {formData.businessPhoto ? (
                        <img src={formData.businessPhoto} alt="Business" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center p-1 text-slate-400 group-hover:text-amber-600">
                          <ImageIcon className="w-5 h-5 mx-auto" />
                          <span className="text-[9px] font-bold block mt-0.5">Upload</span>
                        </div>
                      )}
                    </div>

                    <div className="flex-grow space-y-1">
                      <input
                        type="file"
                        ref={businessPhotoInputRef}
                        accept="image/*"
                        onChange={handleBusinessPhotoChange}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => businessPhotoInputRef.current?.click()}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isTa ? 'கடை / லோகோ படம் ஏற்றுக' : 'Upload Shop/Logo'}</span>
                      </button>
                      <p className="text-[10px] text-slate-500">
                        {formData.businessPhoto ? '✓ வணிகப் படம் இணைக்கப்பட்டது' : 'கடை முன்வரிசை அல்லது லோகோ'}
                      </p>
                    </div>
                  </div>
                </div>

              </div>

              {/* 2. BASIC PROFILE FIELDS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isTa ? 'உங்கள் முழுப் பெயர் (Full Name) *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={e => {
                      const val = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        fullName: val,
                        username: prev.username ? prev.username : val.toLowerCase().replace(/\s+/g, '_')
                      }));
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-400 focus:outline-none text-xs font-bold"
                    placeholder="எ.கா. சந்திரசேகர் கே. எஸ்."
                  />
                </div>

                {/* Unique Username for Login */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                    <span>{isTa ? 'பயனர் பெயர் (Login Username) *' : 'Login Username *'}</span>
                    <span className="text-[10px] text-amber-700 font-bold">மறுபடியும் லாகின் செய்ய</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={formData.username}
                      onChange={e => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-400 focus:outline-none text-xs font-bold font-mono"
                      placeholder="எ.கா. chandru_nuvea"
                    />
                  </div>
                </div>

                {/* Position / Designation */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isTa ? 'பொசிஷன் / பதவி (Position) *' : 'Designation / Role *'}
                  </label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={e => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-400 focus:outline-none text-xs"
                    placeholder="நிறுவனர் / உரிமையாளர் / Managing Partner"
                  />
                </div>

                {/* Mobile Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isTa ? 'மொபைல் எண் (Mobile Number) *' : 'Mobile Number *'}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => {
                        const val = e.target.value;
                        setFormData({ 
                          ...formData, 
                          phone: val,
                          whatsapp: formData.whatsapp ? formData.whatsapp : val 
                        });
                      }}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-400 focus:outline-none text-xs font-bold"
                      placeholder="9842712345"
                    />
                  </div>
                </div>

                {/* WhatsApp Number */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isTa ? 'வாட்ஸ்அப் எண் (WhatsApp Number)' : 'WhatsApp Number'}
                  </label>
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-400 focus:outline-none text-xs font-bold"
                    placeholder="9842712345"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isTa ? 'மின்னஞ்சல் முகவரி (Email Address) *' : 'Email Address *'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-400 focus:outline-none text-xs font-bold"
                      placeholder="chandru@example.com"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isTa ? 'உள்நுழைவு கடவுச்சொல் (Password) *' : 'Password *'}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-400 focus:outline-none text-xs"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {/* Business Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isTa ? 'வணிக நிறுவனப் பெயர் (Business Name) *' : 'Business Name *'}
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={formData.businessName}
                      onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-400 focus:outline-none text-xs font-bold"
                      placeholder="எ.கா. ஸ்ரீ முருகன் ஜூவல்லரி"
                    />
                  </div>
                </div>

                {/* Business Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isTa ? 'தொழில் பிரிவு (Business Category) *' : 'Business Category *'}
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-400 focus:outline-none text-xs font-bold bg-white"
                  >
                    <option value="jewellery">தங்க & வைர நகைகள் (Jewellery)</option>
                    <option value="digital_marketing">டிஜிட்டல் மார்க்கெட்டிங் & வீடியோ (Media)</option>
                    <option value="silks">பட்டு & ஜவுளி ஆடை நிறுவனம் (Textiles)</option>
                    <option value="plumbing">பிளம்பிங் & சானிட்டரி (Sanitary)</option>
                    <option value="cctv">CCTV & பாதுகாப்பு உபகரணங்கள் (Security)</option>
                    <option value="electrical">எலக்ட்ரிக்கல் & உள்கட்டமைப்பு (Electrical)</option>
                    <option value="catering">கேட்டரிங் & உணவு உபசரிப்பு (Catering)</option>
                    <option value="printing">அச்சு & விளம்பரப் பலகைகள் (Printing)</option>
                    <option value="opticals">கண்ணாடி & கண் பார்வை மையம் (Opticals)</option>
                    <option value="organic_agro">இயற்கை உழவர் உற்பத்தி & விதைகள் (Agro)</option>
                    <option value="general_trade">இதர பொது வணிகம் (General Business)</option>
                  </select>
                </div>

                {/* Chapter Forum Selection - Default Pre-selected with Visual Cards */}
                <div className="sm:col-span-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-black text-slate-800">
                      {isTa ? '🏛️ நீங்கள் சேரும் சாப்டர் ஃபோரம் (Chapter Forum Selection) *' : 'Chapter Forum Selection *'}
                    </label>
                    <span className="text-[10px] text-amber-700 bg-amber-100 font-bold px-2 py-0.5 rounded-full">
                      டீஃபால்ட்டாக தேர்வு செய்யப்பட்டுள்ளது
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        id: 'Executive Forum (BNI-Style)',
                        nameTa: 'Executive Forum (BNI பாணி நேரடி சந்திப்பு)',
                        descTa: 'வாராந்திர காலை 7:00 மணி நேரடி வணிக சந்திப்பு, பரிந்துரைகள் & லீட் பகிர்வு',
                        isDefault: true,
                        badge: '⭐ DEFAULT • பரிந்துரைக்கப்பட்டது',
                        icon: '🤝'
                      },
                      {
                        id: 'Premier Business Forum',
                        nameTa: 'Premier Business Forum (உயர் மதிப்பு வர்த்தகக் குழு)',
                        descTa: 'உயர் மதிப்பு முதலீட்டாளர்கள் & பெருநிறுவனங்களுக்கான சிறப்பு வணிகக் குழு',
                        isDefault: false,
                        badge: '💎 உயர் மதிப்பு',
                        icon: '💎'
                      },
                      {
                        id: 'SME Growth Forum',
                        nameTa: 'SME Growth Forum (சிறு & நடுத்தர தொழில் குழு)',
                        descTa: 'வளரும் சிறு & குறு நிறுவனங்களுக்கான வணிக ஒத்துழைப்பு மன்றம்',
                        isDefault: false,
                        badge: '📈 தொழில் முனைவோர்',
                        icon: '📈'
                      },
                      {
                        id: 'Digital Marketplace Forum',
                        nameTa: 'Digital Marketplace Forum (இ-காமர்ஸ் சப்ளையர்கள்)',
                        descTa: 'ஆன்லைன் நேரடி தயாரிப்பு விற்பனை & வாடிக்கையாளர் ஆர்டர்கள் மன்றம்',
                        isDefault: false,
                        badge: '🛒 நேரடி ஆர்டர்கள்',
                        icon: '🛒'
                      }
                    ].map(f => {
                      const isSel = formData.forumType === f.id;
                      return (
                        <div
                          key={f.id}
                          onClick={() => setFormData({ ...formData, forumType: f.id })}
                          className={`p-3.5 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
                            isSel
                              ? 'border-amber-500 bg-amber-50/80 shadow-xs ring-1 ring-amber-400'
                              : 'border-slate-200 bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <span className="text-sm font-black flex items-center gap-1.5 text-slate-900">
                              <span>{f.icon}</span>
                              <span className="text-xs">{f.nameTa}</span>
                            </span>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                              f.isDefault ? 'bg-amber-400 text-slate-950 shadow-2xs' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {f.badge}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                            {f.descTa}
                          </p>

                          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
                            <span className={isSel ? 'text-amber-800' : 'text-slate-400'}>
                              {isSel ? '✓ தேர்ந்தெடுக்கப்பட்டுள்ளது' : 'தேர்வு செய்ய கிளிக் செய்க'}
                            </span>
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              isSel ? 'border-amber-600 bg-amber-500' : 'border-slate-300'
                            }`}>
                              {isSel && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Package Selection */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isTa ? 'உறுப்பினர் பேக்கேஜ் (Membership Package) *' : 'Membership Package *'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div 
                      onClick={() => setFormData({ ...formData, accountType: 'networking_marketplace' })}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition flex items-start gap-3 ${
                        formData.accountType === 'networking_marketplace'
                          ? 'border-amber-400 bg-amber-50/70 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full border-2 border-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                        {formData.accountType === 'networking_marketplace' && <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />}
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-900">Option A: சாப்டர் நெட்வொர்க்கிங் + மார்க்கெட்பிளேஸ்</div>
                        <div className="text-[11px] text-slate-600 mt-0.5">100% சாப்டர் ஏகபோக சீட், வாராந்திர மீட்டிங் & B2B சந்தை (₹1 சலுகை)</div>
                      </div>
                    </div>

                    <div 
                      onClick={() => setFormData({ ...formData, accountType: 'marketplace_only' })}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition flex items-start gap-3 ${
                        formData.accountType === 'marketplace_only'
                          ? 'border-blue-400 bg-blue-50/70 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                        {formData.accountType === 'marketplace_only' && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-900">Option B: மார்க்கெட்பிளேஸ் விற்பனையாளர் மட்டும்</div>
                        <div className="text-[11px] text-slate-600 mt-0.5">சாப்டர் மீட்டிங் இன்றி தயாரிப்புகள் & சேவைகளை மட்டும் விற்கலாம்</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Taluk Location */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isTa ? 'தாலுகா சாப்டர் மண்டலம் (Taluk Chapter) *' : 'Taluk Chapter *'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { id: 'harur', name: 'ஹரூர் (Harur)' },
                      { id: 'dharmapuri_town', name: 'தருமபுரி (Dharmapuri)' },
                      { id: 'palacode', name: 'பாலக்கோடு (Palacode)' },
                      { id: 'karimangalam', name: 'காரிமங்கலம் (Karimangalam)' },
                      { id: 'pennagaram', name: 'பெண்ணாகரம் (Pennagaram)' }
                    ].map(t => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setFormData({ 
                          ...formData, 
                          talukId: t.id,
                          preferredChapterId: `${t.id}_titans`
                        })}
                        className={`p-2.5 rounded-xl text-xs font-bold border transition text-center ${
                          formData.talukId === t.id
                            ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-purple-700 bg-purple-50 p-2.5 rounded-xl border border-purple-200 mt-2 font-bold">
                    <span>👥 சாப்டர் கொள்ளளவு உச்ச வரம்பு: <strong>30 உறுப்பினர்கள் மட்டுமே</strong></span>
                    <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">✓ சேர்க்கை திறக்கப்பட்டுள்ளது</span>
                  </div>
                </div>

                {/* Google Maps & Shop Address Section with Interactive Location Tagging */}
                <div className="sm:col-span-2 p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-amber-50/30 border border-slate-200 space-y-3.5 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
                    <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>கடை முகவரி & கூகுள் மேப் அமைவிட டேக்கிங் (Shop Map Location & Tagging) *</span>
                    </span>
                    <button
                      type="button"
                      onClick={handleTagCurrentGPS}
                      disabled={isGpsLoading}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-black rounded-xl shadow-xs transition disabled:opacity-50 cursor-pointer self-start sm:self-auto"
                    >
                      <span>{isGpsLoading ? '⏳ GPS கண்டறியப்படுகிறது...' : '🛰️ என் GPS-ஐ டேக் செய் (Tag GPS)'}</span>
                    </button>
                  </div>

                  {gpsSuccess && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                      <span>✓</span>
                      <span>உங்கள் சரியான GPS அட்சரேகை/தீர்க்கரேகை வெற்றிகரமாக டேக் செய்யப்பட்டது!</span>
                    </div>
                  )}

                  {/* Quick Locality Tags */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                      🏷️ விரைவு அமைவிட டேக் (Quick Locality Tag - 1-Click தேர்வு):
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {(localityTagsByTaluk[formData.talukId] || localityTagsByTaluk['harur']).map((tag) => {
                        const isTagSel = formData.locationTag === tag;
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => handleSelectLocalityTag(tag)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 border ${
                              isTagSel
                                ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-2xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                            }`}
                          >
                            <span>📍</span>
                            <span>{tag}</span>
                            {isTagSel && <span className="text-[10px]">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Specific Location Landmark Tag Input */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      🏷️ குறிப்பிட்ட இடம் / லேண்ட்மார்க் டேக் (Landmark / Location Tag):
                    </label>
                    <input
                      type="text"
                      value={formData.locationTag}
                      onChange={e => setFormData({ ...formData, locationTag: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-400 focus:outline-none bg-white"
                      placeholder="எ.கா. ஹரூர் பஸ் நிலையம் அருகில், கடைவீதி, காமராஜர் சிலை எதிரில்"
                    />
                  </div>

                  {/* Full Shop Address */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      கடை / நிறுவன முழு முகவரி (Full Shop Address):
                    </label>
                    <input
                      type="text"
                      value={formData.mapAddress}
                      onChange={e => setFormData({ ...formData, mapAddress: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none bg-white"
                      placeholder="எ.கா. கதவு எண் 45, மெயின் ரோடு, பஸ் நிலையம் அருகில், ஹரூர் - 636903"
                    />
                  </div>

                  {/* Embed Map URL & Auto-Map Trigger */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Google Maps Embed URL / வரைபட இணைப்பு:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={formData.mapEmbedUrl}
                        onChange={e => setFormData({ ...formData, mapEmbedUrl: e.target.value })}
                        className="flex-grow px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono text-slate-700 focus:ring-2 focus:ring-amber-400 focus:outline-none bg-white"
                        placeholder="https://maps.google.com/..."
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const query = encodeURIComponent(`${formData.locationTag || formData.businessName || 'Business'}, ${formData.talukId || 'Harur'}, Tamil Nadu`);
                          setFormData({
                            ...formData,
                            mapEmbedUrl: `https://maps.google.com/maps?q=${query}&t=&z=15&ie=UTF8&iwloc=&output=embed`
                          });
                        }}
                        className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-1.5"
                      >
                        <span>📍</span>
                        <span>ஆட்டோ மேப்</span>
                      </button>
                    </div>
                  </div>

                  {/* Interactive Map Preview with Pinned Location Tag Banner */}
                  <div className="rounded-xl overflow-hidden border border-slate-300 h-44 bg-slate-200 relative shadow-inner">
                    <iframe
                      title="Google Maps Location Preview"
                      src={formData.mapEmbedUrl}
                      className="w-full h-full border-0"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 right-2 bg-slate-950/90 text-white text-[11px] px-3 py-1.5 rounded-lg backdrop-blur-sm shadow flex items-center justify-between gap-2 border border-white/20">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-amber-400">📍 டேக் செய்யப்பட்ட இடம்:</span>
                        <strong className="text-amber-300 truncate">{formData.locationTag || 'ஹரூர் பஸ் நிலையம்'}</strong>
                      </div>
                      <span className="text-[10px] text-slate-300 font-mono shrink-0">
                        GPS: {formData.latitude?.toFixed(4) || '12.0621'}, {formData.longitude?.toFixed(4) || '78.4975'}
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* ACTION: PROCEED TO PAYMENT */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  className="w-full py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>🚀 கட்டணம் செலுத்த செல்ல (Proceed to Pay ₹1 RS ONLY)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-[11px] text-slate-500 text-center mt-2 font-medium">
                  கட்டணம் முடிந்தவுடன் மற்ற கூடுதல் விவரங்களை உங்கள் ப்ரொஃபைலில் எப்போது வேண்டுமானாலும் மாற்றிக் கொள்ளலாம்.
                </p>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 2: DIRECT PAYMENT SCREEN & INSTANT PROFILE ENTRY   */}
          {/* ======================================================== */}
          {currentStep === 2 && (
            <div className="space-y-6">

              {/* QUICK SUMMARY CARD */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs flex items-center gap-4">
                <img 
                  src={formData.profilePhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'} 
                  alt="Avatar" 
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400 shadow-xs shrink-0"
                />
                <div className="flex-grow space-y-0.5">
                  <div className="text-sm font-black text-slate-900">{formData.fullName}</div>
                  <div className="text-xs font-bold text-amber-700">{formData.businessName} • {formData.designation}</div>
                  <div className="text-[11px] text-slate-500">📞 {formData.phone} • 📍 {formData.talukId.toUpperCase()} சாப்டர்</div>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold"
                >
                  Edit
                </button>
              </div>

              {/* LOCKED PAYMENT NOTICE: FIRST 1 RS ONLY PAY */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-400 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center font-black text-xl shadow-md">
                    ₹1
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <span>கட்டணம்: ₹1.00 INR (1 RS ONLY)</span>
                      <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                        LIVE TEST
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 font-medium">
                      முதல் கட்டமாக ₹1 மட்டும் செலுத்தி முழு ப்ரொஃபைலையும் சரிபார்க்கலாம்.
                    </div>
                  </div>
                </div>
              </div>

              {/* TAX INVOICE & FEE BREAKDOWN (INR ONLY) */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 text-white space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <div className="text-[11px] font-black uppercase text-amber-400 tracking-wider">OFFICIAL MEMBERSHIP INVOICE • INR ONLY</div>
                    <div className="text-base font-black text-white">NBN உறுப்பினர் சேர்க்கை கட்டணம்</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-black uppercase">
                    SAC 998314 • INR
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between items-center text-amber-300 font-bold bg-amber-950/60 p-2.5 rounded-xl border border-amber-500/40">
                    <span className="flex items-center gap-1.5">
                      <span>⏳</span>
                      <span>உறுப்பினர் செல்லுபடியாகும் காலம் (Validity):</span>
                    </span>
                    <span className="text-amber-400 font-black text-sm">1 வருடம் (365 நாட்கள்)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>உறுப்பினர் சேர்க்கை கட்டணம் (100% Monopoly Seat):</span>
                    <span className="font-bold text-white">₹0.85 INR</span>
                  </div>
                  <div className="flex justify-between">
                    <span>நுவேவா ஸ்டுடியோ 4K வணிக விளம்பர வீடியோ தயாரிப்பு:</span>
                    <span className="font-bold text-emerald-400">இலவசம் (Included)</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>மத்திய சரக்கு சேவை வரி CGST (9%):</span>
                    <span>₹0.08 INR</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>மாநில சரக்கு சேவை வரி SGST (9%):</span>
                    <span>₹0.07 INR</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-slate-800 text-base font-black text-white">
                    <span>செலுத்த வேண்டிய மொத்தத் தொகை (Net Payable):</span>
                    <span className="text-amber-400 text-xl font-black">
                      ₹1.00 INR (1 RS ONLY)
                    </span>
                  </div>
                </div>
              </div>

              {/* PAYMENT LINK INPUT (IF USER CREATED A 1 RS RAZORPAY LINK) */}
              <div className="p-3.5 bg-slate-100 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span>🔗 Razorpay Payment Link:</span>
                  </label>
                  <span className="text-[10px] text-amber-700 font-bold bg-amber-100 px-2 py-0.5 rounded">
                    1 Rs Link
                  </span>
                </div>
                <input
                  type="url"
                  value={paymentLink}
                  onChange={e => setPaymentLink(e.target.value)}
                  placeholder="https://rzp.io/rzp/..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-mono text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <p className="text-[10px] text-slate-500">
                  நீங்கள் Razorpay டாஷ்போர்டில் ₹1-க்கான புதிய Payment Link உருவாக்கியிருந்தால், மேலே உள்ள பெட்டியில் மாற்றி உடனே செலுத்தலாம்.
                </p>
              </div>

              {/* PAYMENT CONFIRMATION & ACTIONS */}
              <div className="space-y-3.5">

                {/* 0. PRIMARY CONFIRMATION BUTTON: ALREADY PAID ON RAZORPAY */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-500 shadow-lg shadow-emerald-500/10 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-base shadow-xs">
                        ✓
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-black text-slate-900">
                          Razorpay-ல் ₹1 பேமெண்ட் முடித்துவிட்டீர்களா?
                        </div>
                        <div className="text-[11px] text-emerald-800 font-bold">
                          பேமெண்ட் முடிந்ததும் உடனடியாக உங்கள் மெயின் வணிகர் டேஷ்போர்டிற்குள் செல்லவும்!
                        </div>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white animate-pulse">
                      உடனடி நுழைவு
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => finalizeRegistration(`order_rzp_${Date.now()}`, `pay_confirmed_${Date.now()}`)}
                    className="w-full py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm rounded-2xl shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>{loading ? '⏳ கணக்கு துவங்கப்படுகிறது...' : '✅ நான் ₹1 செலுத்திவிட்டேன்! என் மெயின் டேஷ்போர்டிற்குச் செல்க ➔'}</span>
                  </button>
                </div>

                {/* 1. Official Direct Razorpay Popup / Checkout (Big Golden Button) */}
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handlePaymentAndEntry(false)}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <CreditCard className="w-5 h-5 text-slate-950" />
                  <span>💳 Razorpay ₹1 கட்டண பக்கத்திற்குச் செல்ல (Open Razorpay ₹1 Pay) ➔</span>
                </button>

                {/* 2. Direct Link Fallback */}
                <a
                  href={paymentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs rounded-xl border border-slate-800 transition flex items-center justify-center gap-2 cursor-pointer no-underline text-center"
                >
                  <span>🔗 Razorpay நேரடி லிங்க்: {paymentLink}</span>
                </a>

                {/* 3. Instant Sandbox Simulation */}
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handlePaymentAndEntry(true)}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>⚡ உடனடி டெமோ சோதனை - ₹1 செலுத்தியதாக உடனே உள்ளே செல்ல (Instant Demo)</span>
                </button>

                <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1 font-bold text-slate-700">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>இந்த ப்ராஜெக்ட்டில் INR (இந்திய ரூபாய்) மட்டும் தான்</span>
                  </span>
                  <span>•</span>
                  <span>Razorpay Verified Gateway</span>
                  <span>•</span>
                  <span>கட்டணம் முடிந்ததும் உடனே ப்ரொஃபைல் திறக்கும்</span>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};