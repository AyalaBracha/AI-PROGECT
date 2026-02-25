import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product, SelectedProduct } from '../Model/Product';

@Injectable({
  providedIn: 'root'
})
export class ProductSelectionService {
  // שימוש ב-Map עם string key במקום number
  private selectedProducts: Map<string, SelectedProduct> = new Map();
  private selectedProductsSubject = new BehaviorSubject<SelectedProduct[]>([]);

  constructor() {
    console.log('✅ ProductSelectionService initialized');
    this.loadFromStorage(); // טעינה מ-localStorage
  }

  /**
   * יצירת מפתח ייחודי למוצר
   */
  private getProductKey(product: Product): string {
    return `${product.categoryId}-${product.id}`;
  }

  /**
   * קבלת כל המוצרים שנבחרו
   */
  getSelections(): SelectedProduct[] {
    return Array.from(this.selectedProducts.values());
  }

  /**
   * Observable למוצרים שנבחרו
   */
  getSelections$(): Observable<SelectedProduct[]> {
    return this.selectedProductsSubject.asObservable();
  }

  /**
   * הוספה/עדכון של מוצר
   */
  addProduct(product: Product, quantity: number): void {
    const key = this.getProductKey(product);
    console.log(`➕ מוסיף/מעדכן מוצר: ${product.name} (Key: ${key}), כמות: ${quantity}`);
    
    this.selectedProducts.set(key, { 
      product: { ...product }, // יצירת עותק של המוצר
      quantity 
    });
    
    this.saveToStorage();
    this.updateSubject();
  }

  /**
   * הסרת מוצר
   */
  removeProduct(productId: number): void {
    // חיפוש המוצר לפי ID בלבד
    let foundKey: string | null = null;
    
    for (const [key, selected] of this.selectedProducts.entries()) {
      if (selected.product.id === productId) {
        foundKey = key;
        break;
      }
    }
    
    if (foundKey) {
      const product = this.selectedProducts.get(foundKey);
      console.log(`❌ מסיר מוצר: ${product?.product.name} (Key: ${foundKey})`);
      this.selectedProducts.delete(foundKey);
      this.saveToStorage();
      this.updateSubject();
    }
  }

  /**
   * ניקוי כל המוצרים
   */
  clearAll(): void {
    console.log('🗑️ מנקה את כל המוצרים שנבחרו');
    this.selectedProducts.clear();
    this.saveToStorage();
    this.updateSubject();
  }

  /**
   * מספר המוצרים הייחודיים שנבחרו
   */
  getTotalItems(): number {
    return this.selectedProducts.size;
  }

  /**
   * סך כמות כל המוצרים
   */
  getTotalQuantity(): number {
    let total = 0;
    this.selectedProducts.forEach(sp => {
      total += sp.quantity;
    });
    return total;
  }

  /**
   * בדיקה אם מוצר נבחר
   */
  isProductSelected(productId: number): boolean {
    for (const selected of this.selectedProducts.values()) {
      if (selected.product.id === productId) {
        return true;
      }
    }
    return false;
  }

  /**
   * קבלת כמות של מוצר ספציפי
   */
  getProductQuantity(productId: number): number {
    for (const selected of this.selectedProducts.values()) {
      if (selected.product.id === productId) {
        return selected.quantity;
      }
    }
    return 0;
  }

  /**
   * המרה לפורמט של RecipeRequestDto (רשימת שמות מוצרים)
   */
  getIngredientsForRecipe(): string[] {
    const ingredients: string[] = [];
    
    this.selectedProducts.forEach(sp => {
      if (sp.quantity > 1) {
        ingredients.push(`${sp.product.name} (${sp.quantity})`);
      } else {
        ingredients.push(sp.product.name);
      }
    });
    
    console.log('📝 מצרכים למתכון:', ingredients);
    return ingredients;
  }

  /**
   * שמירה ב-localStorage
   */
  private saveToStorage(): void {
    try {
      const data = Array.from(this.selectedProducts.entries());
      localStorage.setItem('selectedProducts', JSON.stringify(data));
      console.log('💾 נשמר ב-localStorage:', data.length, 'מוצרים');
    } catch (error) {
      console.error('❌ שגיאה בשמירה ל-localStorage:', error);
    }
  }

  /**
   * טעינה מ-localStorage
   */
  private loadFromStorage(): void {
    try {
      const saved = localStorage.getItem('selectedProducts');
      if (saved) {
        const data = JSON.parse(saved) as [string, SelectedProduct][];
        this.selectedProducts = new Map(data);
        this.updateSubject();
        console.log('📂 נטען מ-localStorage:', this.selectedProducts.size, 'מוצרים');
      }
    } catch (error) {
      console.error('❌ שגיאה בטעינה מ-localStorage:', error);
    }
  }

  /**
   * עדכון ה-Subject
   */
  private updateSubject(): void {
    const selections = this.getSelections();
    this.selectedProductsSubject.next(selections);
    console.log(`📊 סך המוצרים: ${this.getTotalItems()}, סך הכמות: ${this.getTotalQuantity()}`);
    console.log('🗂️ מוצרים נוכחיים:', selections.map(s => s.product.name));
  }
}