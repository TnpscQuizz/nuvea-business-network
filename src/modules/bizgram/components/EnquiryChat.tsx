import React, { useState } from 'react';
import { 
  Send, Phone, CheckCircle2, FileText, Tag, MessageCircle, 
  MapPin, Sparkles, Plus, Image, ArrowRight, User 
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
  const [selectedThreadId, setSelectedThreadId] = useState<string>(
    initialActiveThreadId || threads[0]?.threadId || ''
  );
  const [inputText, setInputText] = useState('');
  const [showQuoteDrawer, setShowQuoteDrawer] = useState(false);
  const [quoteItems, setQuoteItems] = useState('25 x பட்டு சேலைகள் (Pure Silk)');
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
      'அதிகாரப்பூர்வ 18% GST விலைப்பட்டியல் (Quotation) கீழே சமர்ப்பிக்கப்பட்டுள்ளது:',
      quotationData
    );
    setShowQuoteDrawer(false);
  };

  if (!activeThread) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 font-bold">
        விசாரணை உரையாடல்கள் எதுவும் இல்லை.
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl shadow-sm overflow-hidden h-[78vh] sm:h-[82vh] grid grid-cols-1 md:grid-cols-12">
      
      {/* LEFT COLUMN: CONVERSATION THREADS (4 COLS) */}
      <div className="md:col-span-4 border-r border-slate-100 flex flex-col h-full bg-slate-50/50">
        
        {/* Threads Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-black text-slate-900 text-sm">
              விசாரணைகள் & சேட்கள் (Enquiries)
            </h3>
            <p className="text-[11px] text-slate-500">
              வாங்குபவர்கள் & சாப்டர் நெட்வொர்க்
            </p>
          </div>
          <span className="bg-amber-400 text-slate-950 text-xs font-black px-2 py-0.5 rounded-full">
            {threads.length}
          </span>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {threads.map((thread) => {
            const isSelected = thread.threadId === activeThread.threadId;
            return (
              <div
                key={thread.threadId}
                onClick={() => setSelectedThreadId(thread.threadId)}
                className={`p-3.5 flex items-start gap-3 cursor-pointer transition ${
                  isSelected ? 'bg-amber-50/80 border-l-4 border-amber-400' : 'hover:bg-slate-100/70'
                }`}
              >
                <img
                  src={thread.avatar}
                  alt={thread.memberName}
                  className="w-11 h-11 rounded-full object-cover shrink-0 border border-slate-200"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                      {thread.memberName}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {thread.lastTime}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 truncate mt-0.5">
                    {thread.lastMessage}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-500">
                    <MapPin className="w-2.5 h-2.5 text-amber-600" />
                    <span>{thread.taluk}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* RIGHT COLUMN: ACTIVE CHAT THREAD (8 COLS) */}
      <div className="md:col-span-8 flex flex-col h-full bg-white relative">
        
        {/* Active Chat Header */}
        <div className="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={activeThread.avatar}
              alt={activeThread.memberName}
              className="w-10 h-10 rounded-full object-cover border-2 border-amber-400"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm text-slate-900">
                  {activeThread.memberName}
                </span>
                <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-500/20" />
              </div>
              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-600" />
                <span>{activeThread.taluk}</span>
              </div>
            </div>
          </div>

          <a
            href="tel:917548820641"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200 text-xs font-bold transition"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>நேரடி அழைப்பு</span>
          </a>
        </div>

        {/* Message History */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/30">
          {activeThread.messages.map((msg) => {
            const isMe = msg.senderId === 'buyer' || msg.senderId === 'my_biz';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                {/* Sender Name if Chapter Group */}
                {!isMe && (
                  <span className="text-[10px] text-slate-500 font-bold mb-1 ml-1">
                    {msg.senderName}
                  </span>
                )}

                {/* Attached Product / Reel Card if exists */}
                {msg.attachedPostTitle && (
                  <div className="mb-2 max-w-xs rounded-2xl overflow-hidden border border-amber-300 bg-amber-50/90 shadow-xs p-2.5 flex items-center gap-2.5">
                    {msg.attachedPostThumb && (
                      <img
                        src={msg.attachedPostThumb}
                        alt="Attached product"
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <div className="text-[10px] font-black text-amber-900 uppercase">
                        விசாரிக்கப்படும் தயாரிப்பு:
                      </div>
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {msg.attachedPostTitle}
                      </div>
                      {msg.attachedPrice && (
                        <div className="text-[11px] font-black text-slate-700">
                          {msg.attachedPrice}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Main Message Bubble */}
                <div
                  className={`max-w-sm sm:max-w-md px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isMe
                      ? 'bg-[#0a1128] text-white rounded-br-xs'
                      : 'bg-white text-slate-900 border border-slate-200 rounded-bl-xs'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Formal Quotation Card if isQuotation */}
                  {msg.isQuotation && msg.quotationData && (
                    <div className="mt-2.5 p-3 rounded-xl bg-slate-900/10 border border-slate-200 text-slate-900 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-black text-amber-800">
                        <FileText className="w-3.5 h-3.5 text-amber-600" />
                        <span>அதிகாரப்பூர்வ விலைப்பட்டியல் (Quotation)</span>
                      </div>
                      <div className="text-xs font-semibold">{msg.quotationData.items}</div>
                      <div className="border-t border-slate-200 pt-1 text-[11px] space-y-0.5">
                        <div className="flex justify-between">
                          <span>அடிப்படை விலை:</span>
                          <span>₹{msg.quotationData.amount.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>18% GST வரி (9% CGST + 9% SGST):</span>
                          <span>₹{msg.quotationData.gst.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between font-black text-xs text-emerald-700 pt-1 border-t border-slate-200">
                          <span>மொத்த தொகை (Net Total):</span>
                          <span>₹{msg.quotationData.total.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-slate-400 mt-1 mx-1">
                  {msg.timestamp}
                </span>
              </div>
            );
          })}
        </div>

        {/* Bottom Quotation Drawer (Toggleable) */}
        {showQuoteDrawer && (
          <div className="p-4 bg-amber-50/95 border-t border-amber-200 animate-in slide-in-from-bottom-2 duration-150 space-y-2">
            <div className="flex items-center justify-between text-xs font-black text-slate-900">
              <span className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-600" />
                <span>உடனடி 18% GST விலைப்பட்டியல் (Instant Quote Generator)</span>
              </span>
              <button
                onClick={() => setShowQuoteDrawer(false)}
                className="text-slate-500 hover:text-slate-800"
              >
                மறைக்க
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="பொருள் மற்றும் எண்ணிக்கை (எ.கா: 25 பட்டு சேலைகள்)"
                value={quoteItems}
                onChange={(e) => setQuoteItems(e.target.value)}
                className="p-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none"
              />
              <input
                type="number"
                placeholder="அடிப்படை தொகை (₹)"
                value={quoteAmount || ''}
                onChange={(e) => setQuoteAmount(Number(e.target.value))}
                className="p-2 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-600 font-semibold">
                GST (18%): ₹{Math.round((quoteAmount || 0) * 0.18).toLocaleString('en-IN')} | மொத்தம்: ₹{Math.round((quoteAmount || 0) * 1.18).toLocaleString('en-IN')}
              </span>
              <button
                onClick={handleSendOfficialQuotation}
                className="px-4 py-1.5 bg-slate-950 text-white rounded-full text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
              >
                விலைப்பட்டியலை அனுப்பு ➔
              </button>
            </div>
          </div>
        )}

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 sm:p-4 border-t border-slate-100 flex items-center gap-2">
          
          <button
            type="button"
            onClick={() => setShowQuoteDrawer(!showQuoteDrawer)}
            className="p-2.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
            title="விலைப்பட்டியல் உருவாக்க"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">கொட்டேஷன்</span>
          </button>

          <input
            type="text"
            placeholder="விசாரணை செய்தி அல்லது பதில் எழுதவும்..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-full text-xs text-slate-800 focus:outline-none focus:border-amber-400"
          />

          <button
            type="submit"
            className="w-10 h-10 rounded-full bg-[#0a1128] hover:bg-slate-800 text-white flex items-center justify-center shrink-0 transition cursor-pointer shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>

        </form>

      </div>

    </div>
  );
};
