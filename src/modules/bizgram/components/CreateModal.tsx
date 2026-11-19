import React, { useState, useRef } from 'react';
import { 
  X, UploadCloud, Video, Image as ImageIcon, CheckCircle2, 
  MapPin, Tag, ArrowRight, Play, Pause, Sparkles 
} from 'lucide-react';
import type { BizPost } from '../../../types';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePost: (newPost: BizPost) => void;
  currentUser?: {
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
  currentUser = {
    businessName: 'நுவேவா ஸ்டுடியோ (Nuvea)',
    ownerName: 'சந்திரா (Chandru)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    taluk: 'தருமபுரி (Dharmapuri)',
    category: 'டிஜிட்டல் மீடியா & வெப்',
    phone: '917548820641',
  },
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [mediaType, setMediaType] = useState<'video' | 'image'>('video');
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState(currentUser.category || 'ஜவுளி & பட்டு (Textiles)');
  const [taluk, setTaluk] = useState(currentUser.taluk || 'சேலம் (Salem)');
  const [priceTag, setPriceTag] = useState('');
  const [actionText, setActionText] = useState('📩 Send Enquiry (விலை கேட்க)');
  const [isReel, setIsReel] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const isVid = selectedFile.type.startsWith('video');
      setMediaType(isVid ? 'video' : 'image');
      setIsReel(isVid);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  // Demo sample loader if user doesn't have a video file ready on device
  const handleLoadSampleVideo = () => {
    setMediaType('video');
    setIsReel(true);
    setPreviewUrl('https://assets.mixkit.co/videos/preview/mixkit-sewing-machine-needle-rapidly-penetrating-the-fabric-44755-large.mp4');
    setCaption('எங்களின் புதிய உற்பத்தி யூனிட்டிலிருந்து நேரடி செயல்விளக்கம்! மொத்த ஆர்டர்களுக்கு 20% சிறப்பு தள்ளுபடி.');
    setPriceTag('Wholesale ₹1,450 முதல்');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewUrl && !caption) {
      alert('தயவுசெய்து ஒரு வீடியோ அல்லது படத்தை தேர்வு செய்யவும்!');
      return;
    }

    setIsUploading(true);

    setTimeout(() => {
      const newPost: BizPost = {
        id: `post_${Date.now()}`,
        memberId: 'my_biz',
        businessName: currentUser.businessName,
        ownerName: currentUser.ownerName,
        avatar: currentUser.avatar,
        taluk: taluk,
        category: category,
        type: mediaType,
        mediaUrl: previewUrl || 'https://assets.mixkit.co/videos/preview/mixkit-working-with-multiple-computer-screens-in-an-office-42562-large.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
        caption: caption || 'புதிய வணிக தயாரிப்பு & சலுகை விவரங்கள்!',
        priceTag: priceTag || 'விலை விவரத்திற்கு தொடர்பு கொள்ளவும்',
        actionText: actionText,
        phone: currentUser.phone,
        likes: 1,
        isLiked: true,
        enquiriesCount: 0,
        commentsCount: 0,
        createdAt: 'இப்போது (Just Now)',
        isReel: isReel,
      };

      onCreatePost(newPost);
      setIsUploading(false);
      onClose();
      alert('உங்கள் வணிக வீடியோ / பதிவு வெற்றிகரமாக பதிவேற்றப்பட்டது!');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* MODAL HEADER */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base text-slate-900 leading-tight">
                புதிய வணிக வீடியோ / ரீல்ஸ் பதிவேற்றுக (Create New Post)
              </h3>
              <p className="text-[11px] text-slate-500">
                100% பிசினஸ் தயாரிப்புகள், தொழிற்சாலை வீடியோக்கள் & ஆஃபர்கள்
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL BODY (2 COLUMNS ON DESKTOP) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12">
          
          {/* LEFT COLUMN: MEDIA UPLOADER / PREVIEW */}
          <div className="md:col-span-6 bg-slate-950 p-4 sm:p-6 flex flex-col items-center justify-center min-h-[300px] md:min-h-[460px] relative">
            
            {previewUrl ? (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                {mediaType === 'video' ? (
                  <video
                    src={previewUrl}
                    controls
                    autoPlay
                    loop
                    className="max-h-[380px] w-auto max-w-full rounded-2xl object-contain shadow-lg"
                  />
                ) : (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-[380px] w-auto max-w-full rounded-2xl object-contain shadow-lg"
                  />
                )}

                <div className="mt-3 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-full text-xs font-bold transition cursor-pointer"
                  >
                    மாற்றுக (Change)
                  </button>
                  <span className="text-[11px] text-amber-400 font-semibold">
                    {mediaType === 'video' ? '🎬 வீடியோ ரீல்ஸ்' : '🖼️ புகைப்படம்'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-3 p-4">
                <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm sm:text-base">
                    வீடியோ அல்லது புகைப்படத்தை இழுத்துப்போடவும்
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    MP4, WebM, MOV, JPG அல்லது PNG (அதிகபட்சம் 100MB)
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-full shadow-md transition cursor-pointer"
                  >
                    கம்ப்யூட்டர் / கேலரியில் இருந்து தேர்வு செய்
                  </button>

                  <button
                    type="button"
                    onClick={handleLoadSampleVideo}
                    className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold rounded-full transition cursor-pointer"
                  >
                    மாதிரி வீடியோவை ஏற்று (Sample)
                  </button>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="video/*,image/*"
              onChange={handleFileChange}
              className="hidden"
            />

          </div>

          {/* RIGHT COLUMN: BUSINESS METADATA FORM */}
          <div className="md:col-span-6 p-5 sm:p-6 space-y-4 bg-white flex flex-col justify-between">
            
            <div className="space-y-4">
              
              {/* Creator Info Header */}
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.businessName}
                  className="w-10 h-10 rounded-full object-cover border-2 border-amber-400"
                />
                <div>
                  <div className="font-black text-xs sm:text-sm text-slate-900 flex items-center gap-1">
                    <span>{currentUser.businessName}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {currentUser.ownerName} • {currentUser.taluk}
                  </div>
                </div>
              </div>

              {/* Caption Textarea */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  விளக்கம் / தயாரிப்பு பெயர் (Caption) *
                </label>
                <textarea
                  required
                  rows={3}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="உங்கள் தொழில் தயாரிப்பு, சேவை அல்லது சலுகை பற்றி எழுதவும் (எ.கா: தூய பட்டு சேலைகள் மொத்த விற்பனைக்கு தயார்)..."
                  className="w-full p-3 rounded-2xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-400 resize-none bg-slate-50/50"
                />
              </div>

              {/* Category & Taluk Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    வணிகப் பிரிவு (Category)
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="ஜவுளி & பட்டு (Textiles)">ஜவுளி & பட்டு (Textiles)</option>
                    <option value="வேளாண் இயந்திரங்கள் (Agro Tech)">வேளாண் இயந்திரங்கள் (Agro)</option>
                    <option value="தங்க நகைகள் (Jewellery)">தங்க நகைகள் (Jewellery)</option>
                    <option value="கட்டுமானப் பொருட்கள் (Construction)">கட்டுமானம் (Construction)</option>
                    <option value="டிஜிட்டல் மார்க்கெட்டிங் & வெப்">டிஜிட்டல் மீடியா & வெப்</option>
                    <option value="ஆட்டோமொபைல் & ஸ்பேர்ஸ்">ஆட்டோமொபைல் & ஸ்பேர்ஸ்</option>
                    <option value="உணவு & கேட்டரிங்">உணவு & கேட்டரிங்</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    தாலுகா (Location Tag)
                  </label>
                  <select
                    value={taluk}
                    onChange={(e) => setTaluk(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="சேலம் (Salem)">சேலம் (Salem)</option>
                    <option value="தருமபுரி (Dharmapuri)">தருமபுரி (Dharmapuri)</option>
                    <option value="ஹரூர் (Harur)">ஹரூர் (Harur)</option>
                    <option value="ஓமலூர் (Omalur)">ஓமலூர் (Omalur)</option>
                    <option value="ஆத்தூர் (Attur)">ஆத்தூர் (Attur)</option>
                    <option value="மேட்டூர் (Mettur)">மேட்டூர் (Mettur)</option>
                    <option value="பாலக்கோடு (Palacode)">பாலக்கோடு (Palacode)</option>
                  </select>
                </div>
              </div>

              {/* Price / Offer Tag & Action Button */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ஆஃபர் / மொத்த விலை (Price Tag)
                  </label>
                  <input
                    type="text"
                    value={priceTag}
                    onChange={(e) => setPriceTag(e.target.value)}
                    placeholder="எ.கா: Wholesale ₹1,250"
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    CTA பட்டன் (Action Text)
                  </label>
                  <select
                    value={actionText}
                    onChange={(e) => setActionText(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="📩 Send Enquiry (விலை கேட்க)">📩 Send Enquiry</option>
                    <option value="📞 Call Now (உடனடி அழைப்பு)">📞 Call Now</option>
                    <option value="💬 WhatsApp Quote">💬 WhatsApp Quote</option>
                  </select>
                </div>
              </div>

              {/* Mark as Reel Checkbox */}
              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-slate-800 font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={isReel}
                  onChange={(e) => setIsReel(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-400"
                />
                <span>🎬 முழுத்திரை வணிக ரீல்ஸ் (Reels Feed) ஆகவும் சேர்க்கவும்</span>
              </label>

            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 rounded-full text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
              >
                ரத்து செய்க
              </button>

              <button
                type="submit"
                disabled={isUploading}
                className="px-6 py-2.5 bg-[#0a1128] hover:bg-slate-800 text-white rounded-full text-xs font-black shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isUploading ? 'பதிவேற்றப்படுகிறது...' : 'பதிவேற்றுக (Publish Reel)'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </form>

      </div>

    </div>
  );
};
