import React from 'react';
import { Volume2, VolumeX, Type, Utensils, Compass, Settings, Heart } from 'lucide-react';

interface HeaderProps {
  activeTab: 'spinner' | 'search' | 'admin';
  setActiveTab: (tab: 'spinner' | 'search' | 'admin') => void;
  fontSize: 'normal' | 'large';
  setFontSize: (size: 'normal' | 'large') => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  favoritesCount: number;
  totalDishesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  fontSize,
  setFontSize,
  soundEnabled,
  setSoundEnabled,
  favoritesCount,
  totalDishesCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#fffdfa]/95 backdrop-blur-md border-b border-amber-200/70 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Mom Friendly Tagline */}
          <div 
            onClick={() => setActiveTab('spinner')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-600 to-amber-700 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200 text-white">
              <span className="text-2xl" role="img" aria-label="Khmer food">🍲</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl text-stone-900 tracking-tight group-hover:text-amber-800 transition-colors">
                  Khmer Food Finder
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  {totalDishesCount} Dishes
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-stone-600">
                Never wonder &ldquo;What to eat?&rdquo; again • English & Khmer
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 bg-stone-100/90 p-1.5 rounded-2xl border border-stone-200/80">
            <button
              onClick={() => setActiveTab('spinner')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                activeTab === 'spinner'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'text-stone-700 hover:text-stone-950 hover:bg-stone-200/60'
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span>Meal Spinner</span>
            </button>

            <button
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                activeTab === 'search'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'text-stone-700 hover:text-stone-950 hover:bg-stone-200/60'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Explore Foods</span>
              {favoritesCount > 0 && (
                <span className={`text-xs px-1.5 py-0.2 rounded-full font-bold ${
                  activeTab === 'search' ? 'bg-amber-800 text-white' : 'bg-red-100 text-red-700'
                }`}>
                  <Heart className="w-2.5 h-2.5 inline mr-0.5 fill-current" />
                  {favoritesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                activeTab === 'admin'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                  : 'text-stone-700 hover:text-stone-950 hover:bg-stone-200/60'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Admin Panel</span>
            </button>
          </nav>

          {/* Quick Accessibility & Comfort Controls for Mom */}
          <div className="flex items-center gap-2">
            {/* Font size toggle for Mom */}
            <button
              onClick={() => setFontSize(fontSize === 'normal' ? 'large' : 'normal')}
              title={fontSize === 'normal' ? 'Switch to Larger Text (Mom Friendly)' : 'Switch to Standard Text'}
              className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-colors ${
                fontSize === 'large'
                  ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-sm'
                  : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Type className="w-4 h-4 text-amber-700" />
              <span className="hidden sm:inline">Text Size:</span>
              <span>{fontSize === 'large' ? 'Large (A+)' : 'Normal'}</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
              className={`p-2.5 rounded-xl border transition-colors ${
                soundEnabled
                  ? 'bg-white border-stone-200 text-stone-700 hover:text-amber-700'
                  : 'bg-stone-100 border-stone-300 text-stone-400'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center justify-around py-2.5 border-t border-amber-100">
          <button
            onClick={() => setActiveTab('spinner')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold ${
              activeTab === 'spinner' ? 'bg-amber-600 text-white' : 'text-stone-700'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Spinner</span>
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold ${
              activeTab === 'search' ? 'bg-amber-600 text-white' : 'text-stone-700'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Search</span>
            {favoritesCount > 0 && (
              <span className="text-xs bg-red-100 text-red-700 px-1.5 rounded-full font-bold">
                {favoritesCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold ${
              activeTab === 'admin' ? 'bg-amber-600 text-white' : 'text-stone-700'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Admin</span>
          </button>
        </div>

      </div>
    </header>
  );
};
