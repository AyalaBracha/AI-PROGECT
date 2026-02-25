import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface EmailRequest {
  to: string;
  subject: string;
  html: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  private apiUrl = 'https://localhost:7276/api/Email/send';

  constructor(private http: HttpClient) {}

  sendEmail(request: EmailRequest): Observable<any> {
    return this.http.post(this.apiUrl, request, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }
}
