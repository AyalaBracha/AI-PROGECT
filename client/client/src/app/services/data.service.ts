import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Category, CategoryDTO } from '../Model/Category';
import { Product, ProductDTO } from '../Model/Product';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'https://localhost:7276/api/Category';

  constructor(private http: HttpClient) {
    console.log('✅ DataService initialized with URL:', this.apiUrl);
  }

  /** שליפת כל הקטגוריות */
  getCategories(): Observable<Category[]> {
    console.log('📤 שולח בקשה לשליפת קטגוריות...');
    return this.http.get<Category[]>(this.apiUrl).pipe(
      tap(data => console.log('✅ התקבלו קטגוריות:', data)),
      catchError(err => this.handleError(err))
    );
  }

  /** שליפת מוצרים לפי קטגוריה */
  getProductsByCategory(categoryId: number): Observable<Product[]> {
    console.log(`📤 שולח בקשה לשליפת מוצרים לקטגוריה ${categoryId}...`);
    return this.http.get<Product[]>(`${this.apiUrl}/${categoryId}/products`).pipe(
      tap(data => console.log(`✅ התקבלו ${data.length} מוצרים`)),
      catchError(err => this.handleError(err))
    );
  }

  /** שליפת מוצר בודד */
  getProductById(productId: number): Observable<Product> {
    console.log(`📤 שולח בקשה לשליפת מוצר ${productId}...`);
    return this.http.get<Product>(`${this.apiUrl}/product/${productId}`).pipe(
      tap(data => console.log('✅ מוצר התקבל:', data)),
      catchError(err => this.handleError(err))
    );
  }

  /** הוספת קטגוריה */
  addCategory(categoryDto: CategoryDTO): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, categoryDto).pipe(
      tap(data => console.log('✅ קטגוריה נוצרה:', data)),
      catchError(err => this.handleError(err))
    );
  }

  /** הוספת מוצר */
  addProduct(productDto: ProductDTO): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/product`, productDto).pipe(
      tap(data => console.log('✅ מוצר נוצר:', data)),
      catchError(err => this.handleError(err))
    );
  }

  /** ⭐ טיפול שגיאות — גרסה תקינה ללא ErrorEvent ⭐ */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = '❌ שגיאה לא ידועה';

    // שגיאת רשת — אין תקשורת לשרת
    if (error.status === 0) {
      errorMessage = '❌ אין תקשורת עם השרת. בדקי שהשרת רץ ושהכתובת נכונה.';
    }
    else if (error.status === 404) {
      errorMessage = '❌ המשאב לא נמצא (404)';
    }
    else if (error.status === 500) {
      errorMessage = '❌ שגיאה פנימית בשרת (500)';
    }
    else if (error.status === 400) {
      errorMessage = error.error?.message || '❌ בקשה לא תקינה (400)';
    }
    else {
      errorMessage = `❌ שגיאה מהשרת (${error.status}): ${error.message}`;
    }

    console.error('❌ שגיאה מפורטת:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
