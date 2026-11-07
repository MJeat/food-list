import React, { useState } from 'react';
import { PlusCircle, Edit3, Trash2, Heart, Download, Upload, RotateCcw, Check, AlertCircle, Image as ImageIcon, X } from 'lucide-react';
import { FoodItem, FoodCategory, MealType, Difficulty, SpiceLevel, CATEGORIES, MEAL_TYPE_CONFIG } from '../types/food';
import { addFoodItem, updateFoodItem, deleteFoodItem, resetToDefaults, exportFoodsToJSON, importFoodsFromJSON, getStoredFoods } from '../utils/storage';

interface AdminPanelProps {
  foods: FoodItem[];
  onFoodsChanged: (newFoods: FoodItem[]) => void;
  onDone: () => void;
}

// Preset appetizing images user/mom can select in 1 click
const PRESET_IMAGES: { label: string; url: string }[] = [
  { label: '🍲 Soup / Somlor', url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80' },
  { label: '🥘 Yellow Curry', url: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=800&q=80' },
  { label: '🍳 Wok Stir-Fry / Cha', url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80' },
  { label: '🥩 Beef Lok Lak', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80' },
  { label: '🍢 Grilled Skewers / Ang', url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80' },
  { label: '🐟 Fried Fish / Chien', url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80' },
  { label: '🍜 Kuyteav / Noodles', url: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=800&q=80' },
  { label: '🍚 Rice / Congee', url: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=800&q=80' },
  { label: '🥖 Baguette / Snack', url: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=800&q=80' },
  { label: '🍮 Sweet Dessert', url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80' },
];

const COMMON_KHMER_INGREDIENTS = [
  'Yellow Kroeung', 'Green Kroeung', 'Prahok', 'Lemongrass', 'Kaffir lime leaves',
  'Galangal', 'Tamarind', 'Palm sugar', 'Fish sauce', 'Pork belly', 'Pork ribs',
  'Catfish', 'Water spinach', 'Green papaya', 'Bitter gourd leaves', 'Crushed peanuts',
  'Holy basil', 'Kampot black pepper', 'Garlic', 'Coconut milk', 'Rice noodles'
];

export const AdminPanel: React.FC<AdminPanelProps> = ({
  foods,
  onFoodsChanged,
  onDone,
}) => {
  const [activeTab, setActiveTab] = useState<'form' | 'list' | 'backup'>('form');
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);

  // Form states
  const [englishName, setEnglishName] = useState('');
  const [khmerName, setKhmerName] = useState('');
  const [category, setCategory] = useState<FoodCategory>('somlor');
  const [mealTypes, setMealTypes] = useState<MealType[]>(['lunch', 'dinner']);
  const [description, setDescription] = useState('');
  const [keyIngredientsInput, setKeyIngredientsInput] = useState('');
  const [ingredientsList, setIngredientsList] = useState<string[]>([]);
  const [cookingTime, setCookingTime] = useState('30 mins');
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [spiceLevel, setSpiceLevel] = useState<SpiceLevel>('Mild');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES[0].url);
  const [isMomFavorite, setIsMomFavorite] = useState(true);
  const [notes, setNotes] = useState('');

  // Status message
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Pre-fill form when editing
  const startEditing = (food: FoodItem) => {
    setEditingItem(food);
    setEnglishName(food.englishName);
    setKhmerName(food.khmerName);
    setCategory(food.category);
    setMealTypes(food.mealTypes);
    setDescription(food.description);
    setIngredientsList(food.keyIngredients);
    setKeyIngredientsInput('');
    setCookingTime(food.cookingTime);
    setDifficulty(food.difficulty);
    setSpiceLevel(food.spiceLevel);
    setImageUrl(food.imageUrl);
    setIsMomFavorite(!!food.isMomFavorite);
    setNotes(food.notes || '');
    setActiveTab('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingItem(null);
    setEnglishName('');
    setKhmerName('');
    setCategory('somlor');
    setMealTypes(['lunch', 'dinner']);
    setDescription('');
    setIngredientsList([]);
    setKeyIngredientsInput('');
    setCookingTime('30 mins');
    setDifficulty('Easy');
    setSpiceLevel('Mild');
    setImageUrl(PRESET_IMAGES[0].url);
    setIsMomFavorite(true);
    setNotes('');
  };

  const handleMealTypeToggle = (meal: MealType) => {
    if (mealTypes.includes(meal)) {
      if (mealTypes.length === 1) return; // keep at least 1
      setMealTypes(mealTypes.filter(m => m !== meal));
    } else {
      setMealTypes([...mealTypes, meal]);
    }
  };

  const handleAddIngredient = (ing: string) => {
    const trimmed = ing.trim();
    if (trimmed && !ingredientsList.includes(trimmed)) {
      setIngredientsList([...ingredientsList, trimmed]);
      setKeyIngredientsInput('');
    }
  };

  const handleRemoveIngredient = (ing: string) => {
    setIngredientsList(ingredientsList.filter(item => item !== ing));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!englishName.trim()) {
      setStatusMsg({ type: 'error', text: 'Please enter a food name in English.' });
      return;
    }

    const finalIngredients = [...ingredientsList];
    if (keyIngredientsInput.trim()) {
      keyIngredientsInput.split(',').forEach(item => {
        const val = item.trim();
        if (val && !finalIngredients.includes(val)) {
          finalIngredients.push(val);
        }
      });
    }

    if (finalIngredients.length === 0) {
      finalIngredients.push('Fresh Khmer Herbs', 'Garlic', 'Palm Sugar');
    }

    if (editingItem) {
      // Update
      const updated: FoodItem = {
        ...editingItem,
        englishName: englishName.trim(),
        khmerName: khmerName.trim() || englishName.trim(),
        category,
        mealTypes,
        description: description.trim() || `Delicious Khmer ${category} dish.`,
        keyIngredients: finalIngredients,
        flavorProfile: ['Authentic Khmer', 'Aromatic'],
        cookingTime,
        difficulty,
        spiceLevel,
        imageUrl: imageUrl.trim() || PRESET_IMAGES[0].url,
        isMomFavorite,
        notes: notes.trim(),
      };
      updateFoodItem(updated);
      const nextFoods = foods.map(f => (f.id === updated.id ? updated : f));
      onFoodsChanged(nextFoods);
      setStatusMsg({ type: 'success', text: `Updated "${updated.englishName}" successfully!` });
      resetForm();
    } else {
      // Create new
      const newItem = addFoodItem({
        englishName: englishName.trim(),
        khmerName: khmerName.trim() || englishName.trim(),
        category,
        mealTypes,
        description: description.trim() || `Delicious homemade Khmer ${category} dish.`,
        keyIngredients: finalIngredients,
        flavorProfile: ['Authentic Khmer', 'Aromatic'],
        cookingTime,
        difficulty,
        spiceLevel,
        imageUrl: imageUrl.trim() || PRESET_IMAGES[0].url,
        isMomFavorite,
        notes: notes.trim(),
      });
      onFoodsChanged([newItem, ...foods]);
      setStatusMsg({ type: 'success', text: `Added "${newItem.englishName}" into ${category.toUpperCase()}!` });
      resetForm();
    }

    setTimeout(() => setStatusMsg(null), 4000);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove "${name}" from the food list?`)) {
      deleteFoodItem(id);
      const next = foods.filter(f => f.id !== id);
      onFoodsChanged(next);
      setStatusMsg({ type: 'success', text: `Removed "${name}" from food database.` });
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  const handleExport = () => {
    const jsonStr = exportFoodsToJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `khmer-food-list-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importFoodsFromJSON(content);
      if (res.success) {
        setStatusMsg({ type: 'success', text: `Successfully loaded ${res.count} dishes from backup!` });
        onFoodsChanged(getStoredFoods());
      } else {
        setStatusMsg({ type: 'error', text: res.error || 'Failed to import backup.' });
      }
      setTimeout(() => setStatusMsg(null), 5000);
    };
    reader.readAsText(file);
  };

  const handleResetToDefault = () => {
    if (window.confirm('Reset all foods back to original authentic Khmer 29-dish database?')) {
      const resetList = resetToDefaults();
      onFoodsChanged(resetList);
      setStatusMsg({ type: 'success', text: 'Reset to default Khmer food collection!' });
      setTimeout(() => setStatusMsg(null), 3000);
    }
  };

  return (
    <div className="py-6 sm:py-10 max-w-5xl mx-auto px-4 sm:px-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Khmer Food Admin Panel
          </h1>
          <p className="mt-1 text-sm sm:text-base text-stone-600 font-medium">
            Add new recipes, classify into Somlor, Cha, etc., and customize Mom&rsquo;s meal list
          </p>
        </div>

        <button
          onClick={onDone}
          className="self-start sm:self-auto px-5 py-2.5 rounded-2xl font-bold text-sm bg-amber-600 text-white hover:bg-amber-700 shadow-md transition-colors"
        >
          ← Return to Spinner
        </button>
      </div>

      {/* Admin Tabs */}
      <div className="flex border-b border-stone-200 mb-6 gap-2">
        <button
          onClick={() => setActiveTab('form')}
          className={`py-3 px-5 font-bold text-sm sm:text-base border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'form'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>{editingItem ? 'Edit Dish' : 'Add New Khmer Food'}</span>
        </button>

        <button
          onClick={() => setActiveTab('list')}
          className={`py-3 px-5 font-bold text-sm sm:text-base border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'list'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>Manage Foods ({foods.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('backup')}
          className={`py-3 px-5 font-bold text-sm sm:text-base border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'backup'
              ? 'border-amber-600 text-amber-700'
              : 'border-transparent text-stone-600 hover:text-stone-900'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>Backup & Reset</span>
        </button>
      </div>

      {/* Notification Toast */}
      {statusMsg && (
        <div
          className={`mb-6 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold border shadow-sm ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
              : 'bg-red-50 text-red-900 border-red-300'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <Check className="w-5 h-5 text-emerald-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* TAB 1: ADD / EDIT FOOD FORM */}
      {activeTab === 'form' && (
        <form onSubmit={handleSubmit} className="bg-[#fffdfa] rounded-3xl p-6 sm:p-8 border border-amber-200/90 shadow-warm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-amber-100">
            <h2 className="text-xl sm:text-2xl font-black text-stone-900">
              {editingItem ? `Edit: ${editingItem.englishName}` : 'Add New Khmer Dish'}
            </h2>
            {editingItem && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs font-bold text-stone-500 hover:text-stone-800 underline"
              >
                Cancel Edit (Switch to New)
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* English Name */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-1.5">
                Food Name in English <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={englishName}
                onChange={(e) => setEnglishName(e.target.value)}
                placeholder="e.g. Somlor Machu Kroeung (Sour Lemongrass Soup)"
                className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 text-stone-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
              />
            </div>

            {/* Khmer Name / Transliteration */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-1.5">
                Khmer Script & Pronunciation
              </label>
              <input
                type="text"
                value={khmerName}
                onChange={(e) => setKhmerName(e.target.value)}
                placeholder="e.g. សម្លម្ជូរគ្រឿង • Samlor Machu Kroeung"
                className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 text-stone-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
              />
            </div>

            {/* Category Select (Somlor, Cha, etc.) */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-1.5">
                Khmer Category <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as FoodCategory)}
                className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 text-stone-900 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.emoji} {cat.name} ({cat.khmerTitle})
                  </option>
                ))}
              </select>
            </div>

            {/* Meal Times Selection (Breakfast, Lunch, Dinner, Snack) */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-1.5">
                Suitable Meal Times (Check all that apply) <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2 pt-1">
                {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((meal) => {
                  const cfg = MEAL_TYPE_CONFIG[meal];
                  const isChecked = mealTypes.includes(meal);
                  return (
                    <button
                      key={meal}
                      type="button"
                      onClick={() => handleMealTypeToggle(meal)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-colors ${
                        isChecked
                          ? 'bg-amber-100 border-amber-500 text-amber-900'
                          : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <span className="text-base">{cfg.icon}</span>
                      <span>{cfg.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-1.5">
              Appetizing English Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe flavors, textures, and why Mom loves it..."
              className="w-full px-4 py-3 rounded-xl bg-white border border-stone-200 text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
            />
          </div>

          {/* Key Ingredients */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-1.5">
              Key Ingredients (Click popular ingredients or type custom):
            </label>
            
            {/* Clickable Quick Khmer Ingredients Chips */}
            <div className="flex flex-wrap gap-1.5 mb-2.5 max-h-24 overflow-y-auto p-2 bg-stone-50 rounded-xl border border-stone-200">
              {COMMON_KHMER_INGREDIENTS.map((ing) => (
                <button
                  key={ing}
                  type="button"
                  onClick={() => handleAddIngredient(ing)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                    ingredientsList.includes(ing)
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-white text-stone-700 border border-stone-200 hover:border-amber-400'
                  }`}
                >
                  + {ing}
                </button>
              ))}
            </div>

            {/* Custom input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={keyIngredientsInput}
                onChange={(e) => setKeyIngredientsInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddIngredient(keyIngredientsInput);
                  }
                }}
                placeholder="Or type ingredient and press Add..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="button"
                onClick={() => handleAddIngredient(keyIngredientsInput)}
                className="px-4 py-2.5 rounded-xl font-bold text-xs bg-stone-800 text-white hover:bg-stone-900"
              >
                Add Tag
              </button>
            </div>

            {/* Current Added Ingredients Chips */}
            {ingredientsList.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {ingredientsList.map((ing) => (
                  <span
                    key={ing}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300"
                  >
                    <span>{ing}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(ing)}
                      className="hover:text-red-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Quick Metrics: Cooking Time, Difficulty, Spice Level */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-1.5">
                Cooking Time
              </label>
              <input
                type="text"
                value={cookingTime}
                onChange={(e) => setCookingTime(e.target.value)}
                placeholder="e.g. 35 mins"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-stone-200 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-1.5">
                Skill Level
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-stone-200 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Special / Weekend">Special / Weekend</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-1.5">
                Spice Level
              </label>
              <select
                value={spiceLevel}
                onChange={(e) => setSpiceLevel(e.target.value as SpiceLevel)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-stone-200 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="Not Spicy">Not Spicy</option>
                <option value="Mild">Mild</option>
                <option value="Medium">Medium</option>
                <option value="Spicy">Spicy</option>
              </select>
            </div>
          </div>

          {/* Image URL & Quick Preset Selector */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-1.5">
              Dish Image URL (Or click a preset photo)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-stone-200 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Preset Images */}
            <div className="flex flex-wrap gap-2 pt-1">
              {PRESET_IMAGES.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImageUrl(preset.url)}
                  className={`text-xs px-2.5 py-1 rounded-lg border font-semibold ${
                    imageUrl === preset.url
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-white'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mom's Favorite Toggle & Notes */}
          <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-3">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isMomFavorite}
                onChange={(e) => setIsMomFavorite(e.target.checked)}
                className="w-5 h-5 rounded text-red-600 focus:ring-red-400 border-stone-300"
              />
              <Heart className={`w-5 h-5 ${isMomFavorite ? 'fill-red-500 text-red-500' : 'text-stone-400'}`} />
              <span className="font-extrabold text-stone-900 text-sm sm:text-base">
                Mark as Mom&rsquo;s Favorite Dish ❤️
              </span>
            </label>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-stone-700 mb-1">
                Mom&rsquo;s Special Notes / Serving Tip
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Serve hot with warm French baguette or fresh lime chili dip"
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-stone-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-amber-100 flex items-center justify-end gap-3">
            {editingItem && (
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-3 rounded-xl font-bold text-stone-600 bg-stone-100 hover:bg-stone-200 text-sm"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-8 py-3.5 rounded-2xl font-black text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-md text-base transition-all scale-100 hover:scale-[1.02] active:scale-95"
            >
              {editingItem ? 'Save Dish Changes' : '+ Add Food to Khmer Menu'}
            </button>
          </div>

        </form>
      )}

      {/* TAB 2: MANAGE FOODS LIST */}
      {activeTab === 'list' && (
        <div className="bg-[#fffdfa] rounded-3xl p-6 border border-amber-200/90 shadow-warm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-stone-900">
              Existing Dishes ({foods.length})
            </h2>
            <button
              onClick={() => {
                resetForm();
                setActiveTab('form');
              }}
              className="px-4 py-2 rounded-xl font-bold text-xs sm:text-sm bg-amber-600 text-white hover:bg-amber-700 shadow-sm"
            >
              + Add New Food
            </button>
          </div>

          <div className="divide-y divide-stone-100 max-h-[600px] overflow-y-auto pr-1">
            {foods.map((food) => {
              const cat = CATEGORIES.find(c => c.id === food.category);
              return (
                <div
                  key={food.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-amber-50/40 p-2 rounded-2xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={food.imageUrl}
                      alt={food.englishName}
                      className="w-14 h-14 rounded-xl object-cover border border-stone-200 shadow-sm flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-stone-900 text-base">
                          {food.englishName}
                        </span>
                        {food.isMomFavorite && (
                          <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs font-semibold text-amber-800">
                        {food.khmerName}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                          {cat?.emoji} {cat?.name}
                        </span>
                        <span className="text-[11px] text-stone-400">
                          {food.mealTypes.join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => startEditing(food)}
                      className="p-2 rounded-xl border border-stone-200 text-stone-700 hover:bg-white hover:text-amber-700 transition-colors"
                      title="Edit dish"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(food.id, food.englishName)}
                      className="p-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete dish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: BACKUP, RESTORE & RESET */}
      {activeTab === 'backup' && (
        <div className="bg-[#fffdfa] rounded-3xl p-6 sm:p-8 border border-amber-200/90 shadow-warm space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 mb-2">
              Data Management & Backup
            </h2>
            <p className="text-sm text-stone-600">
              Save your food list to your computer or phone, import saved recipes, or restore the default menu.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            
            {/* Export */}
            <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col justify-between">
              <div>
                <Download className="w-6 h-6 text-amber-700 mb-2" />
                <h3 className="font-extrabold text-stone-900 text-base">Export Backup</h3>
                <p className="text-xs text-stone-600 mt-1">
                  Download all {foods.length} dishes as a JSON file to save mom&rsquo;s custom recipes.
                </p>
              </div>
              <button
                onClick={handleExport}
                className="mt-4 w-full py-2.5 rounded-xl font-bold text-xs bg-amber-600 text-white hover:bg-amber-700 shadow-sm"
              >
                Download JSON
              </button>
            </div>

            {/* Import */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col justify-between">
              <div>
                <Upload className="w-6 h-6 text-stone-700 mb-2" />
                <h3 className="font-extrabold text-stone-900 text-base">Import Backup</h3>
                <p className="text-xs text-stone-600 mt-1">
                  Upload a previously saved JSON file to restore or sync dishes across devices.
                </p>
              </div>
              <label className="mt-4 w-full py-2.5 rounded-xl font-bold text-xs bg-stone-800 text-white hover:bg-stone-900 text-center cursor-pointer block">
                <span>Select JSON File</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </div>

            {/* Reset Defaults */}
            <div className="p-5 rounded-2xl bg-red-50/60 border border-red-200 flex flex-col justify-between">
              <div>
                <RotateCcw className="w-6 h-6 text-red-600 mb-2" />
                <h3 className="font-extrabold text-red-950 text-base">Reset to Default</h3>
                <p className="text-xs text-red-800/80 mt-1">
                  Revert all changes and reload the original 29 traditional Khmer dishes.
                </p>
              </div>
              <button
                onClick={handleResetToDefault}
                className="mt-4 w-full py-2.5 rounded-xl font-bold text-xs bg-red-600 text-white hover:bg-red-700 shadow-sm"
              >
                Reset Database
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
