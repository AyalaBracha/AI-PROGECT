import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RecipeDto } from '../Model/RecipeDto';
import { RecipeRequestDto } from '../Model/RecipeRequestDto';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  private apiUrl = 'https://localhost:7276/api/Recipe/generate';
  private emailApiUrl = 'https://localhost:7276/api/Email/send';

  constructor(private http: HttpClient) {
    console.log('✅ RecipeService initialized with URL:', this.apiUrl);
  }

  /**
   * יצירת מתכון חדש
   */
  generateRecipe(request: RecipeRequestDto): Observable<RecipeDto> {
    console.log('📤 שולח בקשה ליצירת מתכון:', request);

    return this.http.post<RecipeDto>(this.apiUrl, request).pipe(
      tap(recipe => {
        console.log('✅ התקבל מתכון:', recipe.title);
        console.log('📋 מצרכים:', recipe.ingredients.length);
        console.log('📝 הוראות:', recipe.instructions.length);
        if (recipe.imageBase64) {
          console.log('🖼️ התקבלה תמונה');
        }
      }),
      catchError(err => this.handleError(err))
    );
  }

  /**
   * ✔ פונקציית sendEmail (אם תרצי להשתמש בה)
   */
  // sendRecipeByEmail(emailData: { to: string, subject: string, html: string }): Observable<any> {
  //   console.log('📤 שולח מייל ל:', emailData.to);

  //   return this.http.post(this.emailApiUrl, emailData).pipe(
  //     tap(response => {
  //       console.log('✅ המייל נשלח בהצלחה:', response);
  //     }),
  //     catchError(err => this.handleError(err))
  //   );
  // }

  /**
   * ✔ טיפול בשגיאות HTTP — ללא ErrorEvent כדי למנוע קריסה
   */
  private handleError(error: HttpErrorResponse) {
    console.error('❌ שגיאה התקבלה מהשרת:', error);

    let errorMessage = 'אירעה שגיאה לא ידועה';

    // בדיקה בטוחה — מונע ReferenceError
    const isClientError =
      typeof ErrorEvent !== 'undefined' && error.error instanceof ErrorEvent;

    if (isClientError) {
      // שגיאת Client
      errorMessage = `שגיאת Client: ${error.error.message}`;
    } else {
      // שגיאת Server
      errorMessage = `שגיאת Server (${error.status}): ${error.message}`;

      if (error.status === 0) {
        errorMessage = '❌ לא ניתן להתחבר לשרת. ודאי שהשרת רץ על https://localhost:7276';
      }
      else if (error.status === 400) {
        errorMessage = '❌ בקשה לא תקינה — בדקי את הנתונים שנשלחו';
      }
      else if (error.status === 500) {
        errorMessage = '❌ שגיאה פנימית בשרת ביצירת המתכון';
      }
    }

    console.error('❌ פירוט:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
