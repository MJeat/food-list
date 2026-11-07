import React, { useState } from 'react';
import { X, Heart, Clock, Flame, ChefHat, CheckSquare, Square, Share2, Check } from 'lucide-react';
import { FoodItem, CATEGORIES, MEAL_TYPE_CONFIG } from '../types/food';

interface FoodDetailModalProps {
  food: FoodItem;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
}

export const FoodDetailModal: React.FC<FoodDetailModalProps> = ({
  food,
  onClose,
  onToggleFavorite,
}) => {
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  const categoryInfo = CATEGORIES.find(c => c.id === food.category);

  const toggleIngredient = (ing: string) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [ing]: !prev[ing],
    }));
  };

  const handleCopySummary = () => {
    const text = `🍲 ${food.englishName} (${food.khmerName})\nCategory: ${categoryInfo?.name || food.category}\nMeal Times: ${food.mealTypes.join(', ')}\nIngredients: ${food.keyIngredients.join(', ')}\n\n${food.description}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/65 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="bg-[#fffdfa] rounded-3xl max-w-2xl w-full my-8 shadow-2xl border-2 border-amber-300/80 overflow-hidden relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-stone-900/60 hover:bg-stone-900 text-white backdrop-blur-md transition-colors"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Image Banner */}
        <div className="relative h-60 sm:h-72 w-full bg-stone-100">
          <img
            src={food.imageUrl}
            alt={food.englishName}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/30 to-transparent" />

          {/* Floating Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-xl text-xs sm:text-sm font-extrabold bg-[#fffdfa] text-stone-900 shadow-md">
              {categoryInfo?.emoji} {categoryInfo?.name}
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h2 className="text-2xl sm:text-3xl font-black drop-shadow-md leading-tight">
              {food.englishName}
            </h2>
            <p className="text-amber-300 font-bold text-base sm:text-lg mt-0.5 drop-shadow">
              {food.khmerName}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[calc(85vh-18rem)] overflow-y-auto">
          
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200">
            <div>
              <span className="text-[11px] font-bold text-stone-500 uppercase block">Cooking Time</span>
              <span className="font-extrabold text-stone-900 text-sm flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                {food.cookingTime}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-stone-500 uppercase block">Spice Level</span>
              <span className="font-extrabold text-stone-900 text-sm flex items-center gap-1 mt-0.5">
                <Flame className="w-3.5 h-3.5 text-orange-600" />
                {food.spiceLevel}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-stone-500 uppercase block">Skill Level</span>
              <span className="font-extrabold text-stone-900 text-sm flex items-center gap-1 mt-0.5">
                <ChefHat className="w-3.5 h-3.5 text-amber-700" />
                {food.difficulty}
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-stone-500 uppercase block">Meal Times</span>
              <div className="flex gap-1 mt-0.5">
                {food.mealTypes.map(m => (
                  <span key={m} title={MEAL_TYPE_CONFIG[m]?.label}>
                    {MEAL_TYPE_CONFIG[m]?.icon}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-500 mb-1.5">
              About This Khmer Dish
            </h4>
            <p className="text-stone-800 text-base leading-relaxed font-medium">
              {food.description}
            </p>
          </div>

          {/* Flavor Profile */}
          {food.flavorProfile && food.flavorProfile.length > 0 && (
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-500 mb-2">
                Flavor Profile
              </h4>
              <div className="flex flex-wrap gap-2">
                {food.flavorProfile.map((flavor, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300"
                  >
                    ✨ {flavor}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Key Ingredients Checklist for Mom */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-stone-500">
                Key Ingredients Checklist (Tap to check in kitchen):
              </h4>
              <span className="text-xs text-stone-500 font-semibold">
                {Object.values(checkedIngredients).filter(Boolean).length} / {food.keyIngredients.length} checked
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {food.keyIngredients.map((ingredient, i) => {
                const isChecked = !!checkedIngredients[ingredient];
                return (
                  <div
                    key={i}
                    onClick={() => toggleIngredient(ingredient)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer select-none transition-all ${
                      isChecked
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold line-through opacity-75'
                        : 'bg-white border-stone-200 text-stone-800 hover:border-amber-300 hover:bg-stone-50'
                    }`}
                  >
                    {isChecked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-stone-400 flex-shrink-0" />
                    )}
                    <span className="text-sm">{ingredient}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Special Notes / Mom's Tip */}
          {food.notes && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950">
              <span className="text-xs font-black uppercase tracking-wider text-amber-800 block mb-1">
                💡 Mom&rsquo;s Kitchen Secret & Serving Tip:
              </span>
              <p className="text-sm leading-relaxed font-medium">
                {food.notes}
              </p>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(food.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all border ${
                food.isMomFavorite
                  ? 'bg-red-500 text-white border-red-600 shadow-sm'
                  : 'bg-white border-stone-300 text-stone-700 hover:text-red-600'
              }`}
            >
              <Heart className={`w-4 h-4 ${food.isMomFavorite ? 'fill-current' : ''}`} />
              <span>{food.isMomFavorite ? 'Favorited for Mom' : 'Add to Favorites'}</span>
            </button>

            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-semibold text-sm bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-stone-500" />}
              <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold text-sm bg-amber-600 text-white hover:bg-amber-700 shadow-md transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
