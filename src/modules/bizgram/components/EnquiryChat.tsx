import React, { useState } from 'react';
import { 
  Send, Phone, CheckCircle2, FileText, Tag, MessageCircle, 
  MapPin, Sparkles, Plus, MoreHorizontal, ArrowLeft, User 
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
  const [quoteItems, setQuoteItems] = useState('25 x Pure Silk Sarees');
  const [quoteAmount, setQuoteAmount] = useState<number>(42500);

  const activeThread = threads.find((t) => t.threadId === selectedThreadId) || threads[0];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeThread) return;
    onSendMessage(activeThread.threadId, inputText);
    setInputText('');
  };

  const handleSendOfficialQuotation = () => {
    if (!activeThread || quoteAmount <= 0) return;
    const gst = Math.round(quoteAmount * 0.18);
    const total = quoteAmount + gst;

    const quotationData = {
      items: quoteItems,
      amount: quoteAmount,
      gst: gst,
      total: total,
    };

    onSendMessage(
      activeThread.threadId,
      `அதிகாரப்பூர்வ 18% GST விலைப்பட்டியல் (Quotation): ${quoteItems}`,
      quotationData
    );
    setShowQuoteDrawer(false);
  };

  return (
    <div className="max-w-5xl mx-auto h-[82vh] bg-[#0e1428]/95 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.5)] flex flex-col md:flex-row select-none font-sans">
      
      {/* ========================================================================= */}
      {/* 1. LEFT THREADS COLUMN (EXACT MOCKUP)                                     */}
      {/* ========================================================================= */}
      <div className={`w-full md:w-80 lg:w-96 border-r border-white/10 flex flex-col bg-[#0a0f20]/90 ${selectedThreadId && 'hidden md:flex'}`}>
        
        {/* Header: Messages (5) + Plus + More (Exact Mockup) */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-white tracking-tight">
              Messages
            </h2>
            <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
              5
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <button className="p-1.5 hover:bg-white/10 rounded-full transition cursor-pointer">
              <Plus className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:bg-white/10 rounded-full transition cursor-pointer">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Tabs: All | Connections | Enquiries | Notifications (Exact Mockup) */}
        <div className="flex items-center justify-between border-b border-white/10 px-3 py-2 text-xs font-bold text-slate-400">
          {(['All', 'Connections', 'Enquiries', 'Notifications'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-2.5 py-1 rounded-full transition cursor-pointer ${
                activeFilter === tab
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'hover:text-white'
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
                    ? 'bg-blue-600/15 border-l-4 border-blue-500'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={thread.avatar}
                    alt={thread.memberName}
                    className="w-11 h-11 rounded-full object-cover border border-white/15"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center border border-black text-[9px]">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="font-bold text-xs sm:text-sm text-white truncate flex items-center gap-1">
                      <span>{thread.memberName}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {thread.lastTime}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-400 truncate pr-2">
                      {thread.lastMessage}
                    </p>
                    {thread.unreadCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
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
      {/* 2. RIGHT ACTIVE CHAT CONVERSATION VIEW                                   */}
      {/* ========================================================================= */}
      <div className={`flex-1 flex flex-col bg-[#080d1c] ${!selectedThreadId && 'hidden md:flex'}`}>
        
        {/* Top Active Chat Header */}
        <div className="p-3.5 sm:p-4 border-b border-white/10 bg-[#0c1224]/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedThreadId('')}
              className="md:hidden p-1.5 text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <img
              src={activeThread?.avatar}
              alt={activeThread?.memberName}
              className="w-10 h-10 rounded-full object-cover border border-white/20"
            />
            <div>
              <div className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                <span>{activeThread?.memberName}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Active B2B Member • {activeThread?.taluk}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQuoteDrawer(!showQuoteDrawer)}
              className="px-3 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Quotation</span>
            </button>
            <a
              href={`tel:917548820641`}
              className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-300 hover:text-white transition"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
            </a>
          </div>
        </div>

        {/* Quotation Generator Bar (Optional Slide Down) */}
        {showQuoteDrawer && (
          <div className="p-3.5 bg-indigo-950/40 border-b border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex-1 w-full flex gap-2">
              <input
                type="text"
                value={quoteItems}
                onChange={(e) => setQuoteItems(e.target.value)}
                placeholder="Product items..."
                className="flex-1 px-3 py-1.5 bg-black/40 border border-white/10 rounded-xl text-white"
              />
              <input
                type="number"
                value={quoteAmount}
                onChange={(e) => setQuoteAmount(Number(e.target.value))}
                placeholder="Amount ₹"
                className="w-28 px-3 py-1.5 bg-black/40 border border-white/10 rounded-xl text-white font-mono"
              />
            </div>
            <button
              onClick={handleSendOfficialQuotation}
              className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-md cursor-pointer shrink-0"
            >
              Send GST Quote (₹{Math.round(quoteAmount * 1.18)})
            </button>
          </div>
        )}

        {/* Messages List Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
          {activeThread?.messages.map((msg) => {
            const isMe = msg.senderId.includes('shinegah') || msg.senderId === 'buyer' || msg.senderId.includes('chandru');
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-2 ${
                    isMe
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'bg-[#12192e] text-slate-200 border border-white/10'
                  }`}
                >
                  {/* Attached Post Card if enquiry */}
                  {msg.attachedPostTitle && (
                    <div className="p-2 rounded-xl bg-black/30 border border-white/15 flex items-center gap-2.5">
                      {msg.attachedPostThumb && (
                        <img
                          src={msg.attachedPostThumb}
                          alt="Post"
                          className="w-9 h-9 rounded-lg object-cover"
                        />
                      )}
                      <div className="min-w-0">
                        <div className="font-bold text-[11px] truncate text-white">
                          {msg.attachedPostTitle}
                        </div>
                        <div className="text-[10px] text-amber-300 font-mono">
                          {msg.attachedPrice}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Quotation card */}
                  {msg.isQuotation && msg.quotationData && (
                    <div className="p-3 rounded-xl bg-indigo-950/80 border border-indigo-400/40 text-white space-y-1">
                      <div className="font-bold text-xs text-amber-300">GST கொட்டேஷன்:</div>
                      <div>{msg.quotationData.items}</div>
                      <div className="font-mono text-xs pt-1 border-t border-white/10 flex justify-between">
                        <span>மொத்த தொகை:</span>
                        <span className="font-bold text-emerald-400">₹{msg.quotationData.total}</span>
                      </div>
                    </div>
                  )}

                  <p>{msg.text}</p>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            );
          })}
        </div>

        {/* Bottom Message Input Bar */}
        <form onSubmit={handleSend} className="p-3 sm:p-4 border-t border-white/10 bg-[#0c1224]/80 flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message or price inquiry..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-[#080d1c] border border-white/10 rounded-full text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
          />
          <button
            type="submit"
            className="p-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg transition cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
};
