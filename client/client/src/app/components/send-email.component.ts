import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EmailService } from '../services/email.service';

@Component({
  selector: 'app-send-email',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.scss']
})
export class SendEmailComponent {

  @Input() recipeHtml: string = '';
  @Input() recipeTitle: string = '';
  @Output() close = new EventEmitter<void>();

  form: FormGroup;
  sending = false;
  message = '';

  constructor(private fb: FormBuilder, private emailService: EmailService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  send() {
    if (this.form.invalid) {
      this.message = '❌ יש להזין כתובת מייל תקינה';
      return;
    }

    this.sending = true;
    this.message = '';

    this.emailService.sendEmail({
      to: this.form.value.email,
      subject: `📖 מתכון: ${this.recipeTitle}`,
      html: this.recipeHtml
    }).subscribe({
      next: () => {
        this.message = '✅ המייל נשלח בהצלחה!';
        setTimeout(() => this.close.emit(), 1500);
      },
      error: () => {
        this.message = '❌ שגיאה בשליחת המייל.';
      },
      complete: () => this.sending = false
    });
  }

  closePopup() {
    this.close.emit();
  }
}
