export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type FoodCategory =
  | 'somlor'      // Traditional Soups, Stews & Curries (សម្ល)
  | 'cha'         // Stir-fries (ឆា)
  | 'ang-chien'   // Grilled & Fried Dishes (អាំង & ចៀន)
  | 'nhoam'       // Salads & Cured Tartares (ញាំ & ភ្លា)
  | 'kuyteav'     // Soups, Noodles & Kuyteav (គុយទាវ & នំបញ្ចុក)
  | 'bai'         // Rice Plates & Congee (បាយ & បបរ)
  | 'snack'       // Street snacks & Savory Bites (ចំណី & អាហារសម្រន់)
  | 'dessert';    // Desserts & Sweets (បង្អែម)

export type SpiceLevel = 'Not Spicy' | 'Mild' | 'Medium' | 'Spicy';

export type Difficulty = 'Easy' | 'Medium' | 'Special / Weekend';

export interface FoodItem {
  id: string;
  englishName: string;
  khmerName: string; // e.g., "សម្លកកូរ • Samlor Korko"
  category: FoodCategory;
  mealTypes: MealType[];
  description: string;
  keyIngredients: string[];
  flavorProfile: string[]; // e.g. ["Hearty", "Herbal", "Savory"]
  cookingTime: string;    // e.g. "40 mins"
  difficulty: Difficulty;
  spiceLevel: SpiceLevel;
  imageUrl: string;
  isMomFavorite?: boolean;
  notes?: string;
  createdAt?: string;
}

export interface CategoryInfo {
  id: FoodCategory;
  name: string;
  khmerTitle: string;
  emoji: string;
  description: string;
  color: string; // hex or tailwind badge class
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'somlor',
    name: 'Somlor (Soups & Curries)',
    khmerTitle: 'សម្ល',
    emoji: '🍲',
    description: 'Iconic Khmer broths, rich curries, sour soups, and vegetable stews',
    color: 'bg-amber-100 text-amber-900 border-amber-300',
  },
  {
    id: 'cha',
    name: 'Cha (Stir-Fries)',
    khmerTitle: 'ឆា',
    emoji: '🍳',
    description: 'Fragrant wok-tossed meats & vegetables with kroeung lemongrass paste or holy basil',
    color: 'bg-orange-100 text-orange-900 border-orange-300',
  },
  {
    id: 'ang-chien',
    name: 'Ang & Chien (Grilled & Fried)',
    khmerTitle: 'អាំង & ចៀន',
    emoji: '🍢',
    description: 'Charcoal grilled skewers, marinated meats, and crispy fried fish with dipping sauces',
    color: 'bg-red-100 text-red-900 border-red-300',
  },
  {
    id: 'nhoam',
    name: 'Nhoam & Pleah (Salads & Cured)',
    khmerTitle: 'ញាំ & ភ្លា',
    emoji: '🥗',
    description: 'Crisp green mango, pomelo, fresh herb salads, and lime-cured beef',
    color: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  },
  {
    id: 'kuyteav',
    name: 'Kuyteav & Noodles',
    khmerTitle: 'គុយទាវ & នំបញ្ចុក',
    emoji: '🍜',
    description: 'Aromatic Phnom Penh pork bone noodle soup, Nom Banh Chok with fresh fish gravy',
    color: 'bg-teal-100 text-teal-900 border-teal-300',
  },
  {
    id: 'bai',
    name: 'Bai & Rice Meals',
    khmerTitle: 'បាយ & បបរ',
    emoji: '🍚',
    description: 'Classic pork & broken rice, hearty fried rice, and comforting silky chicken congee',
    color: 'bg-yellow-100 text-yellow-900 border-yellow-300',
  },
  {
    id: 'snack',
    name: 'Snacks & Street Food',
    khmerTitle: 'ចំណី & អាហារសម្រន់',
    emoji: '🥖',
    description: 'Crispy scallion coconut pancakes (Num Krok), baguette sandwiches, and afternoon bites',
    color: 'bg-stone-100 text-stone-800 border-stone-300',
  },
  {
    id: 'dessert',
    name: 'Bong-Aem (Desserts & Sweets)',
    khmerTitle: 'បង្អែម',
    emoji: '🍮',
    description: 'Warm banana coconut tapioca, sesame orange rice balls, and pumpkin custards',
    color: 'bg-purple-100 text-purple-900 border-purple-300',
  },
];

export const MEAL_TYPE_CONFIG: Record<MealType, { label: string; icon: string; description: string; color: string }> = {
  breakfast: {
    label: 'Breakfast',
    icon: '🌅',
    description: 'Start your morning with comforting soup, rice, or noodles',
    color: 'bg-amber-500 text-white',
  },
  lunch: {
    label: 'Lunch',
    icon: '☀️',
    description: 'Satisfying midday meals with hot soup, stir-fries, and rice',
    color: 'bg-orange-500 text-white',
  },
  dinner: {
    label: 'Dinner',
    icon: '🌙',
    description: 'Wholesome evening family dinners with soups and shared plates',
    color: 'bg-indigo-600 text-white',
  },
  snack: {
    label: 'Snack Time',
    icon: '🍢',
    description: 'Light treats, street bites, and sweet afternoon refreshers',
    color: 'bg-emerald-600 text-white',
  },
};
