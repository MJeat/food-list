import React, { useState, useEffect } from 'react';
import { FoodItem, MealType } from './types/food';
import {
  getStoredFoods,
  toggleFavorite,
  getFontSizePreference,
  saveFontSizePreference,
  getSoundPreference,
  saveSoundPreference,
} from './utils/storage';
import { Header } from './components/Header';
import { Spinner } from './components/Spinner';
import { FoodSearch } from './components/FoodSearch';
import { AdminPanel } from './components/AdminPanel';
import { FoodDetailModal } from './components/FoodDetailModal';

export const App: React.FC = () => {
  const [foods, setFoods] = useState<FoodItem[]>(() => getStoredFoods());
  const [activeTab, setActiveTab] = useState<'spinner' | 'search' | 'admin'>('spinner');
  const [activeMealFilter, setActiveMealFilter] = useState<MealType | 'all'>('lunch');
  const [selectedFoodForDetail, setSelectedFoodForDetail] = useState<FoodItem | null>(null);

  // Mom friendly preferences
  const [fontSize, setFontSizeState] = useState<'normal' | 'large'>(() => getFontSizePreference());
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => getSoundPreference());

  // Apply font size class to body
  useEffect(() => {
    if (fontSize === 'large') {
      document.body.classList.add('mom-font-large');
    } else {
      document.body.classList.remove('mom-font-large');
    }
    saveFontSizePreference(fontSize);
  }, [fontSize]);

  const setFontSize = (size: 'normal' | 'large') => {
    setFontSizeState(size);
  };

  const setSoundEnabled = (val: boolean) => {
    setSoundEnabledState(val);
    saveSoundPreference(val);
  };

  const handleToggleFavorite = (id: string) => {
    const updated = toggleFavorite(id);
    setFoods(updated);
    if (selectedFoodForDetail && selectedFoodForDetail.id === id) {
      setSelectedFoodForDetail(prev => (prev ? { ...prev, isMomFavorite: !prev.isMomFavorite } : null));
    }
  };

  const favoritesCount = foods.filter(f => f.isMomFavorite).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfbf7] selection:bg-amber-200 selection:text-amber-900">
      {/* Sticky Header with Mom Friendly Controls */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        fontSize={fontSize}
        setFontSize={setFontSize}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        favoritesCount={favoritesCount}
        totalDishesCount={foods.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'spinner' && (
          <Spinner
            foods={foods}
            soundEnabled={soundEnabled}
            onSelectFood={(food) => setSelectedFoodForDetail(food)}
            onToggleFavorite={handleToggleFavorite}
            activeMealFilter={activeMealFilter}
            setActiveMealFilter={setActiveMealFilter}
          />
        )}

        {activeTab === 'search' && (
          <FoodSearch
            foods={foods}
            onSelectFood={(food) => setSelectedFoodForDetail(food)}
            onToggleFavorite={handleToggleFavorite}
            onOpenAdmin={() => setActiveTab('admin')}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPanel
            foods={foods}
            onFoodsChanged={(newFoods) => setFoods(newFoods)}
            onDone={() => setActiveTab('spinner')}
          />
        )}
      </main>

      {/* Detail Modal */}
      {selectedFoodForDetail && (
        <FoodDetailModal
          food={selectedFoodForDetail}
          onClose={() => setSelectedFoodForDetail(null)}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {/* Friendly Footer */}
      <footer className="mt-12 py-8 bg-[#f7f2ea] border-t border-amber-200/60 text-stone-600 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="font-bold text-stone-800">
              🍲 Khmer Food Finder & Meal Decision Maker
            </p>
            <p className="text-xs text-stone-500 mt-0.5">
              Designed with warm high-contrast colors for Mom & family dinners • Somlor, Cha, Ang, Nhoam & Kuyteav
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('spinner')}
              className="text-stone-700 hover:text-amber-800 transition-colors"
            >
              Meal Spinner
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('search')}
              className="text-stone-700 hover:text-amber-800 transition-colors"
            >
              Browse 29+ Khmer Dishes
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('admin')}
              className="text-stone-700 hover:text-amber-800 transition-colors"
            >
              Admin Panel
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default App;
