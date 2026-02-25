import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { CategoryDTO } from '../Model/Category';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent {
  categoryName: string = '';
  categoryImage: string = '📁';

  loading = false;
  errorMessage = '';
  successMessage = '';

  // אייקונים נפוצים לבחירה
  availableIcons = ['🍎', '🥖', '🥛', '🥤','🥫', '🥩','🍔','🍬', '🍚','🥗','🍞' ,'🍕', '🍰', '☕', '🍷', '🧀', '🥕', '🍇', '📁', '🍗'];


  constructor(
    private dataService: DataService,
    private router: Router
  ) {}

  selectIcon(icon: string): void {
    this.categoryImage = icon;
  }

  onSubmit(): void {
    if (!this.categoryName.trim()) {
      this.errorMessage = 'שם הקטגוריה הוא שדה חובה';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const categoryToSend: CategoryDTO = {
      name: this.categoryName,
      image: this.categoryImage
    };

    console.log('📤 שולח קטגוריה חדשה:', categoryToSend);

    this.dataService.addCategory(categoryToSend).subscribe({
      next: (created) => {
        console.log('✅ קטגוריה נוספה בהצלחה:', created);
        this.successMessage = 'הקטגוריה נוספה בהצלחה!';
        this.loading = false;
        
        // חזרה לדף הקטגוריות אחרי 1.5 שניות
        setTimeout(() => {
          this.router.navigate(['/categories']);
        }, 1500);
      },
      error: (error) => {
        console.error('❌ שגיאה בהוספת קטגוריה:', error);
        this.errorMessage = error.error?.message || 'אירעה שגיאה בהוספת הקטגוריה';
        this.loading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/categories']);
  }
}