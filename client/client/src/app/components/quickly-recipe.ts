import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RecipeService } from '../services/recipe.service';
import { RecipeRequestDto } from '../Model/RecipeRequestDto';
import { RecipeDto } from '../Model/RecipeDto';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-quickly-recipe',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, InputTextModule, ButtonModule],
  templateUrl: './quickly-recipe.html',
  styleUrls: ['./quickly-recipe.scss']
})
export class QuicklyRecipeComponent {
  ingredients: string = '';
  recipe: RecipeDto | null = null;
  loading = false;
  errorMessage: string = '';

  // הגדרות נוספות
  vegetarian = false;
  vegan = false;
  glutenFree = false;
  servings: number = 4;  // ערך ברירת מחדל
  maxCalories: number | undefined = undefined;

  constructor(private recipeService: RecipeService) {}

  send() {
    if (!this.ingredients.trim()) {
      this.errorMessage = 'נא להזין מצרכים';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.recipe = null;
    
    const body: RecipeRequestDto = {
      ingredients: this.ingredients.split(',').map(x => x.trim()),
      vegetarian: this.vegetarian,
      vegan: this.vegan,
      glutenFree: this.glutenFree,
      servings: this.servings,  // ✅ הוספתי
      maxCalories: this.maxCalories  // ✅ הוספתי
    };

    console.log('📤 שולח בקשה ליצירת מתכון מהיר:', body);

    this.recipeService.generateRecipe(body)
      .subscribe({
        next: (res) => { 
          console.log('✅ מתכון נוצר בהצלחה:', res);
          this.recipe = {
            ...res,
            description: res.description || '',
            notes: res.notes || []
          };
          this.loading = false;
        },
        error: (err) => { 
          console.error('❌ שגיאה בטעינת המתכון:', err);
          this.errorMessage = err.message || 'אירעה שגיאה בטעינת המתכון';
          this.loading = false;
        }
      });
  }

  // הורדת PDF
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