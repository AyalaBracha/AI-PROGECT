import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.service';
import { Category } from '../Model/Category';
import { ProductDTO } from '../Model/Product';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {
  productName: string = '';
  productImage: string = '🍎';

  categories: Category[] = [];
  selectedCategoryId: number = 0;
  loading = false;
  loadingCategories = true;
  errorMessage = '';
  successMessage = '';

  // אייקונים נפוצים למוצרים
  availableIcons =  [
  '🍎','🍏','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🫐','🍈','🍒','🍑','🍍','🥭','🥝',
  '🥥','🍅','🥑','🥒','🌶️','🫑','🥕','🌽','🥦','🥬','🥔','🍆','🧄','🧅','🍄','🥗',
  '🥖','🍞','🥐','🥯','🥨','🥞','🧇','🧈','🥯','🫓','🥮','🍩','🍪','🍰','🎂','🧁',
  '🥧','🍫','🍬','🍭','🍮','🍯','🍧','🍨','🍦','🍿','🥜','🌰','🍘','🍙','🍚','🍛',
  '🍜','🍝','🍱','🍣','🍤','🍥','🥟','🥠','🥡','🍢','🍡','🍢','🍗','🍖','🥩','🥓',
  '🌭','🍔','🍟','🍕','🥪','🌮','🌯','🥙','🍲','🥘','🍳','🥚','🧀','🥛','🧃','🧉',
  '🍵','☕','🫖','🥤','🧋','🍶','🍺','🍻','🍷','🥂','🥃','🍸','🍹','🍼','🫗',
  '🧂','🫒','🫙','🍯','🥫','🧊','🍶','🍱','🫛','🫘','🌾','🍚','🍱','🧆',
  
  // תוספת של מאות נוספות
  '🍠','🥨','🧄','🧅','🫑','🌶','🥗','🥙','🍖','🍗','🍘','🍙','🍥','🍱','🫓','🫕',
  '🥘','🧆','🍲','🍣','🍤','🍛','🍜','🍝','🍲','🍢','🍡','🍘','🥟','🥠','🥡','🍚',
  '🥪','🌭','🍔','🍟','🍕','🥞','🧇','🥐','🥯','🥖','🧈','🍞','🫓','🍩','🍪','🧁',
  '🎂','🍰','🥮','🍨','🍦','🍧','🍭','🍬','🍫','🍮','🍡',
  
  // שתייה רבות במיוחד
  '🧃','🧋','🥤','🍹','🍸','🍷','🍺','🍻','🥂','🥃','🧊','🫖','☕','🍵','🍼','🫗',
  
  // חיזוקים
  '🥯','🥐','🧈','🍯','🥜','🌰','🍿','🧄','🧅','🌶','🫑','🥑','🥦','🥬','🍆','🥕',
  '🍟','🍕','🌯','🌮','🍜','🍚','🍣','🍤','🍱','🍛','🥡','🍷','🍺','🍻'


  ];

  constructor(
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    
    // אם הגיע categoryId מה-URL, נשתמש בו כברירת מחדל
    this.route.queryParams.subscribe(params => {
      if (params['categoryId']) {
        this.selectedCategoryId = +params['categoryId'];
      }
    });
  }

  loadCategories(): void {
    this.loadingCategories = true;
    this.dataService.getCategories().subscribe({
      next: (data) => {
        console.log('✅ קטגוריות נטענו:', data);
        this.categories = data;
        
        // אם אין קטגוריה נבחרת, בחר את הראשונה
        if (this.selectedCategoryId === 0 && data.length > 0) {
          this.selectedCategoryId = data[0].id;
        }
        
        this.loadingCategories = false;
      },
      error: (error) => {
        console.error('❌ שגיאה בטעינת קטגוריות:', error);
        this.errorMessage = 'שגיאה בטעינת הקטגוריות';
        this.loadingCategories = false;
      }
    });
  }

  selectIcon(icon: string): void {
    this.productImage = icon;
  }

  onSubmit(): void {
    if (!this.productName.trim()) {
      this.errorMessage = 'שם המוצר הוא שדה חובה';
      return;
    }

    if (!this.selectedCategoryId || this.selectedCategoryId <= 0) {
      this.errorMessage = 'יש לבחור קטגוריה';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const productToSend: ProductDTO = {
      name: this.productName,
      image: this.productImage,
      categoryId: this.selectedCategoryId
    };

    console.log('📤 שולח מוצר חדש:', productToSend);

    this.dataService.addProduct(productToSend).subscribe({
      next: (created) => {
        console.log('✅ מוצר נוסף בהצלחה:', created);
        this.successMessage = 'המוצר נוסף בהצלחה!';
        this.loading = false;
        
        // חזרה לדף המוצרים של הקטגוריה אחרי 1.5 שניות
        setTimeout(() => {
          this.router.navigate(['/products', this.selectedCategoryId]);
        }, 1500);
      },
      error: (error) => {
        console.error('❌ שגיאה בהוספת מוצר:', error);
        this.errorMessage = error.error?.message || 'אירעה שגיאה בהוספת המוצר';
        this.loading = false;
      }
    });
  }

  cancel(): void {
    if (this.selectedCategoryId > 0) {
      this.router.navigate(['/products', this.selectedCategoryId]);
    } else {
      this.router.navigate(['/categories']);
    }
  }
}