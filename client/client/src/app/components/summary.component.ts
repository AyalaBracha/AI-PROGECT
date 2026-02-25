import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SelectedProduct } from '../Model/Product';
import { ProductSelectionService } from '../services/product-selection.service';
import { RecipeService } from '../services/recipe.service';
import { RecipeDto } from '../Model/RecipeDto';
import { RecipeRequestDto } from '../Model/RecipeRequestDto';
import { SendEmailComponent } from './send-email.component';
import { EmailService } from '../services/email.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule, FormsModule, SendEmailComponent],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  selectedProducts: SelectedProduct[] = [];
  recipe: RecipeDto | null = null;
  loading = false;
  errorMessage = '';
  showEmailPopup = false;

  vegetarian = false;
  vegan = false;
  glutenFree = false;
  servings: number = 4;  // ערך ברירת מחדל
  maxCalories: number = 500;  // ערך ברירת מחדל

  // משתני שגיאות לולידציה
  servingsError: string = '';
  caloriesError: string = '';

  constructor(
    private selectionService: ProductSelectionService,
    private recipeService: RecipeService,
    private router: Router,
    private emailService: EmailService
  ) {}

  ngOnInit(): void {
    this.selectedProducts = this.selectionService.getSelections();
    if (this.selectedProducts.length === 0) {
      this.router.navigate(['/categories']);
    }
  }

  // ולידציה למספר מנות
  validateServings(): void {
    if (!this.servings || this.servings < 1 || this.servings > 2000) {
      this.servingsError = '⚠️ מספר המנות חייב להיות בין 1 ל-2000';
    } else {
      this.servingsError = '';
    }
  }

  // ולידציה לקלוריות
  validateCalories(): void {
    if (!this.maxCalories || this.maxCalories < 20 || this.maxCalories > 5000) {
      this.caloriesError = '⚠️ קלוריות למנה חייבות להיות בין 20 ל-5000';
    } else {
      this.caloriesError = '';
    }
  }

  // בדיקה אם יש שגיאות
  hasValidationErrors(): boolean {
    return this.servingsError !== '' || this.caloriesError !== '';
  }

  openEmailPopup() {
    this.showEmailPopup = true;
  }

  closeEmailPopup() {
    this.showEmailPopup = false;
  }

  removeProduct(productId: number): void {
    this.selectionService.removeProduct(productId);
    this.selectedProducts = this.selectionService.getSelections();
    if (this.selectedProducts.length === 0) {
      this.router.navigate(['/categories']);
    }
  }

  goBack(): void {
    this.router.navigate(['/categories']);
  }

  generateRecipe(): void {
    // ולידציה לפני שליחה
    this.validateServings();
    this.validateCalories();

    if (this.hasValidationErrors()) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.recipe = null;

    const ingredients = this.selectionService.getIngredientsForRecipe();
    
    const request: RecipeRequestDto = {
      ingredients,
      vegetarian: this.vegetarian,
      vegan: this.vegan,
      glutenFree: this.glutenFree,
      servings: this.servings,
      maxCalories: this.maxCalories
    };

    console.log('📤 שולח בקשה ליצירת מתכון:', request);

    this.recipeService.generateRecipe(request).subscribe({
      next: (res) => {
        console.log('✅ מתכון נוצר בהצלחה:', res);
        this.recipe = {
          ...res,
          description: res.description || '',
          notes: res.notes || []
        };
        this.loading = false;
        
        // ניקוי המוצרים הנבחרים אחרי יצירת מתכון מוצלח
        this.selectionService.clearAll();
        this.selectedProducts = [];
      },
      error: (err) => {
        console.error('❌ שגיאה ביצירת המתכון:', err);
        this.errorMessage = err.message || 'אירעה שגיאה ביצירת המתכון';
        this.loading = false;
      }
    });
  }

  startOver(): void {
    this.selectionService.clearAll();
    this.router.navigate(['/categories']);
  }

  // --- הורדת PDF ---
  async downloadPDF(): Promise<void> {
    if (!this.recipe) {
      alert('אין מתכון להוריד');
      return;
    }

    try {
      const { jsPDF } = await import('jspdf');
      const htmlContent = this.createHTMLContent();
      const { default: html2canvas } = await import('html2canvas');

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      tempDiv.style.position = 'absolute';
      tempDiv.style.right = '-9999px';
      tempDiv.style.width = '800px';
      tempDiv.style.background = 'white';
      tempDiv.style.padding = '40px';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      tempDiv.style.direction = 'rtl';
      document.body.appendChild(tempDiv);

      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      document.body.removeChild(tempDiv);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = `${this.recipe.title}.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error('שגיאה ביצירת PDF:', error);
      alert('אירעה שגיאה ביצירת הקובץ');
    }
  }

  createHTMLContent(): string {
    if (!this.recipe) return '';

    let html = `
      <div style="direction: rtl; text-align: right; font-family: Arial, sans-serif;">
        <h1 style="color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; margin-bottom: 20px;">
          ${this.recipe.title}
        </h1>
    `;

    if (this.recipe.description) {
      html += `
        <p style="color: #555; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
          ${this.recipe.description}
        </p>
      `;
    }

    html += `
      <h2 style="color: #e74c3c; margin-top: 30px; margin-bottom: 15px;">מצרכים:</h2>
      <ul style="list-style-type: disc; padding-right: 20px; line-height: 1.8;">
    `;
    
    this.recipe.ingredients.forEach(ingredient => {
      html += `<li style="margin-bottom: 8px; color: #333;">${ingredient}</li>`;
    });
    
    html += `</ul>`;

    html += `
      <h2 style="color: #27ae60; margin-top: 30px; margin-bottom: 15px;">הוראות הכנה:</h2>
      <ol style="padding-right: 20px; line-height: 1.8;">
    `;
    
    this.recipe.instructions.forEach(instruction => {
      html += `<li style="margin-bottom: 12px; color: #333;">${instruction}</li>`;
    });
    
    html += `</ol>`;

    if (this.recipe.notes && this.recipe.notes.length > 0) {
      html += `
        <h2 style="color: #f39c12; margin-top: 30px; margin-bottom: 15px;">הערות:</h2>
        <ul style="list-style-type: circle; padding-right: 20px; line-height: 1.8;">
      `;
      
      this.recipe.notes.forEach(note => {
        html += `<li style="margin-bottom: 8px; color: #666;">${note}</li>`;
      });
      
      html += `</ul>`;
    }

    html += `</div>`;
    
    return html;
  }
}