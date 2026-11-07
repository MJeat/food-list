import React, { useState, useMemo } from 'react';
import { Search, X, Heart, SlidersHorizontal, ArrowUpDown, Sparkles } from 'lucide-react';
import { FoodItem, FoodCategory, MealType, CATEGORIES, MEAL_TYPE_CONFIG } from '../types/food';
import { FoodCard } from './FoodCard';

interface FoodSearchProps {
  foods: FoodItem[];
  onSelectFood: (food: FoodItem) => void;
  onToggleFavorite: (id: string) => void;
  onOpenAdmin: () => void;
}

export const FoodSearch: React.FC<FoodSearchProps> = ({
  foods,
  onSelectFood,
  onToggleFavorite,
  onOpenAdmin,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | 'all'>('all');
  const [selectedMeal, setSelectedMeal] = useState<MealType | 'all'>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [selectedSpice, setSelectedSpice] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'name' | 'time'>('featured');

  // Filter & sort logic
  const filteredFoods = useMemo(() => {
    return foods
      .filter((item) => {
        // Search term in English name, Khmer name, ingredients, or description
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchName = item.englishName.toLowerCase().includes(q);
          const matchKhmer = item.khmerName.toLowerCase().includes(q);
          const matchDesc = item.description.toLowerCase().includes(q);
          const matchIng = item.keyIngredients.some(ing => ing.toLowerCase().includes(q));
          const matchCategory = item.category.toLowerCase().includes(q);
          if (!matchName && !matchKhmer && !matchDesc && !matchIng && !matchCategory) {
            return false;
          }
        }

        // Category filter (Somlor, Cha, etc.)
        if (selectedCategory !== 'all' && item.category !== selectedCategory) {
          return false;
        }

        // Meal type filter (Breakfast, Lunch, Dinner, Snack)
        if (selectedMeal !== 'all' && !item.mealTypes.includes(selectedMeal)) {
          return false;
        }

        // Mom favorites
        if (onlyFavorites && !item.isMomFavorite) {
          return false;
        }

        // Spice filter
        if (selectedSpice !== 'all' && item.spiceLevel !== selectedSpice) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name') {
          return a.englishName.localeCompare(b.englishName);
        }
        if (sortBy === 'time') {
          const parseTime = (t: string) => parseInt(t, 10) || 0;
          return parseTime(a.cookingTime) - parseTime(b.cookingTime);
        }
        // Default: favorites first, then by id
        if (a.isMomFavorite && !b.isMomFavorite) return -1;
        if (!a.isMomFavorite && b.isMomFavorite) return 1;
        return 0;
      });
  }, [foods, searchTerm, selectedCategory, selectedMeal, onlyFavorites, selectedSpice, sortBy]);

  const resetAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedMeal('all');
    setOnlyFavorites(false);
    setSelectedSpice('all');
    setSortBy('featured');
  };

  const hasActiveFilters =
    searchTerm ||
    selectedCategory !== 'all' ||
    selectedMeal !== 'all' ||
    onlyFavorites ||
    selectedSpice !== 'all' ||
    sortBy !== 'featured';

  return (
    <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header Banner */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Khmer Food Library & Search
          </h1>
          <p className="mt-1 text-base text-stone-600 font-medium">
            Search Somlor, Cha, Ang, Nhoam and morning Kuyteav in English
          </p>
        </div>

        <button
          onClick={onOpenAdmin}
          className="self-start md:self-auto px-4 py-2.5 rounded-xl font-bold text-sm bg-stone-900 text-white hover:bg-stone-800 transition-colors shadow-sm flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>+ Add New Khmer Food</span>
        </button>
      </div>

      {/* Main Search & Control Center */}
      <div className="bg-[#fffdfa] rounded-3xl p-5 border border-amber-200/80 shadow-warm space-y-4 mb-8">
        
        {/* Search Bar Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-700" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search in English: e.g. Somlor, Cha Kroeung, pork ribs, lemongrass, congee..."
            className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-white border border-stone-200 text-stone-900 placeholder-stone-400 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 text-base sm:text-lg transition-all shadow-inner"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Meal Time Pills (Breakfast, Lunch, Dinner, Snack) */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">
            Filter by Meal Time:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedMeal('all')}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all border ${
                selectedMeal === 'all'
                  ? 'bg-stone-800 text-white border-stone-800 shadow-sm'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
            >
              All Meals ({foods.length})
            </button>

            {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((meal) => {
              const cfg = MEAL_TYPE_CONFIG[meal];
              const count = foods.filter(f => f.mealTypes.includes(meal)).length;
              return (
                <button
                  key={meal}
                  onClick={() => setSelectedMeal(selectedMeal === meal ? 'all' : meal)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all border flex items-center gap-1.5 ${
                    selectedMeal === meal
                      ? `${cfg.color} border-transparent shadow-md scale-[1.02]`
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-amber-50/60'
                  }`}
                >
                  <span>{cfg.icon}</span>
                  <span>{cfg.label}</span>
                  <span className="text-xs opacity-80">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Categories Bar (Somlor, Cha, Ang, Nhoam, Kuyteav, Bai, Snack, Dessert) */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block mb-2">
            Filter by Khmer Category:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all border ${
                selectedCategory === 'all'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
            >
              All Categories
            </button>

            {CATEGORIES.map((cat) => {
              const count = foods.filter(f => f.category === cat.id).length;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(isSelected ? 'all' : cat.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all border flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-amber-700 text-white border-amber-700 shadow-sm scale-[1.02]'
                      : 'bg-white text-stone-800 border-stone-200 hover:border-amber-300 hover:bg-amber-50/50'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.name}</span>
                  <span className="text-[11px] opacity-75">({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary Filters Bar (Mom Favorites, Spice Level, Sort, Reset) */}
        <div className="pt-3 border-t border-amber-100 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Mom's Favorites Toggle */}
            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold border transition-colors ${
                onlyFavorites
                  ? 'bg-red-50 text-red-600 border-red-300 shadow-sm'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
              }`}
            >
              <Heart className={`w-4 h-4 ${onlyFavorites ? 'fill-red-500 text-red-500' : 'text-stone-400'}`} />
              <span>Mom&rsquo;s Favorites Only</span>
            </button>

            {/* Spice Filter */}
            <div className="flex items-center gap-1">
              <span className="text-stone-500 font-semibold">Spice:</span>
              <select
                value={selectedSpice}
                onChange={(e) => setSelectedSpice(e.target.value)}
                className="bg-white border border-stone-200 rounded-xl px-2 py-1 text-xs sm:text-sm font-semibold text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="all">Any Spice</option>
                <option value="Not Spicy">Not Spicy</option>
                <option value="Mild">Mild</option>
                <option value="Medium">Medium</option>
                <option value="Spicy">Spicy</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'featured' | 'name' | 'time')}
                className="bg-white border border-stone-200 rounded-xl px-2.5 py-1 text-xs sm:text-sm font-semibold text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="featured">Mom&rsquo;s Top Picks First</option>
                <option value="name">Dish Name (A-Z)</option>
                <option value="time">Cooking Time (Fastest)</option>
              </select>
            </div>

            {/* Reset button */}
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="text-stone-500 hover:text-amber-800 font-bold hover:underline ml-2"
              >
                Reset Filters
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Results Header Count */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-extrabold text-stone-700">
          Showing <span className="text-amber-800">{filteredFoods.length}</span> Khmer{' '}
          {filteredFoods.length === 1 ? 'dish' : 'dishes'}
          {selectedCategory !== 'all' && (
            <span> in &ldquo;{CATEGORIES.find(c => c.id === selectedCategory)?.name}&rdquo;</span>
          )}
          {selectedMeal !== 'all' && (
            <span> for {MEAL_TYPE_CONFIG[selectedMeal]?.label}</span>
          )}
        </p>
      </div>

      {/* Food Cards Grid */}
      {filteredFoods.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFoods.map((food) => (
            <FoodCard
              key={food.id}
              food={food}
              onSelect={onSelectFood}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-[#fffdfa] rounded-3xl border-2 border-dashed border-stone-300 p-12 text-center max-w-lg mx-auto">
          <span className="text-4xl block mb-3">🍲</span>
          <h3 className="text-xl font-extrabold text-stone-900 mb-1">
            No Khmer dishes match your search
          </h3>
          <p className="text-stone-600 text-sm mb-4">
            Try checking for different spelling, clear your filters, or add this dish to your collection!
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={resetAllFilters}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-stone-100 text-stone-800 hover:bg-stone-200"
            >
              Clear All Filters
            </button>
            <button
              onClick={onOpenAdmin}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-amber-600 text-white hover:bg-amber-700"
            >
              + Add This Dish
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
