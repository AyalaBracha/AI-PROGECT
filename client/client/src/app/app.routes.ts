import { Routes } from '@angular/router';
import { CategoriesComponent } from './components/categories.component';
import { ProductsComponent } from './components/products.component';
import { SummaryComponent } from './components/summary.component';
import { AddCategoryComponent } from './components/add-category.component';
import { AddProductComponent } from './components/add-product.component';


export const routes: Routes = [
  // 🏠 דף הבית - קטגוריות
  { 
    path: '', 
    redirectTo: 'categories', 
    pathMatch: 'full' 
  },
  
  // 📁 קטגוריות
  { 
    path: 'categories', 
    component: CategoriesComponent 
  },
  
  // ➕ הוספת קטגוריה
  { 
    path: 'add-category', 
    component: AddCategoryComponent 
  },
  
  // 🛒 מוצרים לפי קטגוריה
  { 
    path: 'products/:id', 
    component: ProductsComponent 
  },
  
  // ➕ הוספת מוצר
  { 
    path: 'add-product', 
    component: AddProductComponent 
  },
  
  // 📋 סיכום ויצירת מתכון - ✅ זה חסר!
  { 
    path: 'summary', 
    component: SummaryComponent 
  },
  
  // 404 - דף לא נמצא
  { 
    path: '**', 
    redirectTo: 'categories' 
  }
];