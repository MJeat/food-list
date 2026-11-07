import React from 'react';
import { Heart, Clock, ChefHat, Sparkles } from 'lucide-react';
import { FoodItem, CATEGORIES, MEAL_TYPE_CONFIG } from '../types/food';

interface FoodCardProps {
  food: FoodItem;
  onSelect: (food: FoodItem) => void;
  onToggleFavorite: (id: string) => void;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  food,
  onSelect,
  onToggleFavorite,
}) => {
  const categoryInfo = CATEGORIES.find(c => c.id === food.category);

  return (
    <div className="group bg-white rounded-3xl border border-stone-200/90 shadow-card hover:shadow-warm hover:border-amber-400 transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Image & Badges */}
      <div className="relative h-48 sm:h-52 overflow-hidden bg-stone-100">
        <img
          src={food.imageUrl}
          alt={food.englishName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-black/20 pointer-events-none" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-extrabold bg-[#fffdfa]/95 backdrop-blur-md text-stone-900 border border-stone-200 shadow-sm">
            <span>{categoryInfo?.emoji || '🍲'}</span>
            <span>{categoryInfo?.khmerTitle || ''} • {food.category.toUpperCase()}</span>
          </span>
        </div>

        {/* Mom's Favorite Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(food.id);
          }}
          title={food.isMomFavorite ? 'Remove from Mom\'s Favorites' : 'Add to Mom\'s Favorites'}
          className={`absolute top-3 right-3 p-2.5 rounded-xl backdrop-blur-md transition-all shadow-md ${
            food.isMomFavorite
              ? 'bg-red-500 text-white hover:bg-red-600 scale-105'
              : 'bg-white/85 text-stone-700 hover:text-red-500 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${food.isMomFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Bottom image overlay: Cooking time & difficulty */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs font-bold">
          <span className="flex items-center gap-1 drop-shadow-md">
            <Clock className="w-3.5 h-3.5" />
            {food.cookingTime}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-stone-900/70 backdrop-blur-sm drop-shadow-md">
            {food.difficulty}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Meal types tags */}
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {food.mealTypes.map(meal => {
              const cfg = MEAL_TYPE_CONFIG[meal];
              return (
                <span
                  key={meal}
                  className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200/70"
                >
                  {cfg?.icon} {cfg?.label}
                </span>
              );
            })}
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelect(food)}
            className="font-extrabold text-lg sm:text-xl text-stone-900 leading-snug group-hover:text-amber-700 transition-colors cursor-pointer"
          >
            {food.englishName}
          </h3>

          {/* Khmer Script / Phonetics */}
          <p className="text-amber-800 font-bold text-sm mt-1">
            {food.khmerName}
          </p>

          {/* Description */}
          <p className="mt-2.5 text-stone-600 text-sm leading-relaxed line-clamp-2">
            {food.description}
          </p>

          {/* Key ingredients chips */}
          <div className="mt-3 flex flex-wrap gap-1">
            {food.keyIngredients.slice(0, 4).map((ing, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-xs font-medium rounded bg-stone-100 text-stone-700"
              >
                {ing}
              </span>
            ))}
            {food.keyIngredients.length > 4 && (
              <span className="px-1.5 py-0.5 text-xs font-semibold text-stone-400">
                +{food.keyIngredients.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Footer info & view button */}
        <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
          <div className="text-xs font-semibold text-stone-500">
            Spice: <span className="text-stone-800 font-bold">{food.spiceLevel}</span>
          </div>

          <button
            onClick={() => onSelect(food)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs sm:text-sm bg-amber-600 text-white hover:bg-amber-700 transition-colors shadow-sm"
          >
            <ChefHat className="w-3.5 h-3.5" />
            <span>Recipe Details</span>
          </button>
        </div>

      </div>

    </div>
  );
};
