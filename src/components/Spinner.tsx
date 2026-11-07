import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, RotateCw, Filter, Heart, Eye, CheckCircle2, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { FoodItem, MealType, MEAL_TYPE_CONFIG } from '../types/food';
import { playTickSound, playWinChime } from '../utils/audio';

interface SpinnerProps {
  foods: FoodItem[];
  soundEnabled: boolean;
  onSelectFood: (food: FoodItem) => void;
  onToggleFavorite: (id: string) => void;
  activeMealFilter: MealType | 'all';
  setActiveMealFilter: (filter: MealType | 'all') => void;
}

// Warm, rich, appetizing palette that has high visual contrast
const SLICE_COLORS = [
  '#f59e0b', // Amber 500
  '#ea580c', // Orange 600
  '#16a34a', // Green 600
  '#d97706', // Amber 600
  '#0284c7', // Sky 600
  '#dc2626', // Red 600
  '#0d9488', // Teal 600
  '#c2410c', // Orange 700
  '#4f46e5', // Indigo 600
  '#7c3aed', // Purple 600
  '#ca8a04', // Yellow 600
  '#059669', // Emerald 600
];

export const Spinner: React.FC<SpinnerProps> = ({
  foods,
  soundEnabled,
  onSelectFood,
  onToggleFavorite,
  activeMealFilter,
  setActiveMealFilter,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Wheel state
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [selectedWinner, setSelectedWinner] = useState<FoodItem | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [excludedIds, setExcludedIds] = useState<Set<string>>(new Set());
  const [showFilterSettings, setShowFilterSettings] = useState(false);

  // Track ticking sound
  const lastTickIndexRef = useRef<number>(-1);

  // Filter foods based on current meal time & preferences
  const filteredFoods = foods.filter(item => {
    // Meal filter
    if (activeMealFilter !== 'all' && !item.mealTypes.includes(activeMealFilter)) {
      return false;
    }
    // Mom's favorites filter
    if (onlyFavorites && !item.isMomFavorite) {
      return false;
    }
    // Manually excluded
    if (excludedIds.has(item.id)) {
      return false;
    }
    return true;
  });

  // Limit wheel items to at most 16 items for readability on the wheel
  const activeWheelFoods = React.useMemo(() => {
    if (filteredFoods.length <= 16) return filteredFoods;
    // If more than 16, select a representative sample
    return filteredFoods.slice(0, 16);
  }, [filteredFoods]);

  const numSlices = activeWheelFoods.length;
  const sliceAngle = numSlices > 0 ? (2 * Math.PI) / numSlices : 0;

  // Draw wheel on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use device pixel ratio for super-sharp crisp text on retina / high-DPI mom tablets/screens
    const dpr = window.devicePixelRatio || 1;
    const width = 420;
    const height = 420;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(dpr, dpr);

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2 - 16;

    // Clear
    ctx.clearRect(0, 0, width, height);

    if (numSlices === 0) {
      // Empty state on wheel
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fillStyle = '#f5efe6';
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#d97706';
      ctx.stroke();

      ctx.fillStyle = '#78716c';
      ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('No dishes match filter', centerX, centerY - 10);
      ctx.font = '14px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('Select another meal filter above', centerX, centerY + 16);
      return;
    }

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(currentRotation);

    // Draw Outer Shadow / Ring
    ctx.beginPath();
    ctx.arc(0, 0, radius + 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#78350f';
    ctx.fill();

    // Draw slices
    for (let i = 0; i < numSlices; i++) {
      const startAngle = i * sliceAngle;
      const endAngle = startAngle + sliceAngle;
      const color = SLICE_COLORS[i % SLICE_COLORS.length];

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Text on slice
      ctx.save();
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';

      // Truncate name for slice
      const food = activeWheelFoods[i];
      let displayName = food.englishName;
      // Extract short name before parentheses if long
      const parenIdx = displayName.indexOf('(');
      if (parenIdx > 0 && displayName.length > 20) {
        displayName = displayName.substring(0, parenIdx).trim();
      }
      if (displayName.length > 22) {
        displayName = displayName.substring(0, 20) + '...';
      }

      // High-contrast text label with subtle shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 4;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(displayName, radius - 24, 0);

      ctx.restore();
    }

    // Outer decorative studs/pegs
    for (let i = 0; i < numSlices; i++) {
      const angle = i * sliceAngle;
      const pegX = Math.cos(angle) * (radius + 2);
      const pegY = Math.sin(angle) * (radius + 2);

      ctx.beginPath();
      ctx.arc(pegX, pegY, 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#fef3c7';
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#78350f';
      ctx.stroke();
    }

    ctx.restore();

    // Center Hub (Clay Pot Style Gold & Terracotta)
    ctx.beginPath();
    ctx.arc(centerX, centerY, 38, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#c2410c';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, 28, 0, 2 * Math.PI);
    ctx.fillStyle = '#ea580c';
    ctx.fill();

    // Center icon/text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SPIN', centerX, centerY);

  }, [activeWheelFoods, currentRotation, numSlices, sliceAngle]);

  // Handle spin animation
  const handleSpin = () => {
    if (isSpinning || numSlices === 0) return;

    setIsSpinning(true);
    setSelectedWinner(null);

    // Random winner index
    const winningIndex = Math.floor(Math.random() * numSlices);
    const winningFood = activeWheelFoods[winningIndex];

    // Compute target rotation
    // Pointer is located at 0 radians (right side, 3 o'clock)
    // Slices rotate clockwise. Slice i center is at i*sliceAngle + sliceAngle/2
    // We want that center to end up at 0 (or (2*PI - targetCenter))
    const sliceCenter = winningIndex * sliceAngle + sliceAngle / 2;
    // Add jitter within the slice so it doesn't always land at the exact geometric center
    const jitter = (Math.random() - 0.5) * (sliceAngle * 0.7);

    // Number of full spins (between 5 and 8)
    const fullSpins = 5 + Math.floor(Math.random() * 4);
    const targetAngle = fullSpins * 2 * Math.PI + (2 * Math.PI - (sliceCenter + jitter));

    const startRotation = currentRotation % (2 * Math.PI);
    const totalDelta = targetAngle + (2 * Math.PI - startRotation);
    const duration = 4500; // ms
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic / quart
      const easeOut = 1 - Math.pow(1 - progress, 3.5);
      const newRotation = startRotation + totalDelta * easeOut;

      setCurrentRotation(newRotation);

      // Play tick sound when passing slices
      const normalizedAngle = newRotation % (2 * Math.PI);
      const currentSliceIdx = Math.floor(
        ((2 * Math.PI - normalizedAngle) % (2 * Math.PI)) / sliceAngle
      );

      if (currentSliceIdx !== lastTickIndexRef.current) {
        lastTickIndexRef.current = currentSliceIdx;
        playTickSound(soundEnabled);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        setSelectedWinner(winningFood);
        setShowResultModal(true);
        playWinChime(soundEnabled);

        // Confetti celebration!
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ea580c', '#d97706', '#16a34a', '#f59e0b', '#dc2626'],
        });
      }
    };

    requestAnimationFrame(animate);
  };

  const currentMealConfig = activeMealFilter !== 'all' ? MEAL_TYPE_CONFIG[activeMealFilter] : null;

  return (
    <div className="py-6 sm:py-10 max-w-5xl mx-auto px-4">
      {/* Title & Introduction */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100/90 text-amber-900 border border-amber-300 font-semibold text-xs sm:text-sm mb-3">
          <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
          <span>Mom&rsquo;s Friendly Decision Wheel</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight">
          Don&rsquo;t Know What To Eat?
        </h1>
        <p className="mt-2 text-base sm:text-lg text-stone-600 max-w-2xl mx-auto font-medium">
          Pick your meal time below, spin the wheel, and let delicious authentic Khmer food decide!
        </p>
      </div>

      {/* Meal Filters Bar (Breakfast, Lunch, Dinner, Snack, All) */}
      <div className="bg-[#fffdfa] p-3 sm:p-4 rounded-3xl border border-amber-200/80 shadow-warm mb-8">
        <div className="flex items-center justify-between mb-3 px-2">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-amber-700" />
            1. Select Meal Time:
          </span>
          <span className="text-xs font-semibold text-stone-500">
            {activeWheelFoods.length} {activeWheelFoods.length === 1 ? 'dish' : 'dishes'} on wheel
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
          {/* Breakfast */}
          <button
            onClick={() => setActiveMealFilter('breakfast')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-3 px-3 rounded-2xl font-bold text-sm sm:text-base transition-all border ${
              activeMealFilter === 'breakfast'
                ? 'bg-amber-500 text-white border-amber-600 shadow-md scale-[1.02]'
                : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-amber-50/50 hover:border-amber-200'
            }`}
          >
            <span className="text-xl">🌅</span>
            <span>Breakfast</span>
          </button>

          {/* Lunch */}
          <button
            onClick={() => setActiveMealFilter('lunch')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-3 px-3 rounded-2xl font-bold text-sm sm:text-base transition-all border ${
              activeMealFilter === 'lunch'
                ? 'bg-orange-500 text-white border-orange-600 shadow-md scale-[1.02]'
                : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-orange-50/50 hover:border-orange-200'
            }`}
          >
            <span className="text-xl">☀️</span>
            <span>Lunch</span>
          </button>

          {/* Dinner */}
          <button
            onClick={() => setActiveMealFilter('dinner')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-3 px-3 rounded-2xl font-bold text-sm sm:text-base transition-all border ${
              activeMealFilter === 'dinner'
                ? 'bg-indigo-600 text-white border-indigo-700 shadow-md scale-[1.02]'
                : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-indigo-50/50 hover:border-indigo-200'
            }`}
          >
            <span className="text-xl">🌙</span>
            <span>Dinner</span>
          </button>

          {/* Snack */}
          <button
            onClick={() => setActiveMealFilter('snack')}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-3 px-3 rounded-2xl font-bold text-sm sm:text-base transition-all border ${
              activeMealFilter === 'snack'
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-md scale-[1.02]'
                : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-emerald-50/50 hover:border-emerald-200'
            }`}
          >
            <span className="text-xl">🍢</span>
            <span>Snack Time</span>
          </button>

          {/* All */}
          <button
            onClick={() => setActiveMealFilter('all')}
            className={`col-span-2 sm:col-span-1 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-3 px-3 rounded-2xl font-bold text-sm sm:text-base transition-all border ${
              activeMealFilter === 'all'
                ? 'bg-stone-800 text-white border-stone-900 shadow-md scale-[1.02]'
                : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
            }`}
          >
            <span className="text-xl">🌟</span>
            <span>All Dishes</span>
          </button>
        </div>

        {/* Sub-bar options: Mom's favorites toggle + customize list */}
        <div className="mt-3 pt-3 border-t border-amber-100/80 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <label className="flex items-center gap-2 cursor-pointer select-none text-stone-700 font-semibold hover:text-red-700 transition-colors">
            <input
              type="checkbox"
              checked={onlyFavorites}
              onChange={(e) => setOnlyFavorites(e.target.checked)}
              className="w-4 h-4 rounded text-red-600 focus:ring-red-400 border-stone-300"
            />
            <Heart className={`w-4 h-4 ${onlyFavorites ? 'fill-red-500 text-red-500' : 'text-stone-400'}`} />
            <span>Spin only Mom&rsquo;s Favorites</span>
          </label>

          <button
            onClick={() => setShowFilterSettings(!showFilterSettings)}
            className="flex items-center gap-1.5 text-stone-600 hover:text-amber-800 font-medium transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{showFilterSettings ? 'Hide Wheel Dish List' : 'Customize Wheel Dishes'}</span>
          </button>
        </div>

        {/* Collapsible custom dishes selection */}
        {showFilterSettings && (
          <div className="mt-3 p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs sm:text-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-stone-700">Check/Uncheck dishes for this spin:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setExcludedIds(new Set())}
                  className="text-amber-700 hover:underline font-semibold"
                >
                  Select All
                </button>
                <span>•</span>
                <button
                  onClick={() => {
                    const allIds = new Set(filteredFoods.map(f => f.id));
                    setExcludedIds(allIds);
                  }}
                  className="text-stone-500 hover:underline font-semibold"
                >
                  Clear All
                </button>
              </div>
            </div>
            <div className="max-h-40 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1.5 pr-1">
              {foods
                .filter(item => activeMealFilter === 'all' || item.mealTypes.includes(activeMealFilter))
                .map(item => {
                  const isChecked = !excludedIds.has(item.id);
                  return (
                    <label
                      key={item.id}
                      className={`flex items-center gap-2 p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        isChecked ? 'bg-white border-amber-200 text-stone-800' : 'bg-stone-100 border-stone-200 text-stone-400'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          const next = new Set(excludedIds);
                          if (isChecked) {
                            next.add(item.id);
                          } else {
                            next.delete(item.id);
                          }
                          setExcludedIds(next);
                        }}
                        className="rounded text-amber-600 focus:ring-amber-500"
                      />
                      <span className="truncate text-xs font-medium">{item.englishName}</span>
                    </label>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      {/* Main Spinner Arena */}
      <div className="flex flex-col items-center justify-center">
        
        {/* Canvas Wheel Container */}
        <div className="relative p-4 sm:p-6 bg-gradient-to-b from-[#fffcf8] to-[#f9f4ec] rounded-full border-4 border-amber-300/80 shadow-2xl">
          
          {/* Wheel Pointer (Indicator pointing at the 3 o'clock position / right side) */}
          <div 
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 flex items-center drop-shadow-lg"
            style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' }}
          >
            <div className="w-0 h-0 border-y-[14px] border-y-transparent border-r-[26px] border-r-red-600" />
            <div className="w-3.5 h-9 bg-amber-400 rounded-r-md border border-amber-600 -ml-1" />
          </div>

          {/* HTML5 Canvas */}
          <canvas
            ref={canvasRef}
            className="rounded-full cursor-pointer select-none"
            onClick={handleSpin}
          />

          {/* Big Center Click Button Overlay */}
          <button
            onClick={handleSpin}
            disabled={isSpinning || numSlices === 0}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center font-extrabold text-white text-xs sm:text-sm tracking-wide uppercase transition-all duration-200 shadow-xl border-4 border-amber-100 ${
              isSpinning
                ? 'bg-stone-500 scale-95 opacity-80 cursor-wait'
                : numSlices === 0
                ? 'bg-stone-300 cursor-not-allowed opacity-50'
                : 'bg-gradient-to-tr from-amber-600 via-orange-600 to-amber-500 hover:scale-105 active:scale-95 animate-spin-glow'
            }`}
          >
            <RotateCw className={`w-5 h-5 sm:w-6 sm:h-6 mb-0.5 ${isSpinning ? 'animate-spin' : ''}`} />
            <span>{isSpinning ? '...' : 'SPIN'}</span>
          </button>
        </div>

        {/* Action Button Below Wheel */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleSpin}
            disabled={isSpinning || numSlices === 0}
            className={`px-8 py-4 rounded-2xl font-extrabold text-lg sm:text-xl shadow-lg transition-all duration-200 flex items-center gap-3 ${
              isSpinning
                ? 'bg-stone-400 text-stone-200 cursor-wait'
                : numSlices === 0
                ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 text-white hover:shadow-orange-600/30 hover:scale-105 active:scale-95'
            }`}
          >
            <Sparkles className="w-6 h-6 animate-pulse" />
            <span>{isSpinning ? 'Deciding Meal for Mom...' : `Spin for ${currentMealConfig?.label || 'Today\'s Meal'}!`}</span>
          </button>

          {selectedWinner && !isSpinning && (
            <button
              onClick={() => setShowResultModal(true)}
              className="px-5 py-3.5 rounded-2xl font-bold text-stone-800 bg-white border border-amber-300 hover:bg-amber-50 shadow-sm flex items-center gap-2 text-sm sm:text-base"
            >
              <Eye className="w-4 h-4 text-amber-700" />
              <span>View Last Result</span>
            </button>
          )}
        </div>

      </div>

      {/* WINNER RESULT MODAL */}
      {showResultModal && selectedWinner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#fffdfa] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-amber-300 relative overflow-hidden animate-scale-up">
            
            {/* Header badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Winner for {currentMealConfig?.label || 'Today\'s Meal'}!
              </span>

              <button
                onClick={() => onToggleFavorite(selectedWinner.id)}
                className="p-2 rounded-xl hover:bg-stone-100 transition-colors"
                title="Toggle Favorite"
              >
                <Heart
                  className={`w-6 h-6 ${
                    selectedWinner.isMomFavorite
                      ? 'fill-red-500 text-red-500'
                      : 'text-stone-400 hover:text-red-500'
                  }`}
                />
              </button>
            </div>

            {/* Dish Image */}
            <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden mb-4 shadow-md bg-stone-100">
              <img
                src={selectedWinner.imageUrl}
                alt={selectedWinner.englishName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                ⏱️ {selectedWinner.cookingTime} • {selectedWinner.difficulty}
              </div>
            </div>

            {/* Food Title (English & Khmer) */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 leading-snug">
              {selectedWinner.englishName}
            </h2>
            <p className="text-amber-800 font-bold text-base sm:text-lg mt-1">
              {selectedWinner.khmerName}
            </p>

            {/* Description */}
            <p className="mt-3 text-stone-700 text-sm sm:text-base leading-relaxed">
              {selectedWinner.description}
            </p>

            {/* Key Ingredients */}
            <div className="mt-4 pt-3 border-t border-amber-100">
              <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                Main Ingredients:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {selectedWinner.keyIngredients.map((ing, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-stone-100 text-stone-800 border border-stone-200"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 pt-4 border-t border-amber-100 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setShowResultModal(false);
                  onSelectFood(selectedWinner);
                }}
                className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-md flex items-center justify-center gap-2 text-base transition-colors"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Let&rsquo;s Cook / Eat This!</span>
              </button>

              <button
                onClick={() => {
                  setShowResultModal(false);
                  handleSpin();
                }}
                className="py-3 px-4 rounded-xl font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 flex items-center justify-center gap-1.5 text-base transition-colors"
              >
                <RotateCw className="w-4 h-4" />
                <span>Spin Again</span>
              </button>

              <button
                onClick={() => setShowResultModal(false)}
                className="py-3 px-4 rounded-xl font-semibold text-stone-500 hover:text-stone-800 transition-colors"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
