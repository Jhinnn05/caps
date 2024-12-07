import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogActions } from '@angular/material/dialog';
import { startWith, map, Observable } from 'rxjs';
import { SendComponent } from '../send/send.component';
import { AuthService } from '../../../auth.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-reply',
  standalone: true,
  imports: [FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatDialogActions,
    MatButtonModule,
    CommonModule],
  templateUrl: './reply.component.html',
  styleUrl: './reply.component.css'
})
export class ReplyComponent implements OnInit{
  readonly dialogRef = inject(MatDialogRef<SendComponent>);
  readonly data = inject(MAT_DIALOG_DATA);
  
  myControl = new FormControl('');
  recipients: any[] = [];

  msgForm = new FormGroup({
    message_sender: new FormControl(localStorage.getItem('id')),
    message_reciever: new FormControl(''),
    message: new FormControl('')
  })

  constructor(private recipientService: AuthService) {}

  ngOnInit(): void {
    // Fetch the recipients from the backend
    this.recipientService.getRecipients().subscribe((data) => {
      this.recipients = data;
      console.log(this.recipients); 
    });

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || ''))
    );
  }

    filteredOptions: Observable<any[]> = this.myControl.valueChanges.pipe(
      startWith(''), 
      map(value => this._filter(value || '')) 
  );

  private _filter(value: string): any[] {
    const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
    return this.recipients.filter(option =>
      option.receiver_name.toLowerCase().includes(filterValue)
    );
  }
  onOptionSelected(option: any): void {
    if (option && option.receiver_id) {
      this.msgForm.patchValue({
        message_reciever: option.receiver_id 
      });
      console.log('Form after patching:', this.msgForm.value); 
      this.myControl.setValue(option.receiver_name);
    } else {
      console.error('Selected option does not have receiver_id:', option);
    }
  }
    onNoClick(){
      this.dialogRef.close(); 
    }
      submit(): void {
        if (this.msgForm.valid) {
          const messageData = {
            message: this.msgForm.value.message,
            message_date: new Date().toISOString().split('T')[0], // Ensure 'YYYY-MM-DD' format
            message_sender: this.msgForm.value.message_sender, // Must match a valid guardian_id
            message_reciever: this.msgForm.value.message_reciever, // Must match a valid admin_id
          };
      
          console.log('Submitting message data:', messageData); // Debug the payload
      
          this.recipientService.composeMessage(messageData).subscribe({
            next: (response) => {
              console.log('Message sent successfully:', response);
              this.dialogRef.close(messageData);
            },
            error: (error) => {
              console.error('Error sending message:', error);
              if (error.status === 422) {
                console.error('Validation error details:', error.error.errors);
              }
            },
          });
        } else {
          console.error('Form validation failed:', this.msgForm.value);
        }
      }
      
}
