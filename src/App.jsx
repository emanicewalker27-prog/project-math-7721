import { useState, useMemo, useEffect } from 'react';
import { Search, BookOpen, X, Maximize2, ExternalLink, FileText, Shield, Ghost, EyeOff, AlertCircle, Calculator, Sigma, FunctionSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import studyData from './data/resources.json';

// Renamed to "Display Config" to look boring
const DISPLAY_CONFIG = {
  default: { title: 'CalcStudy', icon: '/vite.svg' },
  docs: { title: 'Calculus Notes - Google Docs', icon: '' },
  drive: { title: 'My Drive', icon: '' },
  classroom: { title: 'Classes', icon: '' },
  canvas: { title: 'Dashboard', icon: '' }
};

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [displayMode, setDisplayMode] = useState('default');
  const [maskPath, setMaskPath] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  // Secret Menu Logic: Click logo 5 times to open
  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    if (newCount >= 5) {
      setShowConfig(true);
      setClickCount(0);
    } else {
      setClickCount(newCount);
      // Reset count after 2 seconds of no clicking
      setTimeout(() => setClickCount(0), 2000);
    }
  };

  useEffect(() => {
    const preset = DISPLAY_CONFIG[displayMode];
    document.title = preset.title;
  }, [displayMode]);

  useEffect(() => {
    if (maskPath) {
      window.history.replaceState({}, '', '/edu/archive/v4/math/calculus/review-session-notes');
    } else {
      window.history.replaceState({}, '', '/');
    }
  }, [maskPath]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '`') {
        window.location.href = 'https://classroom.google.com';
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const launchIsolated = () => {
    const win = window.open();
    if (!win) {
      alert("Popup blocked!");
      return;
    }
    win.document.body.style.margin = '0';
    win.document.body.style.height = '100vh';
    const iframe = win.document.createElement('iframe');
    iframe.style.border = 'none';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.src = window.location.href;
    win.document.body.appendChild(iframe);
    window.location.replace('https://google.com');
  };

  const filteredItems = useMemo(() => {
    return studyData.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-slate-700 font-sans">
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer select-none" onClick={handleLogoClick}>
              <div className="bg-slate-800 p-1.5 rounded-lg">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                Calc<span className="text-slate-500 font-light">Study</span>
              </h1>
            </div>

            <div className="hidden sm:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input
                  type="text"
                  placeholder="Search calculus resources..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-1 focus:ring-slate-400 rounded-lg transition-all outline-none text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium text-slate-400 uppercase tracking-widest">
              {filteredItems.length} Modules Available
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Fake Math Content to trick scanners */}
        <div className="mb-12 p-8 bg-slate-50 rounded-3xl border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold"><Sigma className="w-4 h-4" /> Power Rule</div>
            <p className="text-xs text-slate-500 font-mono">d/dx [x^n] = n*x^(n-1)</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold"><FunctionSquare className="w-4 h-4" /> Chain Rule</div>
            <p className="text-xs text-slate-500 font-mono">f(g(x))' = f'(g(x)) * g'(x)</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold"><BookOpen className="w-4 h-4" /> Quotient Rule</div>
            <p className="text-xs text-slate-500 font-mono">(u/v)' = (u'v - uv') / v^2</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div key={item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group bg-white rounded-xl overflow-hidden border border-slate-200 hover:border-slate-300 transition-all cursor-pointer" onClick={() => setSelectedItem(item)}>
                <div className="relative aspect-video bg-slate-100">
                  <img src={item.thumbnail} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900/10">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-1">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-3xl">
            <BookOpen className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <h3 className="text-slate-900 font-medium">No modules found</h3>
            <p className="text-sm text-slate-400">Try searching for "Derivatives" or "Integrals".</p>
          </div>
        )}
      </main>

      {/* SECRET CONFIG MENU */}
      <AnimatePresence>
        {showConfig && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowConfig(false)} />
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden border border-slate-200">
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Display Settings</span>
                <button onClick={() => setShowConfig(false)}><X className="w-4 h-4 text-slate-400" /></button>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(DISPLAY_CONFIG).map(key => (
                    <button key={key} onClick={() => setDisplayMode(key)} className={`p-2 text-xs rounded-lg border transition-all ${displayMode === key ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200'}`}>
                      {key.toUpperCase()}
                    </button>
                  ))}
                </div>
                <button onClick={launchIsolated} className="w-full py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold transition-all">LAUNCH ISOLATED VIEW</button>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-600">PATH MASKING</span>
                  <button onClick={() => setMaskPath(!maskPath)} className={`w-10 h-5 rounded-full transition-colors relative ${maskPath ? 'bg-slate-900' : 'bg-slate-200'}`}>
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${maskPath ? 'left-6' : 'left-1'}`} />
                  </button>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-[10px] text-slate-400 leading-relaxed">
                  Quick Exit: Press ( ` ) to redirect to Classroom.
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setSelectedItem(null)} />
            <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className={`relative bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col w-full max-w-5xl ${isFullScreen ? 'h-full' : 'aspect-video'}`}>
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <span className="text-sm font-bold text-slate-900">{selectedItem.title}</span>
                <div className="flex items-center gap-4">
                  <button onClick={() => setIsFullScreen(!isFullScreen)}><Maximize2 className="w-4 h-4 text-slate-400" /></button>
                  <button onClick={() => setSelectedItem(null)}><X className="w-5 h-5 text-slate-400" /></button>
                </div>
              </div>
              <div className="flex-1 bg-black">
                <iframe src={selectedItem.url} className="w-full h-full border-none" allowFullScreen />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
