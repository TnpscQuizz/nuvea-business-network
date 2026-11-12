import { useState, useEffect } from 'react';
import type { AppState, CartItem, Requirement } from './types';
import { fetchAppState } from './services/api';
import { Header } from './components/Header';
import { GatewayPortal } from './modules/gateway/GatewayPortal';
import { BusinessPortal } from './modules/business/BusinessPortal';
import { UserPortal } from './modules/user/UserPortal';
import { AdminPortal } from './modules/admin/AdminPortal';
import { CartModal } from './components/CartModal';
import { PostRequirementModal } from './components/PostRequirementModal';
import { RegistrationModal } from './components/RegistrationModal';

export function App() {
  const [activePortal, setActivePortal] = useState<'gateway' | 'business' | 'user' | 'admin'>('gateway');
  const [lang, setLang] = useState<'ta' | 'en'>('ta');
  const [state, setState] = useState<AppState | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPostReqOpen, setIsPostReqOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [registerOption, setRegisterOption] = useState<'networking_marketplace' | 'marketplace_only' | 'customer'>('networking_marketplace');
  const [currentMemberId, setCurrentMemberId] = useState<string>('mem_001');

  useEffect(() => {
    fetchAppState().then((data) => setState(data));
  }, []);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const idx = prev.findIndex((x) => x.id === item.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx].qty += 1;
        return updated;
      }
      return [...prev, item];
    });
    alert(`"${item.name}" கார்ட்டில் சேர்க்கப்பட்டது!`);
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => setCart([]);

  const handleRequirementSubmitted = (newReq: Requirement) => {
    if (!state) return;
    setState({
      ...state,
      marketplaceRequirements: [newReq, ...(state.marketplaceRequirements || [])],
    });
    alert('உங்கள் தேவை வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது! சப்ளையர்களுக்கு அறிவிக்கப்பட்டுள்ளது.');
  };

  const handleOpenRegister = (opt?: 'networking_marketplace' | 'marketplace_only' | 'customer') => {
    setRegisterOption(opt || 'networking_marketplace');
    setIsRegisterOpen(true);
  };

  const handleRegistrationComplete = (regData: any) => {
    if (!state) return;
    if (regData.business) {
      const newMember = {
        id: regData.business.id,
        businessName: regData.business.businessName,
        ownerName: regData.business.ownerName,
        categoryId: regData.business.categoryId,
        categoryName: regData.business.subcategory || regData.business.categoryId,
        talukId: regData.business.talukId,
        chapterId: regData.business.chapterId,
        phone: regData.business.phone,
        email: regData.business.email,
        address: regData.business.address,
        logo: regData.business.logo,
        cover: regData.business.cover,
        rating: 5.0,
        accountType: regData.accountType || 'networking_marketplace',
        businessWon: 0,
        referralsReceived: 0,
        referralsGiven: 0,
        status: 'active'
      };
      setCurrentMemberId(newMember.id);
      setState({
        ...state,
        members: [newMember, ...state.members]
      });
    }
    // Automatically navigate to business portal
    setActivePortal('business');
  };

  const cartTotalCount = cart.reduce((sum, item) => sum + item.qty, 0);

  if (!state) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-300">NBN React Platform ஏற்றப்படுகிறது...</p>
        </div>
      </div>
    );
  }

  // Full-Screen Dedicated Admin Control Centre (matching exact designer layout)
  if (activePortal === 'admin') {
    return (
      <AdminPortal
        state={state}
        updateState={(s) => setState(s)}
        lang={lang}
        onExitPortal={(portal) => setActivePortal(portal || 'gateway')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* GLOBAL HEADER */}
      <Header
        activePortal={activePortal}
        setActivePortal={setActivePortal}
        cartCount={cartTotalCount}
        openCart={() => setIsCartOpen(true)}
        lang={lang}
        toggleLang={() => setLang((prev) => (prev === 'ta' ? 'en' : 'ta'))}
        openRegister={handleOpenRegister}
      />

      {/* MODULAR PORTAL VIEW CONTAINER */}
      <main className="flex-grow px-4 sm:px-6 lg:px-8 py-4">
        {activePortal === 'gateway' && (
          <GatewayPortal
            onSelectPortal={(portal) => setActivePortal(portal)}
            lang={lang}
            openRegister={handleOpenRegister}
          />
        )}

        {activePortal === 'business' && (
          <BusinessPortal
            state={state}
            updateState={(s) => setState(s)}
            lang={lang}
            currentMemberId={currentMemberId}
          />
        )}

        {activePortal === 'user' && (
          <UserPortal
            state={state}
            addToCart={addToCart}
            openPostRequirement={() => setIsPostReqOpen(true)}
            lang={lang}
          />
        )}

        {activePortal === 'admin' && (
          <AdminPortal
            state={state}
            updateState={(s) => setState(s)}
            lang={lang}
          />
        )}
      </main>

      {/* REUSABLE MODALS */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
      />

      <PostRequirementModal
        isOpen={isPostReqOpen}
        onClose={() => setIsPostReqOpen(false)}
        onSubmit={handleRequirementSubmitted}
      />

      <RegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        lang={lang}
        initialOption={registerOption}
        chapters={state?.chapters || []}
        onSuccessLogin={handleRegistrationComplete}
      />

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-6 border-t border-slate-800 text-center space-y-1">
        <div className="font-bold text-slate-300">
          Nuvea Business Network (NBN) • Enterprise B2B Platform • Powered by Nuvea Studio
        </div>
        <div className="text-[11px] text-slate-500">
          Modular React 19 Architecture • Admin Portal • Business Owner Hub • Customer Marketplace
        </div>
      </footer>

    </div>
  );
}

export default App;
