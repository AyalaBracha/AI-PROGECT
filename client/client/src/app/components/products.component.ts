import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../Model/Product';
import { DataService } from '../services/data.service';
import { ProductSelectionService } from '../services/product-selection.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  errorMessage = '';
  categoryId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private selectionService: ProductSelectionService
  ) {
    console.log('✅ ProductsComponent initialized');
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.categoryId = +params['id'];
      console.log('📂 קטגוריה נבחרה:', this.categoryId);
      this.loadProducts();
    });
  }

  loadProducts(): void {
    console.log('📥 טוען מוצרים לקטגוריה:', this.categoryId);
    this.loading = true;
    this.errorMessage = '';

    this.dataService.getProductsByCategory(this.categoryId).subscribe({
      next: (data) => {
        console.log('✅ מוצרים נטענו:', data);
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ שגיאה בטעינת מוצרים:', err);
        this.errorMessage = 'אירעה שגיאה בטעינת המוצרים';
        this.loading = false;
      }
    });
  }

  /**
   * בדיקה אם מוצר נבחר
   */
  isSelected(product: Product): boolean {
    return this.selectionService.isProductSelected(product.id);
  }

  /**
   * קבלת כמות של מוצר
   */
  getQuantity(product: Product): number {
    return this.selectionService.getProductQuantity(product.id);
  }

  /**
   * בחירה/ביטול בחירה של מוצר
   */
  toggleProduct(product: Product): void {
    console.log('🔄 Toggle מוצר:', product.name, 'ID:', product.id);
    
    if (this.isSelected(product)) {
      console.log('❌ מבטל בחירה');
      this.selectionService.removeProduct(product.id);
    } else {
      console.log('✅ בוחר מוצר');
      this.selectionService.addProduct(product, 1);
    }
  }

  /**
   * חזרה לקטגוריות
   */
  goBack(): void {
    this.router.navigate(['/categories']);
  }

  /**
   * מעבר לסיכום
   */
  goToSummary(): void {
    console.log('➡️ עובר לסיכום עם', this.getTotalSelected(), 'מוצרים');
    this.router.navigate(['/summary']);
  }

  /**
   * מעבר לעמוד הוספת מוצר
   */
  
  /**
   * סך המוצרים שנבחרו (מכל הקטגוריות)
   */
  getTotalSelected(): number {
    return this.selectionService.getTotalItems();
  }
}