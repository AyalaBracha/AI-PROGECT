import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Category } from '../Model/Category';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  loading = true;
  errorMessage = '';
  categoryId: number = 0;

  constructor(
    private dataService: DataService,
    private router: Router
  ) {
    console.log('✅ CategoriesComponent initialized');
  }

  ngOnInit(): void {
    console.log('🔄 CategoriesComponent - ngOnInit');
    this.loadCategories();
  }

  /**
   * טעינת קטגוריות מהשרת
   */
  loadCategories(): void {
    console.log('📥 מתחיל לטעון קטגוריות...');
    this.loading = true;
    this.errorMessage = '';

    this.dataService.getCategories().subscribe({
      next: (data) => {
        console.log('✅ קטגוריות נטענו בהצלחה:', data);
        this.categories = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ שגיאה בטעינת קטגוריות:', error);
        this.errorMessage = error.message || 'אירעה שגיאה בטעינת הקטגוריות';
        this.loading = false;
      },
      complete: () => {
        console.log('🏁 טעינת קטגוריות הושלמה');
      }
    });
  }

  /**
   * מעבר לעמוד המוצרים של הקטגוריה
   */
  selectCategory(category: Category): void {
    console.log('➡️ נבחרה קטגוריה:', category.name, 'ID:', category.id);
    this.router.navigate(['/products', category.id]);
  }

  /**
   * מעבר לעמוד הוספת קטגוריה
   */
  goToAddCategory(): void {
    console.log('➡️ עובר לעמוד הוספת קטגוריה');
    this.router.navigate(['/add-category']);
  }
goToAddProduct(): void {
    console.log('➡️ עובר לעמוד הוספת מוצר');
    this.router.navigate(['/add-product'], { 
      queryParams: { categoryId: this.categoryId } 
    });
  }

  /**
   * ניסיון חוזר לטעינה
   */
  retry(): void {
    console.log('🔄 מנסה לטעון שוב...');
    this.loadCategories();
  }
}