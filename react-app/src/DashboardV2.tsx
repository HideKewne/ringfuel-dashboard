import { useState, useEffect, useCallback } from 'react';
import './variant-2.css';

const STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
  'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'
];

const DEFAULT_SELECTED = ['CA', 'TX', 'FL', 'NY', 'IL'];

export default function DashboardV2() {
  const [isDark, setIsDark] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [sourceStates, setSourceStates] = useState([true, true, true, true]);
  const [statusOnline, setStatusOnline] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [showCallModal, setShowCallModal] = useState(false);
  const [selectedStates, setSelectedStates] = useState<Set<string>>(new Set(DEFAULT_SELECTED));
  const [stateSearch, setStateSearch] = useState('');
  const [activeBillingPreset, setActiveBillingPreset] = useState(2);
  const [payAmount, setPayAmount] = useState('$50');

  const billingPresets = ['$10', '$25', '$50', '$100'];

  // Time update
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Toggle reactor
  const toggleReactor = useCallback(() => {
    setIsTransitioning(true);
    setIsDark(prev => {
      const goingDark = !prev;
      setTimeout(() => setStatusOnline(goingDark), 300);
      return goingDark;
    });
    setTimeout(() => setIsTransitioning(false), 800);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (e.key === 'c' || e.key === 'C') {
        setShowCallModal(true);
      }
      if (e.key === 'd' || e.key === 'D') {
        toggleReactor();
      }
      if (e.key === 'Escape') {
        setShowCallModal(false);
        setShowSettings(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [toggleReactor]);

  // Manage body classes
  useEffect(() => {
    document.body.className = '';
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.add('light-mode');
    }
    if (isTransitioning) {
      document.body.classList.add('transitioning');
    }
    return () => {
      document.body.className = '';
    };
  }, [isDark, isTransitioning]);

  const toggleSource = (index: number) => {
    setSourceStates(prev => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const toggleState = (state: string) => {
    setSelectedStates(prev => {
      const next = new Set(prev);
      if (next.has(state)) {
        next.delete(state);
      } else {
        next.add(state);
      }
      return next;
    });
  };

  const selectAllStates = () => setSelectedStates(new Set(STATES));
  const clearAllStates = () => setSelectedStates(new Set());

  const filteredStates = STATES.filter(s =>
    s.toLowerCase().includes(stateSearch.toLowerCase())
  );

  const sources = [
    { name: 'Google Ads', label: 'Search / PPC Leads' },
    { name: 'Facebook Leads', label: 'Social Media' },
    { name: 'Cold Calls', label: 'Outbound' },
    { name: 'Referrals', label: 'Word of Mouth' },
  ];

  const leaderboard = [
    { rank: 1, name: 'Joe Vazquez', stats: '156 calls - $12,400', img: 3 },
    { rank: 2, name: 'Cole Bingham', stats: '134 calls - $10,200', img: 8 },
    { rank: 3, name: 'Anne Mitchell', stats: '121 calls - $9,800', img: 5 },
    { rank: 4, name: 'Marcus Chen', stats: '108 calls - $8,500', img: 12 },
    { rank: 5, name: 'Sarah Williams', stats: '95 calls - $7,200', img: 9 },
    { rank: 6, name: 'David Park', stats: '87 calls - $6,800', img: 15 },
    { rank: 7, name: 'Emma Rodriguez', stats: '79 calls - $5,900', img: 25 },
    { rank: 8, name: 'Michael Torres', stats: '72 calls - $5,400', img: 53 },
  ];

  return (
    <>
      {/* Background Container */}
      <div className="bg-container">
        <div className="bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
        <div className="energy-background">
          <div className="energy-gradient"></div>
          <div className="energy-pulse"></div>
        </div>
      </div>

      {/* Top Navigation */}
      <nav className="top-nav">
        <div className="nav-left">
          <div className="logo">
            <div className="logo-icon">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="18" fill="url(#fuelGradient2)" stroke="var(--primary-teal)" strokeWidth="2"/>
                <path d="M20 8C20 8 14 16 14 22C14 25.314 16.686 28 20 28C23.314 28 26 25.314 26 22C26 16 20 8 20 8Z" fill="url(#flameGradient2)"/>
                <path d="M20 14C20 14 17 18 17 21C17 22.657 18.343 24 20 24C21.657 24 23 22.657 23 21C23 18 20 14 20 14Z" fill="rgba(255,255,255,0.8)"/>
                <defs>
                  <linearGradient id="fuelGradient2" x1="0" y1="0" x2="40" y2="40">
                    <stop offset="0%" stopColor="#0F1320"/>
                    <stop offset="100%" stopColor="#161C2D"/>
                  </linearGradient>
                  <linearGradient id="flameGradient2" x1="20" y1="8" x2="20" y2="28">
                    <stop offset="0%" stopColor="#FF6B2B"/>
                    <stop offset="50%" stopColor="#29B6A8"/>
                    <stop offset="100%" stopColor="#2C5FA8"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="logo-text">Ring<span className="accent">Fuel</span></span>
          </div>
        </div>

        <div className="nav-center">
          <a href="#" className="nav-link active">
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
            Calls
          </a>
          <a href="#" className="nav-link">
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            Leaderboard
          </a>
          <a href="#" className="nav-link">
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
            </svg>
            Billing
          </a>
          <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); setShowSettings(true); }}>
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/>
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
            </svg>
            Settings
          </a>
        </div>

        <div className="nav-right">
          <div className="mode-indicator">
            <span className="mode-label">{isDark ? 'Fueled' : 'Standby'}</span>
          </div>
          <div className="time">{currentTime}</div>
          <div className="user-profile">
            <span className="user-name">Michael Gustin</span>
            <div className="user-avatar">MG</div>
          </div>
        </div>
      </nav>

      {/* Main Content - Asymmetric Layout */}
      <main className="main-content">
        {/* Left: Reactor Core */}
        <section className="reactor-section">
          <div className="reactor-container" onClick={toggleReactor}>
            <div className="reactor-button">
              <div className="orbital-system">
                <div className="orbital-ring ring-1">
                  <div className="particle"></div>
                  <div className="particle"></div>
                </div>
                <div className="orbital-ring ring-2">
                  <div className="particle"></div>
                  <div className="particle"></div>
                </div>
                <div className="orbital-ring ring-3">
                  <div className="particle"></div>
                  <div className="particle"></div>
                </div>
              </div>
              <svg viewBox="0 0 120 120" className="reactor-core-svg">
                <defs>
                  <radialGradient id="v2coreGlowOn" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFFFFF"/>
                    <stop offset="30%" stopColor="#29B6A8"/>
                    <stop offset="70%" stopColor="#1F9A8E"/>
                    <stop offset="100%" stopColor="transparent"/>
                  </radialGradient>
                  <radialGradient id="v2coreGlowOff" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#E8E8E8"/>
                    <stop offset="50%" stopColor="#B0B0B0"/>
                    <stop offset="100%" stopColor="#808080"/>
                  </radialGradient>
                  <filter id="v2coreBlur">
                    <feGaussianBlur stdDeviation="3"/>
                  </filter>
                </defs>
                <circle cx="60" cy="60" r="55" className="containment-ring" fill="none" strokeWidth="1.5"/>
                <circle cx="60" cy="60" r="48" className="containment-ring-inner" fill="none" strokeWidth="0.5"/>
                <polygon points="60,20 94,40 94,80 60,100 26,80 26,40" className="hex-core" strokeWidth="1.5" fill="none"/>
                <polygon points="60,30 84,45 84,75 60,90 36,75 36,45" className="hex-inner" strokeWidth="1" fill="none"/>
                <circle cx="60" cy="60" r="18" className="core-glow"/>
                <circle cx="60" cy="60" r="10" className="core-center"/>
                <line x1="60" y1="5" x2="60" y2="15" className="radial-line"/>
                <line x1="60" y1="105" x2="60" y2="115" className="radial-line"/>
                <line x1="5" y1="60" x2="15" y2="60" className="radial-line"/>
                <line x1="105" y1="60" x2="115" y2="60" className="radial-line"/>
                <line x1="15" y1="15" x2="23" y2="23" className="radial-line"/>
                <line x1="97" y1="97" x2="105" y2="105" className="radial-line"/>
                <line x1="97" y1="15" x2="105" y2="23" className="radial-line-alt"/>
                <line x1="15" y1="97" x2="23" y2="105" className="radial-line-alt"/>
              </svg>
            </div>
            <div className={`status-indicator${statusOnline ? ' online' : ''}`}>
              <span className="status-dot"></span>
              <span className="status-text">{statusOnline ? 'ONLINE' : 'OFFLINE'}</span>
            </div>
            <p className="hero-subtitle">Click the core to enter {isDark ? 'standby' : 'fueled'} mode</p>
          </div>
        </section>

        {/* Right: Dashboard Panels */}
        <section className="dashboard-panels">
          {/* Source Cards Grid */}
          <div className="source-grid">
            {sources.map((source, i) => (
              <div key={i} className={`source-card${sourceStates[i] ? ' online' : ''}`}>
                <div className="source-header">
                  <div className="source-status-dot"></div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={sourceStates[i]}
                      onChange={() => toggleSource(i)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="source-name">{source.name}</div>
                <div className="source-label">{source.label}</div>
              </div>
            ))}
          </div>

          {/* Leaderboard */}
          <div className="leaderboard-card">
            <div className="panel-header">
              <h3>Leaderboard</h3>
              <span className="panel-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: '14px', height: '14px', verticalAlign: 'middle', marginRight: '4px' }}>
                  <path d="M8 21h8m-4-4v4M6 4h12l-1 7a5 5 0 01-10 0L6 4zM4 4h2M18 4h2M5 8H3M19 8h2"/>
                </svg>
                Top Performers
              </span>
            </div>
            <div className="leaderboard-grid">
              {leaderboard.map(agent => (
                <div key={agent.rank} className={`leaderboard-item${agent.rank === 1 ? ' rank-1' : ''}`}>
                  <span className="rank-badge">#{agent.rank}</span>
                  <div className="agent-avatar"><img src={`https://i.pravatar.cc/36?img=${agent.img}`} alt={agent.name.split(' ').map(n => n[0]).join('')} /></div>
                  <div className="agent-info"><span className="agent-name">{agent.name}</span><span className="agent-stats">{agent.stats}</span></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Settings Page */}
      {showSettings && (
        <section className="settings-page" style={{ display: 'flex' }}>
          <div className="settings-card">
            <div className="settings-header">
              <button className="back-button" onClick={() => setShowSettings(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                Back to Dashboard
              </button>
              <h1>Settings</h1>
              <p>Manage your account preferences</p>
            </div>
            <div className="settings-tabs">
              {[
                { id: 'profile', icon: <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></> },
                { id: 'sources', icon: <path d="M22 12h-4l-3 9L9 3l-3 9H2"/> },
                { id: 'licenses', icon: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></> },
                { id: 'billing', icon: <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/> },
                { id: 'notifications', icon: <><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></> },
              ].map(tab => (
                <button
                  key={tab.id}
                  className={`settings-tab${activeTab === tab.id ? ' active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="tab-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{tab.icon}</svg></span>
                  <span className="tab-label">{tab.id.charAt(0).toUpperCase() + tab.id.slice(1)}</span>
                </button>
              ))}
            </div>

            {/* Profile Tab */}
            <div className="settings-tab-panel" style={{ display: activeTab === 'profile' ? '' : 'none' }}>
              <h2>Profile Information</h2>
              <div className="profile-info">
                <div className="info-row"><label>Full Name</label><span>Michael Gustin</span></div>
                <div className="info-row"><label>Email</label><span>michael@ringfuel.com</span></div>
                <div className="info-row"><label>Balance</label><span className="balance-value">$125.00</span></div>
                <div className="info-row"><label>Status</label><span className="status-badge online">ONLINE</span></div>
              </div>
              <button className="danger-button">Sign Out</button>
            </div>

            {/* Sources Tab */}
            <div className="settings-tab-panel" style={{ display: activeTab === 'sources' ? '' : 'none' }}>
              <h2>Lead Sources</h2>
              <p className="tab-description">Manage your active lead sources.</p>
              <div className="source-rows">
                {sources.map((source, i) => (
                  <div key={i} className="source-row">
                    <div className={`source-row-dot${sourceStates[i] ? ' online' : ''}`}></div>
                    <div className="source-row-info">
                      <span className="source-row-name">{source.name}</span>
                      <span className="source-row-label">{source.label}</span>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" checked={sourceStates[i]} onChange={() => toggleSource(i)} />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                ))}
              </div>
              <div className="settings-actions"><button className="save-button">Save Changes</button></div>
            </div>

            {/* Licenses Tab */}
            <div className="settings-tab-panel" style={{ display: activeTab === 'licenses' ? '' : 'none' }}>
              <h2>State Licenses</h2>
              <p className="tab-description">Select the states where you are licensed to operate.</p>
              <div className="license-selector">
                <div className="license-header">
                  <input
                    type="text"
                    className="license-search"
                    placeholder="Search states..."
                    value={stateSearch}
                    onChange={(e) => setStateSearch(e.target.value)}
                  />
                  <div className="license-actions-bar">
                    <button className="license-action-btn" onClick={selectAllStates}>Select All</button>
                    <button className="license-action-btn" onClick={clearAllStates}>Clear</button>
                  </div>
                </div>
                <div className="license-count"><span>{selectedStates.size}</span> states selected</div>
                <div className="state-grid">
                  {filteredStates.map(state => (
                    <div
                      key={state}
                      className={`state-chip${selectedStates.has(state) ? ' selected' : ''}`}
                      onClick={() => toggleState(state)}
                    >
                      {state}
                    </div>
                  ))}
                </div>
              </div>
              <div className="settings-actions"><button className="save-button">Save Changes</button></div>
            </div>

            {/* Billing Tab */}
            <div className="settings-tab-panel" style={{ display: activeTab === 'billing' ? '' : 'none' }}>
              <h2>Billing</h2>
              <div className="billing-container">
                <div className="billing-balance">
                  <span className="billing-balance-label">Current Balance</span>
                  <span className="billing-balance-value">$125.00</span>
                </div>
                <div className="billing-section">
                  <h3>Quick Top-Up</h3>
                  <div className="billing-presets">
                    {billingPresets.map((preset, i) => (
                      <button
                        key={i}
                        className={`billing-preset${activeBillingPreset === i ? ' active' : ''}`}
                        onClick={() => { setActiveBillingPreset(i); setPayAmount(preset); }}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="billing-section">
                  <h3>Custom Amount</h3>
                  <div className="billing-custom-input">
                    <span className="billing-currency">$</span>
                    <input type="number" placeholder="0.00" step="0.01" min={1} />
                  </div>
                </div>
                <div className="billing-section">
                  <h3>Payment Method</h3>
                  <div className="billing-saved-card active">
                    <input type="radio" name="card" defaultChecked />
                    <span className="card-brand">VISA</span>
                    <span className="card-dots">&#8226;&#8226;&#8226;&#8226;</span>
                    <span className="card-last4">4242</span>
                    <span className="card-exp">12/27</span>
                  </div>
                </div>
                <button className="billing-pay-button">Pay {payAmount}.00</button>
                <div className="billing-stripe-badge">Secured by <strong>Stripe</strong></div>
              </div>
            </div>

            {/* Notifications Tab */}
            <div className="settings-tab-panel" style={{ display: activeTab === 'notifications' ? '' : 'none' }}>
              <div className="coming-soon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
                <span>Coming Soon</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Incoming Call Modal */}
      <div className={`call-modal${showCallModal ? ' active' : ''}`}>
        <div className="call-modal-content">
          <div className="call-animation">
            <div className="call-ring"></div>
            <div className="call-ring"></div>
            <div className="call-ring"></div>
            <div className="call-icon-container">
              <svg className="call-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
            </div>
          </div>
          <div className="call-info">
            <span className="call-label">INCOMING CALL</span>
            <span className="call-location">California, USA</span>
          </div>
          <div className="call-actions">
            <button className="call-btn accept" onClick={() => setShowCallModal(false)}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              Accept Call
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
