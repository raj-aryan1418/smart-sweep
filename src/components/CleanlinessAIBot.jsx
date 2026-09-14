import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  X, 
  Send, 
  Trash2, 
  HelpCircle, 
  CheckCircle2, 
  ArrowRight, 
  Info, 
  Volume2, 
  VolumeX,
  Recycle,
  Lightbulb,
  ShieldAlert,
  Calendar,
  PackageCheck,
  PlusCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function CleanlinessAIBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Namaste! 🙏 I am your **SmartSweep AI Cleanliness Assistant**.\n\nI can help you with:\n- 🟢 **Waste Segregation Rules** (Wet vs Dry vs Hazardous)\n- 🛋️ **Bulk Furniture & Debris Disposal**\n- 🪴 **Home Kitchen Waste Composting**\n- 🚨 **Municipal Cleanliness Bylaws & Penalties**\n- 📅 **Ward Pickup Timetables**\n\nHow can I help you keep our city clean today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        'How to segregate wet & dry waste?',
        'How do I dispose of old furniture?',
        'How to make compost at home?',
        'What are the penalties for open dumping?'
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  // Cleanliness Knowledge Engine
  const generateBotReply = (query) => {
    const q = query.toLowerCase();

    // 1. Waste Segregation
    if (q.includes('segregat') || q.includes('wet') || q.includes('dry') || q.includes('bin') || q.includes('color') || q.includes('separate')) {
      return {
        text: `### ♻️ 3-Way Waste Segregation Guidelines:\n\n1. **🟢 Green Bin (Wet / Organic Waste):**\n   - Vegetable & fruit peels, leftover cooked food, eggshells, tea leaves, garden leaves & flowers.\n   - *Note:* Do NOT use plastic bin liners. Use newspaper or compostable bags.\n\n2. **🔵 Blue Bin (Dry / Recyclable Waste):**\n   - Clean plastic bottles, cardboard, paper, tetra packs, glass bottles, metal cans & milk pouches (rinsed & dried).\n\n3. **🔴 Red Bag / Domestic Hazardous Waste:**\n   - Sanitary pads, diapers, expired medicines, razor blades, CFL bulbs, paint cans, and broken glass.\n   - *Mandatory:* Wrap sanitary waste securely in newspaper with a red dot marker.`,
        action: { label: 'View Ward Segregation Schedule', path: '/schedule' },
        suggestions: ['How to compost wet waste?', 'How to dispose of electronics?']
      };
    }

    // 2. Bulk Furniture / Electronics / Construction Debris
    if (q.includes('bulk') || q.includes('furniture') || q.includes('sofa') || q.includes('debris') || q.includes('electronic') || q.includes('e-waste') || q.includes('mattress') || q.includes('fridge')) {
      return {
        text: `### 🛋️ Doorstep Bulk Waste Collection Service:\n\n- Do **NOT** dump old sofas, mattresses, or construction debris on street corners or public footpaths.\n- **SmartSweep offers free doorstep bulk pickup:**\n  1. Select your item category (Furniture, E-Waste, Rubble, Metal Scrap).\n  2. Pick your preferred morning/evening time slot.\n  3. Our heavy hydraulic compactor or mini tipper will arrive directly at your doorstep!\n\nWould you like to book a bulk pickup right now?`,
        action: { label: 'Book Doorstep Bulk Pickup Now', path: '/bulk-pickup' },
        suggestions: ['How to report overflowing garbage?', 'What are dumping fines?']
      };
    }

    // 3. Composting & Kitchen Waste
    if (q.includes('compost') || q.includes('kitchen') || q.includes('organic') || q.includes('fertilizer') || q.includes('plant')) {
      return {
        text: `### 🪴 Easy 4-Step Home Kitchen Composting:\n\n1. **Choose a Container:** Use a terracotta pot or a ventilated plastic bin with small air holes.\n2. **Layering (Green & Brown Ratio):**\n   - Layer 1 (Brown/Carbon): Dry leaves, shredded egg cartons, or sawdust at the bottom.\n   - Layer 2 (Green/Nitrogen): Daily fruit & vegetable peels, coffee grounds, and tea leaves.\n3. **Moisture Control:** Sprinkle a handful of sour buttermilk or curd water once a week to speed up microbial activity. Keep damp like a wrung-out sponge.\n4. **Harvest Black Gold:** In 45-60 days, you will get rich, dark, earthy compost for your home garden plants!`,
        action: null,
        suggestions: ['How to segregate wet & dry waste?', 'What are the penalties for open dumping?']
      };
    }

    // 4. Penalties / Fines / Bylaws
    if (q.includes('fine') || q.includes('penalt') || q.includes('law') || q.includes('illegal') || q.includes('burn') || q.includes('ban')) {
      return {
        text: `### 🚨 Municipal Solid Waste Cleanliness Bylaws & Penalties:\n\n- **Open Garbage Dumping on Roads:** ₹500 fine for 1st offense; ₹1,000 for subsequent offenses.\n- **Non-Segregation of Waste:** Sanitation workers will refuse unsegregated mixed garbage + ₹200 spot penalty.\n- **Open Burning of Garbage/Leaves:** Strict ₹5,000 fine under the Air Prevention & Control of Pollution Act.\n- **Single-Use Plastic Violation:** Ban on plastic carry bags (<120 microns), plastic cups, and thermocol tableware with fines up to ₹25,000 for commercial vendors.\n\n*Always report illegal blackspot dumping immediately on SmartSweep.*`,
        action: { label: 'Report a Garbage Blackspot', path: '/report' },
        suggestions: ['How to report garbage with GPS?', 'How to segregate waste?']
      };
    }

    // 5. Reporting / Complaints
    if (q.includes('report') || q.includes('complaint') || q.includes('photo') || q.includes('spot') || q.includes('hazard') || q.includes('overflow')) {
      return {
        text: `### 📸 How to File a Spot Waste Report:\n\n1. Click **"Report Issue"** in the navigation bar.\n2. Use **"Auto-detect GPS"** so our sanitation trucks can locate the exact coordinates.\n3. Snap or attach a spot photo.\n4. Select the severity level (Overflowing Bin, Animal Carcass, Drain Blockage, Medical Hazard).\n\nYour complaint is assigned to the nearest field compactor within **15 minutes**!`,
        action: { label: 'File Spot Report Now', path: '/report' },
        suggestions: ['View community live feed', 'Check ward collection timetable']
      };
    }

    // 6. Timetable / Schedule / Pickup Times
    if (q.includes('time') || q.includes('schedule') || q.includes('when') || q.includes('truck') || q.includes('morning') || q.includes('ward')) {
      return {
        text: `### ⏰ Municipal Collection Timings:\n\n- **Morning Residential Window:** 06:30 AM – 09:30 AM (Daily wet waste doorstep collection).\n- **Dry Waste Days:** Tuesday, Thursday, & Saturday.\n- **Hazardous & E-Waste Days:** Wednesday & Sunday.\n- **Evening Commercial Sweep:** 17:00 PM – 20:30 PM for high-density market streets.\n\nCheck your specific ward timetable below:`,
        action: { label: 'Check Ward Timetable', path: '/schedule' },
        suggestions: ['How to segregate wet & dry waste?', 'Book doorstep bulk pickup']
      };
    }

    // 7. General / Fallback Awareness
    return {
      text: `### 🌿 Cleanliness is a Shared Citizen Duty!\n\nEvery small action matters:\n- **Reduce:** Refuse single-use plastics & carry reusable cloth tote bags.\n- **Reuse:** Repurpose glass jars, cardboard cartons, and containers.\n- **Recycle & Segregate:** Keep dry recyclables clean, unsoiled, and separate.\n\nWhat specific topic would you like to explore?`,
      action: null,
      suggestions: [
        'How to segregate wet & dry waste?',
        'How do I dispose of old furniture?',
        'How to make compost at home?',
        'What are the penalties for open dumping?'
      ]
    };
  };

  const handleSend = (textToSend = input) => {
    if (!textToSend.trim()) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI reasoning delay
    setTimeout(() => {
      const botResponse = generateBotReply(textToSend);
      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botResponse.text,
        action: botResponse.action,
        suggestions: botResponse.suggestions,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      {/* Floating Launcher Trigger */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '76px',
            right: '16px',
            zIndex: 80,
            background: 'linear-gradient(135deg, var(--accent) 0%, #10b981 100%)',
            color: 'var(--accent-ink)',
            border: 'none',
            borderRadius: 'var(--radius-pill)',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 8px 24px rgba(47, 208, 119, 0.4)',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: '0.86rem',
            animation: 'pulseGlow 2.5s infinite',
            transition: 'transform 0.2s ease'
          }}
          title="Ask SmartSweep AI Cleanliness Bot"
        >
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Sparkles size={18} />
            <span style={{ position: 'absolute', top: -4, right: -4, width: '8px', height: '8px', borderRadius: '50%', background: '#fff' }} />
          </div>
          <span>Ask AI EcoBot</span>
        </button>
      )}

      {/* AI Chat Window Modal / Bottom Sheet */}
      {isOpen && (
        <div 
          style={{
            position: 'fixed',
            bottom: '16px',
            right: '16px',
            zIndex: 100,
            width: '100%',
            maxWidth: '420px',
            height: '560px',
            maxHeight: 'calc(100vh - 32px)',
            background: 'var(--surface)',
            border: '1px solid var(--line)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-lg)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'modalUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Bot Header */}
          <div 
            style={{
              padding: '14px 16px',
              background: 'linear-gradient(135deg, var(--surface) 0%, var(--surface-2) 100%)',
              borderBottom: '1px solid var(--line)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div 
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'var(--accent-dim)',
                  color: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--accent)'
                }}
              >
                <Bot size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-h)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  SmartSweep AI EcoBot
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--resolved)', display: 'inline-block' }} />
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                  Cleanliness & Waste Segregation Advisor
                </div>
              </div>
            </div>

            <button 
              className="icon-btn" 
              style={{ width: '32px', height: '32px' }}
              onClick={() => setIsOpen(false)}
            >
              <X size={16} />
            </button>
          </div>

          {/* Chat Messages Stream */}
          <div 
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              background: 'var(--ink)'
            }}
          >
            {messages.map(msg => (
              <div 
                key={msg.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '100%'
                }}
              >
                <div 
                  style={{
                    padding: '12px 14px',
                    borderRadius: msg.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                    background: msg.sender === 'user' ? 'var(--accent)' : 'var(--surface)',
                    color: msg.sender === 'user' ? 'var(--accent-ink)' : 'var(--text-h)',
                    border: msg.sender === 'user' ? 'none' : '1px solid var(--line)',
                    fontSize: '0.86rem',
                    lineHeight: 1.5,
                    maxWidth: '92%',
                    whiteSpace: 'pre-line',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  {msg.text}

                  {/* Optional Action Button */}
                  {msg.action && (
                    <button
                      onClick={() => {
                        navigate(msg.action.path);
                        setIsOpen(false);
                      }}
                      className="btn btn-secondary btn-sm"
                      style={{
                        marginTop: '10px',
                        width: '100%',
                        fontSize: '0.78rem',
                        justifyContent: 'space-between',
                        background: 'var(--surface-2)'
                      }}
                    >
                      <span>{msg.action.label}</span>
                      <ArrowRight size={13} />
                    </button>
                  )}
                </div>

                <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '3px', padding: '0 4px' }}>
                  {msg.time}
                </div>

                {/* Suggestions Chips */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px', maxWidth: '95%' }}>
                    {msg.suggestions.map((sugg, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(sugg)}
                        style={{
                          padding: '5px 10px',
                          borderRadius: 'var(--radius-pill)',
                          background: 'var(--surface)',
                          border: '1px solid var(--line)',
                          color: 'var(--accent)',
                          fontSize: '0.74rem',
                          fontWeight: 500,
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        💡 {sugg}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: 'var(--surface)', borderRadius: 'var(--radius-pill)', width: 'fit-content', border: '1px solid var(--line)', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                <Sparkles size={13} color="var(--accent)" />
                <span>AI EcoBot is typing...</span>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompt Category Bar */}
          <div 
            style={{
              padding: '6px 12px',
              background: 'var(--surface)',
              borderTop: '1px solid var(--line)',
              display: 'flex',
              gap: '6px',
              overflowX: 'auto',
              whiteSpace: 'nowrap'
            }}
          >
            <button 
              className="btn btn-secondary btn-sm" 
              style={{ fontSize: '0.72rem', padding: '3px 8px', minHeight: '26px' }}
              onClick={() => handleSend('How to segregate wet & dry waste?')}
            >
              ♻️ Waste Segregation
            </button>
            <button 
              className="btn btn-secondary btn-sm" 
              style={{ fontSize: '0.72rem', padding: '3px 8px', minHeight: '26px' }}
              onClick={() => handleSend('How to dispose of bulk furniture?')}
            >
              🛋️ Bulk Furniture
            </button>
            <button 
              className="btn btn-secondary btn-sm" 
              style={{ fontSize: '0.72rem', padding: '3px 8px', minHeight: '26px' }}
              onClick={() => handleSend('What are dumping penalties?')}
            >
              🚨 Bylaws & Fines
            </button>
          </div>

          {/* Chat Input Bar */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: '10px 14px',
              background: 'var(--surface)',
              borderTop: '1px solid var(--line)',
              display: 'flex',
              gap: '8px',
              alignItems: 'center'
            }}
          >
            <input 
              type="text"
              className="form-input"
              style={{ height: '38px', fontSize: '0.86rem', padding: '8px 12px' }}
              placeholder="Ask anything about waste, recycling, composting..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ width: '38px', height: '38px', padding: 0, flexShrink: 0, borderRadius: 'var(--radius-md)' }}
              disabled={!input.trim()}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
