import React, { useState } from 'react';
import { 
  X, Camera, Film, Briefcase, Gift, Image, 
  Tag, MapPin, Phone, Upload, CheckCircle2, Sparkles, Send 
} from 'lucide-react';
import type { BizPost } from '../../../types';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePost: (post: BizPost) => void;
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
  currentUser,
}) => {
  const [selectedAction, setSelectedAction] = useState<'menu' | 'post' | 'reel' | 'update' | 'offer'>('menu');
  const [mediaType, setMediaType] = useState<'video' | 'image'>('video');
  const [mediaUrl, setMediaUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [wholesalePrice, setWholesalePrice] = useState('');
  const [retailPrice, setRetailPrice] = useState('');
  const [category, setCategory] = useState(currentUser.category || 'Manufacturing');

  if (!isOpen) return null;

  const handleSelectAction = (action: 'post' | 'reel' | 'update' | 'offer') => {
    setSelectedAction(action);
    if (action === 'reel') {
      setMediaType('video');
      setMediaUrl('https://assets.mixkit.co/videos/preview/mixkit-hands-typing-code-on-a-laptop-keyboard-41253-large.mp4');
    } else if (action === 'offer') {
      setMediaType('image');
      setMediaUrl('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80');
      setCaption('🎁 பிரத்தியேக மொத்த விற்பனை தள்ளுபடி சலுகை! (Exclusive B2B Offer)');
    } else if (action === 'update') {
      setMediaType('image');
      setMediaUrl('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80');
      setCaption('🏢 எங்கள் நிறுவனத்தின் புதிய வணிக விரிவாக்க அறிவிப்பு (Business Update)!');
    } else {
      setMediaType('image');
      setMediaUrl('https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) {
      alert('தயவுசெய்து தலைப்பு/விளக்கத்தை உள்ளிடவும்.');
      return;
    }

    const newPost: BizPost = {
      id: `post_${Date.now()}`,
      memberId: 'usr_shinegah',
      businessName: currentUser.businessName || 'Shinegah Business',
      ownerName: currentUser.ownerName || 'Chandru',
      avatar: currentUser.avatar,
      taluk: currentUser.taluk || 'Chennai',
      category,
      type: mediaType,
      mediaUrl: mediaUrl || 'https://assets.mixkit.co/videos/preview/mixkit-hands-typing-code-on-a-laptop-keyboard-41253-large.mp4',
      thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      caption,
      priceTag: wholesalePrice ? `Wholesale ${wholesalePrice}` : 'B2B Special',
      wholesalePrice: wholesalePrice || undefined,
      retailPrice: retailPrice || undefined,
      actionText: '✈️ Enquire',
      phone: currentUser.phone || '917548820641',
      likes: 1,
      isLiked: false,
      enquiriesCount: 0,
      commentsCount: 0,
      createdAt: 'Just now',
      isReel: mediaType === 'video',
      status: 'pending', // Requires admin approval
    };

    onCreatePost(newPost);
    alert('உங்கள் பதிவு உருவாக்கப்பட்டு சூப்பர் அட்மின் ஒப்புதலுக்கு (Pending Approval) அனுப்பப்பட்டுள்ளது!');
    setSelectedAction('menu');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none font-sans">
      <div className="bg-[#0e1428] border border-white/15 rounded-3xl w-full max-w-sm overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col">
        
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-black text-sm text-white">
              {selectedAction === 'menu' ? 'Create New' : 'New ' + selectedAction.toUpperCase()}
            </h3>
          </div>

          <button
            onClick={() => {
              setSelectedAction('menu');
              onClose();
            }}
            className="p-1 rounded-full text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. MOCKUP MENU: 📷 Create Post, ▶️ Create Reel, 💼 Share Business Update, 🎁 Post Offer */}
        {selectedAction === 'menu' ? (
          <div className="p-4 space-y-2.5">
            
            {/* 1. Create Post */}
            <button
              onClick={() => handleSelectAction('post')}
              className="w-full p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition flex items-center gap-3.5 cursor-pointer text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-105 transition">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs sm:text-sm text-white">Create Post</div>
                <div className="text-[10px] text-slate-400">புகைப்படம் & தயாரிப்பு விபரம்</div>
              </div>
            </button>

            {/* 2. Create Reel */}
            <button
              onClick={() => handleSelectAction('reel')}
              className="w-full p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition flex items-center gap-3.5 cursor-pointer text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-105 transition">
                <Film className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs sm:text-sm text-white">Create Reel</div>
                <div className="text-[10px] text-slate-400">9:16 வீடியோ & நேரடி டெமோ</div>
              </div>
            </button>

            {/* 3. Share Business Update */}
            <button
              onClick={() => handleSelectAction('update')}
              className="w-full p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition flex items-center gap-3.5 cursor-pointer text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-105 transition">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs sm:text-sm text-white">Share Business Update</div>
                <div className="text-[10px] text-slate-400">நிறுவனத்தின் புதிய அறிவிப்புகள்</div>
              </div>
            </button>

            {/* 4. Post Offer */}
            <button
              onClick={() => handleSelectAction('offer')}
              className="w-full p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition flex items-center gap-3.5 cursor-pointer text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-105 transition">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs sm:text-sm text-white">Post Offer</div>
                <div className="text-[10px] text-slate-400">தள்ளுபடி & மொத்த விலை சலுகை</div>
              </div>
            </button>

          </div>
        ) : (
          /* 2. CREATION FORM */
          <form onSubmit={handleSubmit} className="p-4 space-y-3.5 max-h-[70vh] overflow-y-auto">
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">விளக்கம் / Caption:</label>
              <textarea
                required
                rows={3}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="உங்கள் தயாரிப்பு, சலுகை அல்லது ரீல்ஸ் விவரத்தை எழுதவும்..."
                className="w-full p-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-400"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">மீடியா வகை (Media):</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMediaType('video')}
                  className={`py-2 rounded-xl text-xs font-bold border transition ${
                    mediaType === 'video'
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  ▶️ Video / Reel
                </button>
                <button
                  type="button"
                  onClick={() => setMediaType('image')}
                  className={`py-2 rounded-xl text-xs font-bold border transition ${
                    mediaType === 'image'
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-white/5 border-white/10 text-slate-400'
                  }`}
                >
                  📷 Image / Photo
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-300">மீடியா URL (MP4 / Image):</label>
              <input
                type="text"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://..."
                className="w-full p-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">மொத்த விலை (Wholesale):</label>
                <input
                  type="text"
                  value={wholesalePrice}
                  onChange={(e) => setWholesalePrice(e.target.value)}
                  placeholder="₹1,850 / piece"
                  className="w-full p-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-300">சில்லறை விலை (Retail):</label>
                <input
                  type="text"
                  value={retailPrice}
                  onChange={(e) => setRetailPrice(e.target.value)}
                  placeholder="₹2,600 / piece"
                  className="w-full p-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-[11px] text-blue-200">
              ⏳ புதிய பதிவுகள் சூப்பர் அட்மின் தணிக்கைக்குப் பிறகே பப்ளிக் ஃபீடில் தோன்றும்.
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedAction('menu')}
                className="flex-1 py-2 bg-white/10 text-white rounded-xl text-xs font-bold"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold shadow-md"
              >
                Submit Post
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
