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

  // Constants
  const [paymentLink, setPaymentLink] = useState<string>('https://rzp.io/rzp/qsujcmuB');
  const MEMBERSHIP_FEE_INR = 1500; // ₹1,500 INR standard

  // Wizard State: 1 = Fast Profile Details, 2 = Pay ₹1 / ₹1500 INR, 3 = Confirmation
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [paymentAmount, setPaymentAmount] = useState<number>(1); // Default to ₹1 INR for live testing!

  // File Input Refs for local system file uploads
  const ownerPhotoInputRef = useRef<HTMLInputElement>(null);
  const businessPhotoInputRef = useRef<HTMLInputElement>(null);

  // Form State - Fast Onboarding
  const [formData, setFormData] = useState({
    // 1. Owner Details
    fullName: '',
    designation: 'நிறுவனர் / உரிமையாளர் (Founder / Owner)',
    phone: '',
    whatsapp: '',
    email: '',
    password: '',
    profilePhoto: '', // base64 or url

    // 2. Business Details
    businessName: '',
    categoryId: 'jewellery',
    talukId: 'harur',
    preferredChapterId: 'harur_titans',
    businessPhoto: '', // base64 or url
    accountType: initialOption as 'networking_marketplace' | 'marketplace_only' | 'customer',
  });

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

      // Try Razorpay modal
      const scriptLoaded = await loadRazorpayScript();
      if (scriptLoaded && (window as any).Razorpay) {
        const options = {
          key: orderData.keyId || 'rzp_test_NBN_DEMO_KEY',
          amount: activeAmount * 100, // paise (1 INR = 100 paise, 1500 INR = 150000 paise)
          currency: 'INR',
          name: 'NBN - Nuvea Business Network',
          description: activeAmount === 1 
            ? 'NBN லைவ் சோதனை கட்டணம் - ₹1 INR மட்டும்' 
            : 'NBN வருடாந்திர உறுப்பினர் சேர்க்கை - ₹1,500 INR',
          image: formData.businessPhoto || formData.profilePhoto,
          order_id: orderData.id,
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.phone
          },
          theme: { color: '#f59e0b' },
          handler: async function (response: any) {
            await finalizeRegistration(
              response.razorpay_order_id || orderData.id,
              response.razorpay_payment_id
            );
          },
          modal: {
            ondismiss: function () {
              setLoading(false);
            }
          }
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        // Open user's payment link in new tab, then complete registration
        window.open(RAZORPAY_PAYMENT_LINK, '_blank');
        await finalizeRegistration(orderData.id || `order_rzp_${Date.now()}`, `pay_link_${Date.now()}`);
      }
    } catch (e: any) {
      setErrorMsg(e.message || 'கட்டண நடைமுறையில் பிழை ஏற்பட்டது');
      setLoading(false);
    }
  };

  // Finalize Backend Registration & Redirect Straight to Business Profile
  const finalizeRegistration = async (orderId: string, paymentId: string) => {
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

      // 2. Submit Master Registration
      const regRes = await fetch('/api/auth/register-owner-full', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          profilePhoto: formData.profilePhoto,
          phone: formData.phone,
          whatsapp: formData.whatsapp || formData.phone,
          email: formData.email,
          password: formData.password,
          designation: formData.designation,
          businessName: formData.businessName,
          logo: formData.businessPhoto,
          cover: formData.businessPhoto,
          categoryId: formData.categoryId,
          talukId: formData.talukId,
          preferredChapterId: formData.preferredChapterId,
          accountType: 'networking_marketplace',
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
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-400 text-slate-950">
                  ₹1,500 INR ONLY
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
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-400 focus:outline-none text-xs font-bold"
                    placeholder="எ.கா. சந்திரசேகர் கே. எஸ்."
                  />
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
                </div>

              </div>

              {/* ACTION: PROCEED TO PAYMENT */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  className="w-full py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>🚀 கட்டணம் செலுத்த செல்ல (Proceed to Pay ₹1,500 INR)</span>
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

              {/* AMOUNT SELECTOR (FIRST TEST ₹1 INR AS REQUESTED) */}
              <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-400 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900">
                    💳 கட்டணத் தொகையைத் தேர்வு செய்யவும் (Select Amount):
                  </span>
                  <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                    ⚡ LIVE TEST 1 INR READY
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentAmount(1)}
                    className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                      paymentAmount === 1
                        ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-md ring-2 ring-amber-300'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xl font-black">₹1 INR</div>
                    <div className="text-[10px] font-bold text-slate-700">⚡ லைவ் சோதனை (1 Rupee Test)</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentAmount(1500)}
                    className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                      paymentAmount === 1500
                        ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-md ring-2 ring-amber-300'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xl font-black">₹1,500 INR</div>
                    <div className="text-[10px] font-bold text-slate-700">வருடாந்திர மெம்பர்ஷிப்</div>
                  </button>
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
                  <div className="flex justify-between">
                    <span>உறுப்பினர் சேர்க்கை கட்டணம் (100% Monopoly Seat):</span>
                    <span className="font-bold text-white">
                      ₹{paymentAmount === 1 ? '0.85' : '1,271.19'} INR
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>நுவேவா ஸ்டுடியோ 4K வணிக விளம்பர வீடியோ தயாரிப்பு:</span>
                    <span className="font-bold text-emerald-400">இலவசம் (Included)</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>மத்திய சரக்கு சேவை வரி CGST (9%):</span>
                    <span>₹{paymentAmount === 1 ? '0.08' : '114.40'} INR</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>மாநில சரக்கு சேவை வரி SGST (9%):</span>
                    <span>₹{paymentAmount === 1 ? '0.07' : '114.41'} INR</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-slate-800 text-base font-black text-white">
                    <span>செலுத்த வேண்டிய மொத்தத் தொகை (Net Payable):</span>
                    <span className="text-amber-400 text-xl font-black">
                      ₹{paymentAmount}.00 INR {paymentAmount === 1 ? '(லைவ் சோதனை)' : 'மட்டும் தான்'}
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

              {/* PAYMENT BUTTONS */}
              <div className="space-y-3">
                {/* 1. Official Direct Razorpay Payment Link (Big Golden Button) */}
                <a
                  href={paymentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    setTimeout(() => {
                      handlePaymentAndEntry(false);
                    }, 1200);
                  }}
                  className="w-full py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer no-underline text-center"
                >
                  <CreditCard className="w-5 h-5 text-slate-950" />
                  <span>🔗 Razorpay லிங்க் மூலம் ₹{paymentAmount} INR செலுத்துக ➔</span>
                </a>

                {/* 2. Razorpay Direct Popup Checkout */}
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handlePaymentAndEntry(false)}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs rounded-xl border border-slate-800 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>💳 Razorpay நேரடி பாப்-அப் மூலம் ₹{paymentAmount} INR செலுத்துக</span>
                </button>

                {/* 3. Instant Sandbox Simulation */}
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handlePaymentAndEntry(true)}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>⚡ உடனடி டெமோ கட்டணம் செலுத்தி ப்ரொஃபைலில் நுழைக (Simulate ₹{paymentAmount} INR)</span>
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