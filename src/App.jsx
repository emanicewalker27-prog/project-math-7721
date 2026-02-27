import { useState, useMemo } from 'react';
import { Search, Gamepad2, X, Maximize2, ExternalLink, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './data/games.json';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const filteredGames = useMemo(() => {
    return gamesData.filter(game =>
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-slate-900 font-sans selection:bg-indigo-100">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={() => {
                setSelectedGame(null);
                setSearchQuery('');
              }}
            >
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Unblocked<span className="text-indigo-600">Nexus</span>
              </h1>
            </div>

            <div className="hidden sm:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search games..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 border-transparent focus:bg-white focus:ring-2 focus:ring-indigo-500 rounded-xl transition-all outline-none text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-widest hidden md:block">
                {filteredGames.length} Games Available
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Search */}
        <div className="sm:hidden mb-6">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search games..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 focus:ring-2 focus:ring-indigo-500 rounded-xl outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredGames.map((game) => (
              <motion.div
                key={game.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -4 }}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() => setSelectedGame(game)}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <img
                    src={game.thumbnail}
                    alt={game.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/30">
                      <Play className="w-8 h-8 text-white fill-white" />
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 mb-1">{game.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-2">{game.description}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredGames.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No games found</h3>
            <p className="text-slate-500">Try adjusting your search terms</p>
          </div>
        )}
      </main>

      {/* Game Player Modal */}
      <AnimatePresence>
        {selectedGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10"
          >
            <div 
              className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm" 
              onClick={() => setSelectedGame(null)}
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`relative bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col w-full max-w-6xl ${
                isFullScreen ? 'h-full' : 'aspect-video max-h-[85vh]'
              }`}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <Gamepad2 className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900 leading-tight">{selectedGame.title}</h2>
                    <p className="text-xs text-slate-500 hidden sm:block">Playing on Unblocked Nexus</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsFullScreen(!isFullScreen)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
                    title="Toggle Fullscreen"
                  >
                    <Maximize2 className="w-5 h-5" />
                  </button>
                  <a 
                    href={selectedGame.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                  <div className="w-px h-6 bg-slate-200 mx-1" />
                  <button 
                    onClick={() => setSelectedGame(null)}
                    className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors text-slate-500"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Iframe Container */}
              <div className="flex-1 bg-slate-900 relative">
                <iframe
                  src={selectedGame.url}
                  className="w-full h-full border-none"
                  title={selectedGame.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              {/* Modal Footer (Optional details) */}
              {!isFullScreen && (
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                  <p className="text-sm text-slate-600 italic">
                    Tip: Use fullscreen for the best experience.
                  </p>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      HTML5
                    </span>
                    <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      DESKTOP
                    </span>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="bg-slate-900 p-1.5 rounded-lg">
                <Gamepad2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-slate-900">
                Unblocked Nexus
              </span>
            </div>
            
            <div className="flex gap-8 text-sm font-medium text-slate-500">
              <a href="#" className="hover:text-indigo-600 transition-colors">Home</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">About</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Request a Game</a>
              <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
            </div>

            <div className="text-sm text-slate-400">
              &copy; {new Date().getFullYear()} Unblocked Nexus. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
