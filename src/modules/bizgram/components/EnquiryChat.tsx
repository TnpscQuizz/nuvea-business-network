import React, { useState } from 'react';
import { 
  Send, Phone, CheckCircle2, FileText, Tag, MessageCircle, 
  MapPin, Sparkles, Plus, MoreHorizontal, ArrowLeft, User, 
  Play, Pause, Volume2, Mic, Clock, CheckCheck, ShieldCheck 
} from 'lucide-react';
import type { BizEnquiryMessage } from '../../../types';

interface Thread {
  threadId: string;
  memberId: string;
  memberName: string;
  avatar: string;
  taluk: string;
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
  verified?: boolean;
  messages: BizEnquiryMessage[];
}

interface EnquiryChatProps {
  threads: Thread[];
  activeThreadId?: string;
  onSendMessage: (threadId: string, text: string, quotationData?: any) => void;
}

export const EnquiryChat: React.FC<EnquiryChatProps> = ({
  threads,
  activeThreadId: initialActiveThreadId,
  onSendMessage,
}) => {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Connections' | 'Enquiries' | 'Notifications'>('All');
  const [selectedThreadId, setSelectedThreadId] = useState<string>(
    initialActiveThreadId || threads[0]?.threadId || ''
  );
  const [inputText, setInputText] = useState('');
  const [showQuoteDrawer, setShowQuoteDrawer] = useState(false);
  const [quoteItems, setQuoteItems] = useState('25 x Pure Silk Sarees (Handloom Kanchipuram)');
  const [quoteAmount, setQuoteAmount] = useState<number>(42500);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const activeThread = threads.find((t) => t.threadId === selectedThreadId) || threads[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeThread) return;
    onSendMessage(activeThread.threadId, inputText);
    setInputText('');
  };

  const handleQuickAction = (text: string) => {
    if (!activeThread) return;
    onSendMessage(activeThread.threadId, text);
  };

  const handleSendOfficialQuotation = () => {
    if (!activeThread || quoteAmount <= 0) return;
    const cgst = Math.round(quoteAmount * 0.09);
    const sgst = Math.round(quoteAmount * 0.09);
    const total = quoteAmount + cgst + sgst;

    const quotationData = {
      items: quoteItems,
      amount: quoteAmount,
      cgst,
      sgst,
      total,
      quotationNumber: `QT-${Date.now().toString().slice(-6)}`,
      sacCode: '998314',
    };

    onSendMessage(
      activeThread.threadId,
      `அதிகாரப்பூர்வ 18% GST விலைப்பட்டியல் (Formal Quotation) #${quotationData.quotationNumber}: ${quoteItems}`,
      quotationData
    );
    setShowQuoteDrawer(false);
  };

  const quickChips = [
    { label: '⚡ விலைப்பட்டியல் (Price List)', text: 'வணக்கம்! உங்கள் தயாரிப்புகளின் மொத்த விலைப்பட்டியலை (Wholesale Price List) பகிரவும்.' },
    { label: '📦 மாதிரி பொருள் (Sample)', text: 'தரம் சரிபார்க்க 1 அல்லது 2 மாதிரி பீஸ்கள் (Sample pieces) அனுப்ப முடியுமா?' },
    { label: '📞 வணிக அழைப்பு (Schedule Call)', text: 'வணிக விரிவாக்கம் குறித்து பேச நாளை காலை 11 மணிக்கு தொலைபேசி அழைப்பு செய்யலாமா?' },
    { label: '📍 முகவரி (Location)', text: 'உங்கள் நிறுவனத்தின் நேரடி தயாரிப்பு ஆலை முகவரி மற்றும் கூகுள் மேப் லொகேஷன் அனுப்பவும்.' },
  ];

  return (
    <div className="max-w-5xl mx-auto h-[84vh] apple-glass apple-specular-edge rounded-[32px] overflow-hidden flex flex-col md:flex-row select-none font-sans shadow-2xl">
      
      {/* ========================================================================= */}
      {/* 1. LEFT THREADS COLUMN (EXACT MOCKUP BOTTOM RIGHT)                        */}
      {/* ========================================================================= */}
      <div className={`w-full md:w-80 lg:w-96 border-r border-white/10 flex flex-col bg-[#080d1c]/90 ${selectedThreadId && 'hidden md:flex'}`}>
        
        {/* Header: Messages (5) + Plus + More (Exact Mockup) */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-black text-white tracking-tight">
              Messages
            </h2>
            <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center shadow-[0_0_10px_rgba(244,63,94,0.6)]">
              5
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <button className="p-2 hover:bg-white/10 rounded-full transition cursor-pointer text-slate-400 hover:text-white">
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button className="p-2 hover:bg-white/10 rounded-full transition cursor-pointer text-slate-400 hover:text-white">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Tabs: All | Connections | Enquiries | Notifications (Exact Mockup) */}
        <div className="flex items-center justify-between border-b border-white/10 px-3 py-2.5 text-xs font-bold text-slate-400 bg-black/20">
          {(['All', 'Connections', 'Enquiries', 'Notifications'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3 py-1.5 rounded-full transition cursor-pointer ${
                activeFilter === tab
                  ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.5)] font-black'
                  : 'hover:text-white hover:bg-white/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Thread List Items (Ramesh Kumar, Priya Enterprises, etc.) */}
        <div className="flex-1 overflow-y-auto divide-y divide-white/5">
          {threads.map((thread) => {
            const isSelected = thread.threadId === activeThread?.threadId;
            return (
              <div
                key={thread.threadId}
                onClick={() => setSelectedThreadId(thread.threadId)}
                className={`p-3.5 sm:p-4 flex items-center gap-3 cursor-pointer transition ${
                  isSelected
                    ? 'bg-blue-600/20 border-l-4 border-blue-400'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={thread.avatar}
                    alt={thread.memberName}
                    className="w-12 h-12 rounded-full object-cover border border-white/20 shadow-sm"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center border border-black text-[9px] shadow-sm">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="font-bold text-xs sm:text-sm text-white truncate flex items-center gap-1.5">
                      <span>{thread.memberName}</span>
                      <CheckCircle2 className="w-3 h-3 text-blue-400 shrink-0" />
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                      {thread.lastTime}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-400 truncate pr-2 font-normal">
                      {thread.lastMessage}
                    </p>
                    {thread.unreadCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] font-black flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(59,130,246,0.6)]">
                        {thread.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. RIGHT ACTIVE CHAT CONVERSATION VIEW (APPLE iMESSAGE GLASS STYLE)       */}
      {/* ========================================================================= */}
      <div className={`flex-1 flex flex-col bg-[#060914]/95 ${!selectedThreadId && 'hidden md:flex'}`}>
        
        {/* Top Active Chat Header */}
        <div className="p-3.5 sm:p-4 border-b border-white/10 bg-[#0a0f20]/90 backdrop-blur-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedThreadId('')}
              className="md:hidden p-1.5 text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="relative">
              <img
                src={activeThread?.avatar}
                alt={activeThread?.memberName}
                className="w-11 h-11 rounded-full object-cover border border-white/20 shadow-md"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-black" />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                <span>{activeThread?.memberName}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Verified Direct Business • {activeThread?.taluk}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQuoteDrawer(!showQuoteDrawer)}
              className="px-3.5 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-sm"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>GST Quote</span>
            </button>
            <a
              href="tel:917548820641"
              className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 hover:text-white transition border border-white/10"
              title="Call Business Owner"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
            </a>
          </div>
        </div>

        {/* GST Quotation Generator Drawer */}
        {showQuoteDrawer && (
          <div className="p-4 bg-indigo-950/60 border-b border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs animate-in slide-in-from-top-3 duration-200">
            <div className="flex-1 w-full flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={quoteItems}
                onChange={(e) => setQuoteItems(e.target.value)}
                placeholder="Product items & specifications..."
                className="flex-1 px-3.5 py-2 bg-black/50 border border-white/15 rounded-xl text-white text-xs placeholder-slate-400 focus:outline-none focus:border-indigo-400"
              />
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-mono">₹</span>
                <input
                  type="number"
                  value={quoteAmount}
                  onChange={(e) => setQuoteAmount(Number(e.target.value))}
                  placeholder="Amount"
                  className="w-32 px-3 py-2 bg-black/50 border border-white/15 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-indigo-400"
                />
              </div>
            </div>
            <button
              onClick={handleSendOfficialQuotation}
              className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black rounded-xl shadow-lg cursor-pointer shrink-0 transition"
            >
              Send 18% GST Quote (₹{Math.round(quoteAmount * 1.18).toLocaleString('en-IN')})
            </button>
          </div>
        )}

        {/* Messages List Area (Apple iMessage Bubbles) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* Simulated Voice Message from Ramesh Kumar */}
          {activeThread?.threadId === 'th_ramesh' && (
            <div className="flex flex-col items-start">
              <div className="p-3.5 rounded-2xl bg-[#12192e] border border-white/15 text-white max-w-xs sm:max-w-sm space-y-2 shadow-lg">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-md transition cursor-pointer shrink-0"
                  >
                    {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                      <span>Ramesh_Inquiry_Voice.aac</span>
                      <span className="font-mono text-blue-400">0:24</span>
                    </div>
                    {/* Audio Waveform Simulator */}
                    <div className="flex items-center gap-1 h-5">
                      {[40, 70, 90, 50, 100, 80, 45, 60, 95, 75, 40, 85, 65, 50, 90, 30].map((h, i) => (
                        <div
                          key={i}
                          style={{ height: `${isPlayingAudio ? (h * 0.8) : (h * 0.4)}%` }}
                          className={`w-1 rounded-full transition-all duration-300 ${
                            isPlayingAudio ? 'bg-blue-400' : 'bg-slate-500'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-white/10">
                  <span>குரல் செய்தி (Voice Note)</span>
                  <span>2m ago</span>
                </div>
              </div>
            </div>
          )}

          {/* Regular Messages */}
          {activeThread?.messages.map((msg) => {
            const isMe = msg.senderId.includes('shinegah') || msg.senderId === 'buyer' || msg.senderId.includes('chandru');
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-2.5 ${
                    isMe
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white shadow-[0_4px_15px_rgba(37,99,235,0.3)] border border-white/20'
                      : 'bg-[#10172e] text-slate-200 border border-white/15 shadow-md'
                  }`}
                >
                  {/* Attached Post Card if enquiry */}
                  {msg.attachedPostTitle && (
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/15 flex items-center gap-3">
                      {msg.attachedPostThumb && (
                        <img
                          src={msg.attachedPostThumb}
                          alt="Post"
                          className="w-11 h-11 rounded-lg object-cover border border-white/15"
                        />
                      )}
                      <div className="min-w-0">
                        <div className="font-bold text-xs truncate text-white">
                          {msg.attachedPostTitle}
                        </div>
                        <div className="text-[11px] text-amber-300 font-mono font-semibold">
                          {msg.attachedPrice}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Formal Quotation Card */}
                  {msg.isQuotation && msg.quotationData && (
                    <div className="p-3.5 rounded-2xl bg-indigo-950/90 border border-indigo-400/50 text-white space-y-2 shadow-inner">
                      <div className="flex items-center justify-between border-b border-indigo-500/30 pb-2">
                        <span className="font-black text-xs text-amber-300">அதிகாரப்பூர்வ 18% GST கொட்டேஷன்</span>
                        <span className="text-[10px] font-mono text-slate-400">SAC: 998314</span>
                      </div>
                      <div className="text-xs text-slate-200">{msg.quotationData.items}</div>
                      
                      <div className="space-y-1 font-mono text-[11px] pt-2 border-t border-white/10 text-slate-300">
                        <div className="flex justify-between">
                          <span>அடிப்படை விலை:</span>
                          <span>₹{msg.quotationData.amount.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-indigo-300">
                          <span>CGST (9%) + SGST (9%):</span>
                          <span>₹{(msg.quotationData.cgst + msg.quotationData.sgst).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-emerald-400 pt-1 border-t border-white/10">
                          <span>மொத்த தொகை:</span>
                          <span>₹{msg.quotationData.total.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <p>{msg.text}</p>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-1 px-1">
                  <span>{msg.timestamp}</span>
                  {isMe && <CheckCheck className="w-3.5 h-3.5 text-blue-400" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Action Suggestion Chips */}
        <div className="px-3.5 py-2 border-t border-white/5 bg-[#080d1c] flex items-center gap-2 overflow-x-auto scrollbar-none">
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickAction(chip.text)}
              className="px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-slate-300 hover:text-white text-[11px] font-medium whitespace-nowrap transition cursor-pointer shrink-0"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Bottom Message Input Bar */}
        <form onSubmit={handleSend} className="p-3 sm:p-4 border-t border-white/10 bg-[#0a0f20]/90 backdrop-blur-xl flex items-center gap-2.5">
          <input
            type="text"
            placeholder="Type a message or price inquiry..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-4 py-3 bg-[#060914] border border-white/15 rounded-full text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 transition shadow-inner"
          />
          <button
            type="submit"
            className="p-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] transition cursor-pointer transform hover:scale-105 active:scale-95 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
};
