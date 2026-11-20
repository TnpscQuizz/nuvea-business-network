import React, { useState } from 'react';
import { 
  Send, Phone, CheckCircle2, FileText, Tag, MessageCircle, 
  MapPin, Sparkles, Plus, MoreHorizontal, ArrowLeft, User, 
  Play, Pause, Volume2, Mic, Clock, CheckCheck, ShieldCheck 
} from 'lucide-react';
import type { BizEnquiryMessage } from '../../../types';
import { translations, type Language } from '../data/translations';

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
  lang?: Language;
  onSendMessage: (threadId: string, text: string, quotationData?: any) => void;
}

export const EnquiryChat: React.FC<EnquiryChatProps> = ({
  threads,
  activeThreadId: initialActiveThreadId,
  lang = 'en',
  onSendMessage,
}) => {
  const t = translations[lang] || translations.en;
  const [activeFilter, setActiveFilter] = useState<'All' | 'Connections' | 'Enquiries' | 'Notifications'>('All');
  const [selectedThreadId, setSelectedThreadId] = useState<string>(
    initialActiveThreadId || threads[0]?.threadId || ''
  );
  const [inputText, setInputText] = useState('');
  const [showQuoteDrawer, setShowQuoteDrawer] = useState(false);
  const [quoteItems, setQuoteItems] = useState('25 x Pure Handloom Silk Sarees');
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
      `${t.formalQuote} #${quotationData.quotationNumber}: ${quoteItems}`,
      quotationData
    );
    setShowQuoteDrawer(false);
  };

  const quickChips = [
    { label: t.chipPriceList, text: t.msgPriceList },
    { label: t.chipSample, text: t.msgSample },
    { label: t.chipCall, text: t.msgCall },
    { label: t.chipLocation, text: t.msgLocation },
  ];

  return (
    <div className="max-w-5xl mx-auto h-[84vh] apple-glass apple-specular-edge rounded-[36px] overflow-hidden flex flex-col md:flex-row select-none font-sans shadow-2xl">
      
      {/* ========================================================================= */}
      {/* 1. LEFT THREADS COLUMN (100% TRANSPARENT FROSTED GLASS)                   */}
      {/* ========================================================================= */}
      <div className={`w-full md:w-80 lg:w-96 border-r border-white/10 flex flex-col bg-white/[0.02] backdrop-blur-3xl ${selectedThreadId && 'hidden md:flex'}`}>
        
        {/* Header: Messages (5) + Plus + More */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-black text-white tracking-tight">
              {t.messages}
            </h2>
            <span className="w-5 h-5 rounded-full bg-white text-black text-[10px] font-black flex items-center justify-center shadow-md">
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

        {/* Filter Tabs: All | Connections | Enquiries | Notifications */}
        <div className="flex items-center justify-between border-b border-white/10 px-3 py-2.5 text-xs font-bold text-slate-400 bg-white/[0.01]">
          {(['All', 'Connections', 'Enquiries', 'Notifications'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3 py-1.5 rounded-full transition cursor-pointer ${
                activeFilter === tab
                  ? 'bg-white text-black shadow-md font-extrabold'
                  : 'hover:text-white hover:bg-white/5'
              }`}
            >
              {tab === 'All' ? t.allTab : tab === 'Connections' ? t.connectionsTab : tab === 'Enquiries' ? t.enquiriesTab : t.notificationsTab}
            </button>
          ))}
        </div>

        {/* Thread List Items */}
        <div className="flex-1 overflow-y-auto divide-y divide-white/5">
          {threads.map((thread) => {
            const isSelected = thread.threadId === activeThread?.threadId;
            return (
              <div
                key={thread.threadId}
                onClick={() => setSelectedThreadId(thread.threadId)}
                className={`p-3.5 sm:p-4 flex items-center gap-3 cursor-pointer transition ${
                  isSelected
                    ? 'bg-white/[0.1] border-l-2 border-white'
                    : 'hover:bg-white/[0.04]'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={thread.avatar}
                    alt={thread.memberName}
                    className="w-12 h-12 rounded-full object-cover border border-white/20 shadow-sm"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-white text-black flex items-center justify-center border border-black text-[9px] shadow-sm">
                    <CheckCircle2 className="w-3 h-3 text-black" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="font-bold text-xs sm:text-sm text-white truncate flex items-center gap-1.5">
                      <span>{thread.memberName}</span>
                      <CheckCircle2 className="w-3 h-3 text-white shrink-0" />
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
                      <span className="w-4 h-4 rounded-full bg-white text-black text-[10px] font-black flex items-center justify-center shrink-0 shadow-sm">
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
      {/* 2. RIGHT ACTIVE CHAT VIEWPORT (TRANSPARENT APPLE iMESSAGE GLASS)          */}
      {/* ========================================================================= */}
      <div className={`flex-1 flex flex-col bg-white/[0.01] backdrop-blur-3xl ${!selectedThreadId && 'hidden md:flex'}`}>
        
        {/* Top Active Chat Header */}
        <div className="p-3.5 sm:p-4 border-b border-white/10 bg-white/[0.03] backdrop-blur-2xl flex items-center justify-between">
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
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="text-[10px] text-slate-300 flex items-center gap-1.5 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>{t.activeMember} • {activeThread?.taluk}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQuoteDrawer(!showQuoteDrawer)}
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-sm"
            >
              <FileText className="w-3.5 h-3.5 text-white" />
              <span>{t.gstQuoteBtn}</span>
            </button>
            <a
              href="tel:917548820641"
              className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white transition border border-white/20"
              title="Call Business"
            >
              <Phone className="w-4 h-4 text-white" />
            </a>
          </div>
        </div>

        {/* GST Quotation Generator Drawer */}
        {showQuoteDrawer && (
          <div className="p-4 bg-white/[0.05] border-b border-white/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs animate-in slide-in-from-top-3 duration-200">
            <div className="flex-1 w-full flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={quoteItems}
                onChange={(e) => setQuoteItems(e.target.value)}
                placeholder="Product items & specifications..."
                className="flex-1 px-3.5 py-2 bg-black/60 border border-white/20 rounded-xl text-white text-xs placeholder-slate-400 focus:outline-none focus:border-white"
              />
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-mono">$</span>
                <input
                  type="number"
                  value={quoteAmount}
                  onChange={(e) => setQuoteAmount(Number(e.target.value))}
                  placeholder="Amount"
                  className="w-32 px-3 py-2 bg-black/60 border border-white/20 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-white"
                />
              </div>
            </div>
            <button
              onClick={handleSendOfficialQuotation}
              className="w-full sm:w-auto px-5 py-2 apple-btn-primary rounded-xl text-xs font-black cursor-pointer shrink-0 transition"
            >
              Send Quote (${Math.round(quoteAmount * 1.18).toLocaleString('en-US')})
            </button>
          </div>
        )}

        {/* Messages List Area (Apple Transparent iMessage Bubbles) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          
          {/* Simulated Voice Message from Ramesh Kumar */}
          {activeThread?.threadId === 'th_ramesh' && (
            <div className="flex flex-col items-start">
              <div className="p-3.5 rounded-2xl bg-white/[0.06] border border-white/15 text-white max-w-xs sm:max-w-sm space-y-2 shadow-lg backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="w-10 h-10 rounded-full bg-white text-black hover:bg-slate-200 flex items-center justify-center shadow-md transition cursor-pointer shrink-0"
                  >
                    {isPlayingAudio ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black ml-0.5" />}
                  </button>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-200">
                      <span>Ramesh_Voice_Inquiry.aac</span>
                      <span className="font-mono text-white">0:24</span>
                    </div>
                    {/* Audio Waveform Simulator */}
                    <div className="flex items-center gap-1 h-5">
                      {[40, 70, 90, 50, 100, 80, 45, 60, 95, 75, 40, 85, 65, 50, 90, 30].map((h, i) => (
                        <div
                          key={i}
                          style={{ height: `${isPlayingAudio ? (h * 0.8) : (h * 0.4)}%` }}
                          className={`w-1 rounded-full transition-all duration-300 ${
                            isPlayingAudio ? 'bg-white' : 'bg-white/40'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-white/10">
                  <span>{t.voiceNote}</span>
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
                  className={`max-w-[85%] sm:max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-2.5 backdrop-blur-2xl ${
                    isMe
                      ? 'bg-white/[0.14] text-white border border-white/25 shadow-lg'
                      : 'bg-white/[0.04] text-slate-200 border border-white/10 shadow-md'
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
                        <div className="text-[11px] text-emerald-300 font-mono font-semibold">
                          {msg.attachedPrice}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Formal Quotation Card */}
                  {msg.isQuotation && msg.quotationData && (
                    <div className="p-3.5 rounded-2xl bg-white/[0.08] border border-white/20 text-white space-y-2 shadow-inner">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <span className="font-black text-xs text-white">{t.formalQuote}</span>
                        <span className="text-[10px] font-mono text-slate-400">SAC: 998314</span>
                      </div>
                      <div className="text-xs text-slate-200">{msg.quotationData.items}</div>
                      
                      <div className="space-y-1 font-mono text-[11px] pt-2 border-t border-white/10 text-slate-300">
                        <div className="flex justify-between">
                          <span>{t.basePrice}</span>
                          <span>${msg.quotationData.amount.toLocaleString('en-US')}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Tax GST (18%):</span>
                          <span>${(msg.quotationData.cgst + msg.quotationData.sgst).toLocaleString('en-US')}</span>
                        </div>
                        <div className="flex justify-between text-xs font-bold text-emerald-400 pt-1 border-t border-white/10">
                          <span>{t.totalAmount}</span>
                          <span>${msg.quotationData.total.toLocaleString('en-US')}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <p>{msg.text}</p>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1 px-1">
                  <span>{msg.timestamp}</span>
                  {isMe && <CheckCheck className="w-3.5 h-3.5 text-white" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Action Suggestion Chips */}
        <div className="px-3.5 py-2.5 border-t border-white/10 bg-white/[0.02] flex items-center gap-2 overflow-x-auto scrollbar-none">
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickAction(chip.text)}
              className="px-3.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-slate-200 hover:text-white text-[11px] font-semibold whitespace-nowrap transition cursor-pointer shrink-0 shadow-sm"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Bottom Message Input Bar */}
        <form onSubmit={handleSend} className="p-3 sm:p-4 border-t border-white/10 bg-white/[0.03] backdrop-blur-2xl flex items-center gap-2.5">
          <input
            type="text"
            placeholder={t.typeMessagePlaceholder}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-4 py-3 bg-white/[0.04] border border-white/15 rounded-full text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-white transition shadow-inner"
          />
          <button
            type="submit"
            className="p-3 rounded-full apple-btn-primary transition cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4 text-black" />
          </button>
        </form>

      </div>

    </div>
  );
};
