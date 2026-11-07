import { FoodItem } from '../types/food';
import { DEFAULT_FOODS } from '../data/defaultFoods';

const STORAGE_KEY = 'khmer_food_list_items_v1';
const FONT_SIZE_KEY = 'khmer_food_font_size';
const SOUND_KEY = 'khmer_food_sound_enabled';

export function getStoredFoods(): FoodItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveStoredFoods(DEFAULT_FOODS);
      return DEFAULT_FOODS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_FOODS;
  } catch (err) {
    console.error('Error loading foods from localStorage', err);
    return DEFAULT_FOODS;
  }
}

export function saveStoredFoods(foods: FoodItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(foods));
  } catch (err) {
    console.error('Error saving foods to localStorage', err);
  }
}

export function addFoodItem(item: Omit<FoodItem, 'id'>): FoodItem {
  const foods = getStoredFoods();
  const newItem: FoodItem = {
    ...item,
    id: 'food-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    createdAt: new Date().toISOString(),
  };
  const updated = [newItem, ...foods];
  saveStoredFoods(updated);
  return newItem;
}

export function updateFoodItem(updatedItem: FoodItem): void {
  const foods = getStoredFoods();
  const next = foods.map(f => (f.id === updatedItem.id ? updatedItem : f));
  saveStoredFoods(next);
}

export function deleteFoodItem(id: string): void {
  const foods = getStoredFoods();
  const next = foods.filter(f => f.id !== id);
  saveStoredFoods(next);
}

export function toggleFavorite(id: string): FoodItem[] {
  const foods = getStoredFoods();
  const next = foods.map(f => {
    if (f.id === id) {
      return { ...f, isMomFavorite: !f.isMomFavorite };
    }
    return f;
  });
  saveStoredFoods(next);
  return next;
}

export function resetToDefaults(): FoodItem[] {
  saveStoredFoods(DEFAULT_FOODS);
  return DEFAULT_FOODS;
}

export function exportFoodsToJSON(): string {
  const foods = getStoredFoods();
  return JSON.stringify(foods, null, 2);
}

export function importFoodsFromJSON(jsonString: string): { success: boolean; count?: number; error?: string } {
  try {
    const parsed = JSON.parse(jsonString);
    if (!Array.isArray(parsed)) {
      return { success: false, error: 'Uploaded file must be a JSON array of food items.' };
    }
    // Basic validation
    const valid = parsed.every(item => item.englishName && item.category && Array.isArray(item.mealTypes));
    if (!valid) {
      return { success: false, error: 'One or more items are missing required fields (englishName, category, mealTypes).' };
    }
    saveStoredFoods(parsed);
    return { success: true, count: parsed.length };
  } catch (e) {
    return { success: false, error: 'Invalid JSON format: ' + (e instanceof Error ? e.message : 'Unknown error') };
  }
}

export function getFontSizePreference(): 'normal' | 'large' {
  try {
    return (localStorage.getItem(FONT_SIZE_KEY) as 'normal' | 'large') || 'normal';
  } catch {
    return 'normal';
  }
}

export function saveFontSizePreference(size: 'normal' | 'large'): void {
  try {
    localStorage.setItem(FONT_SIZE_KEY, size);
  } catch {
    // ignore
  }
}

export function getSoundPreference(): boolean {
  try {
    const val = localStorage.getItem(SOUND_KEY);
    return val !== null ? val === 'true' : true;
  } catch {
    return true;
  }
}

export function saveSoundPreference(enabled: boolean): void {
  try {
    localStorage.setItem(SOUND_KEY, String(enabled));
  } catch {
    // ignore
  }
}
