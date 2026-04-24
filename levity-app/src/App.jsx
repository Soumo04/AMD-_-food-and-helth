import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, MapPin, ShoppingBag, Zap,
  CheckCircle2, ArrowRight, BrainCircuit,
  HeartPulse, Navigation, Clock, Flame,
  Terminal, ShieldCheck, CheckSquare, Loader2
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';
import './index.css';

// --- Dummy Data ---
const initialChartData = [
  { time: '13:00', hr: 65, cortisol: 30, glucose: 90 },
  { time: '13:30', hr: 68, cortisol: 35, glucose: 95 },
  { time: '14:00', hr: 85, cortisol: 60, glucose: 85 }, // Meeting starts
  { time: '14:30', hr: 92, cortisol: 80, glucose: 75 }, // Stress peaks
  { time: '15:00', hr: 88, cortisol: 75, glucose: 70 }, // Vulnerability zone
];

const aiReasoningSequence = [
  { time: '14:00:02', type: 'system', text: '[SYS] Firebase Auth: Oura Ring sync established.' },
  { time: '14:15:44', type: 'process', text: 'Ingesting 15m biometric window. HR anomaly detected: +25%.' },
  { time: '14:16:01', type: 'process', text: 'Querying Google Calendar via MCP...' },
  { time: '14:16:05', type: 'alert', text: 'Calendar: 4-hour continuous "Sprint Planning" block found.' },
  { time: '14:16:12', type: 'process', text: 'Running Predictive Model (Gemini 1.5 Pro)...' },
  { time: '14:16:15', type: 'alert', text: 'Prediction: Cortisol crash at 15:30. Blood glucose deficit.' },
  { time: '14:16:16', type: 'decision', text: 'Intervention Required: High-protein, low-GI snack.' },
  { time: '14:16:18', type: 'process', text: 'Checking Firestore Pantry Inventory...' },
  { time: '14:16:20', type: 'decision', text: 'Pantry: Greek Yogurt (Available). Formulating Nudge.' },
];

// --- Components ---

const BiometricsChart = ({ data }) => {
  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
            itemStyle={{ fontSize: '12px' }}
          />
          <ReferenceLine y={75} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'top', value: 'Stress Threshold', fill: '#ef4444', fontSize: 10 }} />
          <Line type="monotone" dataKey="hr" stroke="#06b6d4" strokeWidth={2} dot={false} name="Heart Rate" />
          <Line type="monotone" dataKey="cortisol" stroke="#a855f7" strokeWidth={2} dot={false} name="Cortisol Level" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const AITerminal = ({ sequence, onUserSubmit }) => {
  const scrollRef = useRef(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [sequence]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    onUserSubmit(inputValue);
    setInputValue('');
  };

  return (
    <div className="ai-terminal">
      <div className="glow-overlay" />
      <div className="terminal-header">
        <Terminal size={16} />
        Zero-G Engine reasoning stream
      </div>
      <div className="terminal-content" ref={scrollRef}>
        <AnimatePresence>
          {sequence.map((log, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`log-entry ${log.type}`}
            >
              <span className="log-time">[{log.time}]</span>
              <span>{log.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <form className="terminal-input-container" onSubmit={handleSubmit}>
        <span style={{ color: 'var(--accent-secondary)' }}>&gt;</span>
        <input 
          type="text" 
          className="terminal-input" 
          placeholder="Inject manual context (e.g., 'Feeling stressed')..." 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </form>
    </div>
  );
};

const NudgeCard = ({ icon: Icon, type, title, time, body, macros, actionText, onExecute }) => {
  const [executing, setExecuting] = useState(false);
  const [done, setDone] = useState(false);

  const handleExecute = () => {
    setExecuting(true);
    setTimeout(() => {
      setExecuting(false);
      setDone(true);
      if (onExecute) onExecute();
    }, 2000);
  };

  return (
    <motion.div 
      className="glass-panel nudge-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="glow-overlay" />
      
      {/* Header */}
      <div className="nudge-card-header">
        <div className={`icon-wrapper ${type}`}>
          <Icon size={24} />
        </div>
        <div>
          <h3 className="nudge-title">{title}</h3>
          <div className="nudge-meta">
            <Clock size={14} /> {time}
          </div>
        </div>
      </div>

      {/* Body */}
      {!executing && !done && (
        <motion.div exit={{ opacity: 0 }} className="nudge-body">
          <p>{body}</p>
          {macros && (
            <div className="macro-breakdown">
              <div className="macro-item"><span className="macro-label">Protein</span><span className="macro-value p">{macros.p}g</span></div>
              <div className="macro-item"><span className="macro-label">Carbs</span><span className="macro-value c">{macros.c}g</span></div>
              <div className="macro-item"><span className="macro-label">Fat</span><span className="macro-value f">{macros.f}g</span></div>
            </div>
          )}
        </motion.div>
      )}

      {/* Executing State */}
      {executing && (
        <div className="executing-state">
          <Loader2 size={32} color="var(--accent-primary)" className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Authenticating via Firebase MCP...</p>
          <div className="loader-bar"><div className="loader-fill" /></div>
        </div>
      )}

      {/* Done State */}
      {done && (
        <div className="executing-state" style={{ color: 'var(--success)' }}>
          <ShieldCheck size={40} />
          <p style={{ color: 'white' }}>Protocol Executed Securely.</p>
        </div>
      )}

      {/* Actions */}
      {!executing && !done && (
        <div className="nudge-actions">
          <button className="btn-primary" onClick={handleExecute}>
            {actionText} <ArrowRight size={16} />
          </button>
        </div>
      )}
    </motion.div>
  );
};

// --- Main App ---

function App() {
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [chartData, setChartData] = useState(initialChartData);

  // Simulate AI Thinking
  useEffect(() => {
    setTerminalLogs([]); // Prevent duplicate logs on hot-reload
    let i = 0;
    const interval = setInterval(() => {
      if (i < aiReasoningSequence.length) {
        setTerminalLogs(prev => [...prev, aiReasoningSequence[i]]);
        
        // Slightly tweak chart data to make it look alive when thinking
        if (i > 3) {
          setChartData(prev => {
            const last = prev[prev.length - 1];
            return [...prev.slice(1), { 
              time: '15:' + (10 + i), 
              hr: last.hr + (Math.random() > 0.5 ? 2 : -2),
              cortisol: last.cortisol + 1,
              glucose: last.glucose - 1
            }];
          });
        }
        i++;
      } else {
        clearInterval(interval);
      }
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleUserSubmit = (text) => {
    const now = new Date();
    const pad = (num) => String(num).padStart(2, '0');
    const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    
    // Add user message
    setTerminalLogs(prev => [...prev, { time: timeStr, type: 'process', text: `[USER INJECT] ${text}` }]);
    
    // Simulate AI response after 1.5 seconds
    setTimeout(() => {
      const responseTime = new Date();
      const respTimeStr = `${pad(responseTime.getHours())}:${pad(responseTime.getMinutes())}:${pad(responseTime.getSeconds())}`;
      setTerminalLogs(prev => [...prev, { 
        time: respTimeStr, 
        type: 'decision', 
        text: `Context override accepted: "${text}". Re-calibrating next intervention...` 
      }]);
    }, 1500);
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo-container">
          <BrainCircuit size={40} color="var(--accent-primary)" />
          <h1 className="logo-text text-gradient">Levity</h1>
        </div>
        <motion.div className="status-badge" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="pulse-dot"></div>
          Zero-G Engine Active
        </motion.div>
      </header>

      <div className="grid-layout">
        
        {/* Left: AI Terminal */}
        <aside>
          <AITerminal sequence={terminalLogs} onUserSubmit={handleUserSubmit} />
        </aside>

        {/* Center: Nudge Feed */}
        <main className="nudge-feed">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
            <Activity size={24} color="var(--accent-secondary)" />
            Interventions
          </h2>
          
          <NudgeCard 
            icon={Zap}
            type="warning"
            title="Cortisol Spike Predicted"
            time="2:30 PM (In 10 mins)"
            body="Rough schedule today. I see 4 hours of Zoom calls and only 5.5h of sleep. I've queued up a high-protein, mood-stabilizing snack to keep you sharp. Eat it in 10 minutes to avoid the 3PM crash."
            macros={{ p: 25, c: 15, f: 10 }}
            actionText="Confirm Prep"
          />

          <NudgeCard 
            icon={ShoppingBag}
            type="ai"
            title="Autopilot Inventory Logistics"
            time="Tomorrow 9:00 AM Delivery"
            body="Your weekly staples are low. I've built your quick-commerce cart and optimized for delivery fees based on your consumption rates."
            actionText="Approve ₹1,850 Order"
            onExecute={() => setTerminalLogs(prev => [...prev, { time: '14:20:01', type: 'execute', text: 'Firebase Function -> Quick-Commerce API: Order 9482A Confirmed.' }])}
          />
        </main>

        {/* Right: Biometrics */}
        <aside>
          <div className="glass-panel biometrics-panel">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
              <HeartPulse size={20} color="var(--accent-secondary)" />
              Live Biometrics
            </h3>
            
            <div className="stat-grid">
              <div className="stat-box">
                <span className="label">Resting HR</span>
                <span className="value">62 <span style={{fontSize:'1rem', color:'#94a3b8'}}>bpm</span></span>
              </div>
              <div className="stat-box" style={{borderColor: 'rgba(239, 68, 68, 0.3)'}}>
                <span className="label">Sleep Score</span>
                <span className="value text-gradient" style={{backgroundImage: 'linear-gradient(135deg, #ef4444, #f59e0b)'}}>58</span>
              </div>
              <div className="stat-box" style={{borderColor: 'rgba(168, 85, 247, 0.3)'}}>
                <span className="label">Cortisol Trend</span>
                <span className="value" style={{color: 'var(--accent-primary)'}}>Elevating</span>
              </div>
              <div className="stat-box">
                <span className="label">Next Burn</span>
                <span className="value">600 <span style={{fontSize:'1rem', color:'#94a3b8'}}>kcal</span></span>
              </div>
            </div>

            <BiometricsChart data={chartData} />
          </div>
        </aside>

      </div>
    </div>
  );
}

export default App;
