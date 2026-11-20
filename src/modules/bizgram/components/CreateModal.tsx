import React, { useState, useRef } from 'react';
import { 
  X, Upload, Film, Image as ImageIcon, MapPin, Tag, 
  Hash, Sparkles, CheckCircle2, Play, Pause, AlertCircle, 
  ChevronDown, Layers, FileText, Smartphone, Laptop 
} from 'lucide-react';
import type { BizPost } from '../../../types';
import { translations, type Language } from '../data/translations';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePost: (post: BizPost) => void;
  initialAction?: 'post' | 'reel' | 'update' | 'offer';
  lang?: Language;
  currentUser: {
    businessName: string;
    ownerName: string;
    avatar: string;
    taluk: string;
    category: string;
    phone: string;
  };
}

export const CreateModal: React.FC<CreateModalProps> = ({
  isOpen,
  onClose,
  onCreatePost,
  initialAction = 'post',
  lang = 'en',
  currentUser,
}) => {
  const t = translations[lang] || translations.en;
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Media Upload State (Direct Computer / Phone file upload)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [mediaType, setMediaType] = useState<'video' | 'image'>(initialAction === 'reel' ? 'video' : 'video');
  const [isDragging, setIsDragging] = useState(false);
  
  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hashtags, setHashtags] = useState('#B2B #Wholesale #Manufacturing');
  const [location, setLocation] = useState(currentUser.taluk || 'Chennai');
  const [category, setCategory] = useState(currentUser.category || 'Manufacturing');
  const [wholesalePrice, setWholesalePrice] = useState('');
  const [retailPrice, setRetailPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressStage, setProgressStage] = useState('Encoding 4K Ultra-Glass Master...');

  // Synchronize initialAction presets when modal opens
  React.useEffect(() => {
    if (isOpen) {
      if (initialAction === 'reel') {
        setMediaType('video');
        if (!title) setTitle('Direct Product Manufacturing Process Video (9:16)');
      } else if (initialAction === 'offer') {
        if (!title) setTitle('🎁 Exclusive Wholesale Volume Discount Offer');
        if (!wholesalePrice) setWholesalePrice('$1,450 / piece (MOQ: 50 pcs)');
      } else if (initialAction === 'update') {
        if (!title) setTitle('🏢 Enterprise Expansion & Capacity Addition Update');
      }
    }
  }, [isOpen, initialAction]);

  if (!isOpen) return null;

  const locationsList = [
    'Chennai', 
    'Salem', 
    'Dharmapuri', 
    'Coimbatore', 
    'Erode', 
    'Tirupur', 
    'Madurai', 
    'Harur', 
    'Mettur', 
    'Attur'
  ];

  const categoriesList = [
    'Technology',
    'Manufacturing',
    'Retail',
    'Services',
    'Digital',
    'Textiles & Handloom Silk',
    'Agricultural Machinery',
    'Jewellery & Precious Metals',
    'Steel & Infrastructure',
    'CNC Machining & Automotive',
    'Food Processing & Dairy',
    'Logistics & Packaging'
  ];

  const trendingHashtags = [
    '#B2B', 
    '#Wholesale', 
    '#Manufacturing', 
    '#DirectFromMill', 
    '#SteelInfra', 
    '#AgroMachinery', 
    '#SilkWeavers', 
    '#OEM'
  ];

  // Handle Local File Selection (Computer / Phone)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    setSelectedFile(file);
    const isVid = file.type.startsWith('video');
    setMediaType(isVid ? 'video' : 'image');
    
    // Create live local object URL for instant preview without internet delay
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Default title if empty
    if (!title) {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      setTitle(nameWithoutExt);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleAddHashtag = (tag: string) => {
    if (!hashtags.includes(tag)) {
      setHashtags((prev) => `${prev.trim()} ${tag}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile && !previewUrl) {
      alert('Please upload a video or image directly from your device.');
      return;
    }

    if (!title.trim()) {
      alert('Please enter a title for your post.');
      return;
    }

    setIsSubmitting(true);
    setProgressPercent(15);
    setProgressStage('Encoding 4K Ultra-Glass Master...');

    const fullCaption = `${title.trim()}\n\n${description.trim()}\n\n${hashtags.trim()}`;

    const newPost: BizPost = {
      id: `post_${Date.now()}`,
      memberId: 'usr_shinegah',
      businessName: currentUser.businessName || 'Shinegah Business',
      ownerName: currentUser.ownerName || 'Chandru S',
      avatar: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      taluk: location,
      category,
      type: mediaType,
      mediaUrl: previewUrl || 'https://assets.mixkit.co/videos/preview/mixkit-hands-typing-code-on-a-laptop-keyboard-41253-large.mp4',
      thumbnailUrl: mediaType === 'image' ? previewUrl : 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      caption: fullCaption,
      priceTag: wholesalePrice ? `Wholesale ${wholesalePrice}` : 'B2B Trade',
      wholesalePrice: wholesalePrice || undefined,
      retailPrice: retailPrice || undefined,
      actionText: '✈️ Enquire',
      phone: currentUser.phone || '917548820641',
      likes: 1,
      isLiked: false,
      dislikes: 0,
      isDisliked: false,
      enquiriesCount: 0,
      commentsCount: 0,
      createdAt: `Just now • ${location}`,
      isReel: mediaType === 'video',
      status: 'approved',
    };

    setTimeout(() => {
      setProgressPercent(45);
      setProgressStage('Applying Specular B2B Verification Watermark...');
    }, 400);

    setTimeout(() => {
      setProgressPercent(80);
      setProgressStage('Broadcasting to Tamil Nadu Wholesale Network...');
    }, 900);

    setTimeout(() => {
      setProgressPercent(100);
      setProgressStage('Published to Network Successfully! ✨');
    }, 1400);

    setTimeout(() => {
      onCreatePost(newPost);
      setIsSubmitting(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/35 backdrop-blur-2xl select-none font-sans">
      
      {/* Apple-style Glass Modal Container with Specular Edge Highlights */}
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-hidden rounded-[36px] apple-glass apple-specular-edge flex flex-col shadow-2xl">
        
        {/* Apple Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/80 flex items-center justify-between bg-white/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-slate-950 text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 fill-white text-white" />
            </div>
            <div>
              <h3 className="font-black text-base text-slate-900 tracking-tight leading-none">
                {t.createTitle}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                {t.createSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-500 hover:text-slate-950 hover:bg-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ultra-Classic Luxury Glass Loading View (Matches user's request!) */}
        {isSubmitting ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-6 my-auto">
            {/* Concentric Pulsing Apple Glass Ring */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-slate-900/10 animate-ping opacity-60" />
              <div className="absolute inset-2 rounded-full border-4 border-slate-900/20 border-t-slate-950 animate-spin" />
              <div className="w-16 h-16 rounded-3xl bg-slate-950 text-white flex items-center justify-center shadow-2xl">
                {progressPercent === 100 ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 animate-bounce" />
                ) : (
                  <Sparkles className="w-8 h-8 fill-white text-white animate-pulse" />
                )}
              </div>
            </div>

            <div className="space-y-2 max-w-sm w-full">
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono text-2xl font-black text-slate-900">
                  {progressPercent}%
                </span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {progressPercent === 100 ? 'Completed' : 'Uploading'}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 rounded-full bg-slate-200/80 overflow-hidden p-0.5 border border-white">
                <div
                  className="h-full rounded-full bg-slate-950 transition-all duration-300 ease-out shadow-sm"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <p className="text-xs font-extrabold text-slate-800 min-h-[20px] transition">
                {progressStage}
              </p>
            </div>

            <div className="text-[11px] text-slate-400 font-mono">
              Direct Device Master • Hardware Accelerated Glass View
            </div>
          </div>
        ) : (
          /* Scrollable Form Body */
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* SECTION 1: DIRECT VIDEO / IMAGE UPLOAD (COMPUTER OR PHONE) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span className="flex items-center gap-1.5">
                <Film className="w-4 h-4 text-slate-900" />
                <span>{t.uploadSection}</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : 'Direct Device File'}
              </span>
            </div>

            {/* Hidden native file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*,image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Drag & Drop Upload Zone or Video Preview */}
            {!previewUrl ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative h-44 sm:h-48 rounded-3xl border border-dashed transition flex flex-col items-center justify-center gap-3 p-4 text-center cursor-pointer group ${
                  isDragging 
                    ? 'border-slate-950 bg-white' 
                    : 'border-slate-300 bg-white/70 hover:bg-white hover:border-slate-500 shadow-sm'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-950 text-white flex items-center justify-center group-hover:scale-110 transition shadow-md">
                  <Upload className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900">
                    {t.deviceUploadPrompt}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {t.uploadFormats}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-1 font-medium">
                  <span className="flex items-center gap-1"><Smartphone className="w-3 h-3 text-slate-800" /> Mobile</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Laptop className="w-3 h-3 text-slate-800" /> PC / Mac</span>
                </div>
              </div>
            ) : (
              /* Live Media Preview Card with Change Option */
              <div className="relative rounded-2xl overflow-hidden border border-slate-300 bg-black aspect-video max-h-56 shadow-md">
                {mediaType === 'video' ? (
                  <video
                    src={previewUrl}
                    controls
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={previewUrl}
                    alt="Uploaded Preview"
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Change File Button Overlay */}
                <div className="absolute top-2 right-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1 bg-black/70 backdrop-blur-md text-white text-[11px] font-bold rounded-full border border-white/20 hover:bg-black transition cursor-pointer shadow-md"
                  >
                    Change File
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl('');
                    }}
                    className="p-1 rounded-full bg-black/70 text-rose-400 hover:text-white transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: TITLE */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
              <span>{t.titleLabel}</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder={t.titlePlaceholder}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white/80 border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition shadow-inner"
            />
          </div>

          {/* SECTION 3: DESCRIPTION */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800">
              {t.descLabel}
            </label>
            <textarea
              rows={3}
              placeholder={t.descPlaceholder}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-white/80 border border-slate-300 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 transition shadow-inner resize-none leading-relaxed"
            />
          </div>

          {/* SECTION 4: HASHTAGS */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span>{t.tagsLabel}</span>
              <span className="text-[10px] text-slate-500 font-normal">Click chips to add</span>
            </div>
            
            <input
              type="text"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-white/80 border border-slate-300 text-xs text-slate-900 font-mono placeholder-slate-400 focus:outline-none focus:border-slate-900 shadow-inner"
            />

            {/* Quick Clickable Hashtags Chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {trendingHashtags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleAddHashtag(tag)}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-mono transition cursor-pointer shadow-sm"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 5 & 6: LOCATION & CATEGORY SELECTION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Location Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-600" />
                <span>{t.locationLabel}</span>
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-slate-900 cursor-pointer shadow-sm"
              >
                {locationsList.map((loc) => (
                  <option key={loc} value={loc} className="bg-white text-slate-900">
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-slate-600" />
                <span>{t.categoryLabel}</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 rounded-2xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-slate-900 cursor-pointer truncate shadow-sm"
              >
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat} className="bg-white text-slate-900">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* SECTION 7: WHOLESALE & RETAIL PRICING */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-800">{t.wholesaleLabel}</label>
              <input
                type="text"
                placeholder={t.wholesalePlaceholder}
                value={wholesalePrice}
                onChange={(e) => setWholesalePrice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/80 border border-slate-300 text-xs text-slate-900 font-mono focus:outline-none focus:border-slate-900 shadow-inner"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-800">{t.retailLabel}</label>
              <input
                type="text"
                placeholder={t.retailPlaceholder}
                value={retailPrice}
                onChange={(e) => setRetailPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/80 border border-slate-300 text-xs text-slate-900 font-mono focus:outline-none focus:border-slate-900 shadow-inner"
              />
            </div>
          </div>

          {/* Admin Verification Notice */}
          <div className="p-3 rounded-2xl bg-white/80 border border-white text-[11px] text-slate-700 flex items-center gap-2 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{t.adminVerificationNote}</span>
          </div>

          {/* Actions Bottom Bar */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-2xl transition cursor-pointer border border-slate-300 shadow-sm"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 apple-btn-primary rounded-2xl text-xs font-black cursor-pointer flex items-center justify-center gap-2 shadow-md"
            >
              {isSubmitting ? (
                <span>Publishing...</span>
              ) : (
                <>
                  <span>{t.sharePostBtn}</span>
                  <Sparkles className="w-4 h-4 text-white" />
                </>
              )}
            </button>
          </div>

        </form>
        )}

      </div>
    </div>
  );
};
