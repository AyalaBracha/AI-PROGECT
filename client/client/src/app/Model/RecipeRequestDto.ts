export interface RecipeRequestDto {
  ingredients: string[];   // רשימת המצרכים
  vegetarian: boolean;     // האם המתכון צמחוני
  vegan: boolean;          // האם המתכון טבעוני
  glutenFree: boolean;     // האם המתכון ללא גלוטן
  maxCalories?: number;    // מספר קלוריות מקסימלי (אופציונלי)
  servings?: number;       // מספר מנות (אופציונלי)
}
