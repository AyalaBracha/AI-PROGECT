export interface RecipeDto {
  title: string;                  // שם המתכון
  description?: string;            // תיאור המתכון
  ingredients: string[];          // רשימת המצרכים
  instructions: string[];         // הוראות הכנה
  nutrition: NutritionInfo;       // מידע תזונתי
  notes?: string[];                // הערות למתכון
  imageBase64?: string;           // תמונה ב-Base64 (אופציונלי)
}

export interface NutritionInfo {
  caloriesTotal: string;          // סה"כ קלוריות
  caloriesPerServing: string;     // קלוריות למנה
  proteinPerServing: string;      // חלבון למנה
  carbsPerServing: string;        // פחמימות למנה
  fatPerServing: string;          // שומן למנה
}
