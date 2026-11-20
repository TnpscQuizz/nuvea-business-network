import React, { useState, useRef } from 'react';
import { 
  X, Upload, Film, Image as ImageIcon, MapPin, Tag, 
  Hash, Sparkles, CheckCircle2, Play, Pause, AlertCircle, 
  ChevronDown, Layers, FileText, Smartphone, Laptop 
} from 'lucide-react';
import type { BizPost } from '../../../types';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePost: (post: BizPost) => void;
  initialAction?: 'post' | 'reel' | 'update' | 'offer';
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
  currentUser,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Media Upload State (Direct Computer / Phone file upload)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [mediaType, setMediaType] = useState<'video' | 'image'>(initialAction === 'reel' ? 'video' : 'video');
  const [isDragging, setIsDragging] = useState(false);
  
  // Form fields as requested by user
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hashtags, setHashtags] = useState('#B2B #TamilNadu #Wholesale');
  const [location, setLocation] = useState(currentUser.taluk || 'Chennai');
  const [category, setCategory] = useState(currentUser.category || 'Manufacturing');
  const [wholesalePrice, setWholesalePrice] = useState('');
  const [retailPrice, setRetailPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Synchronize initialAction presets when modal opens
  React.useEffect(() => {
    if (isOpen) {
      if (initialAction === 'reel') {
        setMediaType('video');
        if (!title) setTitle('பிரத்தியேக தயாரிப்பு செயல்முறை நேரடி வீடியோ (Direct Reel)');
      } else if (initialAction === 'offer') {
        if (!title) setTitle('🎁 பிரத்தியேக மொத்த விற்பனை தள்ளுபடி சலுகை (Exclusive Wholesale Offer)');
        if (!wholesalePrice) setWholesalePrice('₹1,450 / piece (MOQ: 50 pcs)');
      } else if (initialAction === 'update') {
        if (!title) setTitle('🏢 நிறுவன வணிக விரிவாக்க அறிவிப்பு (Business Expansion Update)');
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
    'ஜவுளி & பட்டு (Textiles)',
    'வேளாண் இயந்திரங்கள் (Agro Tech)',
    'தங்கம் & வெள்ளி (Jewellery)',
    'இரும்பு & கட்டுமானம் (Steel & Infra)',
    'CNC & ஆட்டோமொபைல் (Machinery)',
    'உணவு & பால்பண்ணை (Food & Dairy)',
    'லாஜிஸ்டிக்ஸ் & பேக்கிங் (Logistics)'
  ];

  const trendingHashtags = [
    '#B2B', 
    '#TamilNadu', 
    '#Wholesale', 
    '#SalemSilks', 
    '#AgroMachinery', 
    '#Manufacturing', 
    '#DirectFromWeaver', 
    '#Construction'
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
      alert('தயவுசெய்து உங்கள் கணினி அல்லது போனிலிருந்து வீடியோ அல்லது புகைப்படத்தை அப்லோட் செய்யவும்.');
      return;
    }

    if (!title.trim()) {
      alert('தயவுசெய்து பதிவின் தலைப்பை (Title) உள்ளிடவும்.');
      return;
    }

    setIsSubmitting(true);

    const fullCaption = `${title.trim()}\n\n${description.trim()}\n\n${hashtags.trim()}`;

    const newPost: BizPost = {
      id: `post_${Date.now()}`,
      memberId: 'usr_shinegah',
      businessName: currentUser.businessName || 'Shinegah Business',
      ownerName: currentUser.ownerName || 'Chandru',
      avatar: currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      taluk: location,
      category,
      type: mediaType,
      mediaUrl: previewUrl || 'https://assets.mixkit.co/videos/preview/mixkit-hands-typing-code-on-a-laptop-keyboard-41253-large.mp4',
      thumbnailUrl: mediaType === 'image' ? previewUrl : 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      caption: fullCaption,
      priceTag: wholesalePrice ? `Wholesale ${wholesalePrice}` : 'B2B Special',
      wholesalePrice: wholesalePrice || undefined,
      retailPrice: retailPrice || undefined,
      actionText: '✈️ Enquire',
      phone: currentUser.phone || '917548820641',
      likes: 1,
      isLiked: false,
      enquiriesCount: 0,
      commentsCount: 0,
      createdAt: `Just now • ${location}`,
      isReel: mediaType === 'video',
      status: 'pending', // Requires admin approval
    };

    setTimeout(() => {
      onCreatePost(newPost);
      setIsSubmitting(false);
      alert('வாழ்த்துக்கள்! உங்கள் வீடியோ போஸ்ட் வெற்றிகரமாக அப்லோட் செய்யப்பட்டது. அட்மின் தணிக்கைக்குப் பிறகு லைவ் ஆகும்.');
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-2xl select-none font-sans">
      
      {/* Apple-style Glass Modal Container with Specular Edge Highlights */}
      <div className="relative w-full max-w-lg max-h-[92vh] overflow-hidden rounded-[32px] apple-glass apple-specular-edge flex flex-col">
        
        {/* Apple Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.03]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full p-[2px] bg-gradient-to-tr from-cyan-400 via-blue-500 to-purple-600 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4 text-blue-400" />
              </div>
            </div>
            <div>
              <h3 className="font-black text-base text-white tracking-tight leading-none">
                Create Post / Reel
              </h3>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                நேரடி வீடியோ அப்லோட் & வணிக பதிவு
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* SECTION 1: DIRECT VIDEO / IMAGE UPLOAD (COMPUTER OR PHONE) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Film className="w-4 h-4 text-blue-400" />
                <span>1. வீடியோ / மீடியா அப்லோட் (Device Direct Upload):</span>
              </span>
              <span className="text-[10px] text-blue-400 font-mono">
                {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : 'MP4, MOV, JPG, PNG'}
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
                className={`relative h-44 sm:h-48 rounded-2xl border-2 border-dashed transition flex flex-col items-center justify-center gap-3 p-4 text-center cursor-pointer group ${
                  isDragging 
                    ? 'border-blue-400 bg-blue-600/20' 
                    : 'border-white/20 bg-white/[0.02] hover:bg-white/[0.06] hover:border-blue-400/60'
                }`}
              >
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-blue-600/30 to-purple-600/30 border border-white/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                  <Upload className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-white">
                    போன் அல்லது கம்ப்யூட்டரிலிருந்து வீடியோவை தேர்வு செய்க
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Drag & drop files here or click to browse from device
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1"><Smartphone className="w-3 h-3 text-cyan-400" /> Mobile Camera</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Laptop className="w-3 h-3 text-purple-400" /> PC Storage</span>
                </div>
              </div>
            ) : (
              /* Live Media Preview Card with Change Option */
              <div className="relative rounded-2xl overflow-hidden border border-white/20 bg-black aspect-video max-h-56">
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
                    onClick={() => { setSelectedFile(null); setPreviewUrl(''); }}
                    className="p-1 rounded-full bg-rose-600/80 text-white hover:bg-rose-600 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SECTION 2: TITLE (தலைப்பு) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>2. தலைப்பு (Title):</span>
              <span className="text-[10px] text-slate-500">முக்கியமான பொருள் அல்லது சலுகை</span>
            </label>
            <input
              type="text"
              required
              placeholder="எ.கா: அசல் காஞ்சிபுரம் பட்டு சேலைகள் தறி உற்பத்தி (Salem Silks)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/15 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] transition"
            />
          </div>

          {/* SECTION 3: DESCRIPTION (விளக்கம்) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              3. விரிவான விளக்கம் (Description):
            </label>
            <textarea
              rows={3}
              required
              placeholder="தயாரிப்பின் தரம், குறைந்தபட்ச ஆர்டர் அளவு (MOQ), வாரண்டி மற்றும் உங்கள் வணிக அனுபவ விவரங்களை உள்ளிடவும்..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-2xl bg-white/[0.04] border border-white/15 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] transition resize-none leading-relaxed"
            />
          </div>

          {/* SECTION 4: HASHTAGS (ஹேஷ்டேக்) */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-blue-400" />
              <span>4. ஹேஷ்டேக் (Hashtags):</span>
            </label>
            <input
              type="text"
              placeholder="#B2B #TamilNadu #Wholesale #SalemSilks"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl bg-white/[0.04] border border-white/15 text-xs font-mono text-cyan-300 placeholder-slate-500 focus:outline-none focus:border-blue-400"
            />
            {/* Quick Trending Hashtag Suggestion Chips */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {trendingHashtags.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => handleAddHashtag(tag)}
                  className="px-2 py-0.5 rounded-full bg-white/5 hover:bg-blue-600/30 text-[10px] text-slate-300 hover:text-white border border-white/10 transition cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 5: LOCATION & CATEGORY (லொகேஷன் & பிரிவு) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Location Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>5. இருப்பிடம் (Location):</span>
              </label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2.5 rounded-2xl bg-[#090e1f] border border-white/15 text-xs text-white focus:outline-none focus:border-blue-400 cursor-pointer"
              >
                {locationsList.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Category Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-purple-400" />
                <span>6. வணிகப் பிரிவு (Category):</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 rounded-2xl bg-[#090e1f] border border-white/15 text-xs text-white focus:outline-none focus:border-blue-400 cursor-pointer"
              >
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

          </div>

          {/* SECTION 6: WHOLESALE & RETAIL PRICING */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">மொத்த விலை (Wholesale):</label>
              <input
                type="text"
                placeholder="₹1,850 / piece"
                value={wholesalePrice}
                onChange={(e) => setWholesalePrice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-xs text-white font-mono focus:outline-none focus:border-blue-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">சில்லறை விலை (Retail):</label>
              <input
                type="text"
                placeholder="₹2,600 / piece"
                value={retailPrice}
                onChange={(e) => setRetailPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-xs text-white font-mono focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          {/* Admin Verification Notice */}
          <div className="p-3 rounded-2xl bg-blue-950/40 border border-blue-500/30 text-[11px] text-blue-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
            <span>அனைத்து போஸ்ட்டுகளும் அட்மின் தணிக்கைக்குப் பிறகு 100% B2B ஃபீடில் தெரியும்.</span>
          </div>

          {/* Actions Bottom Bar */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-white/10 hover:bg-white/15 text-slate-300 font-bold text-xs rounded-2xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-400 text-white font-black text-xs sm:text-sm rounded-2xl shadow-[0_0_25px_rgba(37,99,235,0.5)] transition transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>அப்லோட் ஆகிறது...</span>
              ) : (
                <>
                  <span>Share to Shinegah Feed</span>
                  <Sparkles className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
