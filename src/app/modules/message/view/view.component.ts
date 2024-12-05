import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../auth.service';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule,CommonModule],
  templateUrl: './view.component.html',
  styleUrl: './view.component.css'
})
export class ViewComponent implements OnInit{
  @ViewChild('messageInput') messageInput!: ElementRef;

  adjustInputHeight(input: HTMLTextAreaElement) {
    input.style.height = 'auto'; // Reset height to auto before calculation
    input.style.height = `${input.scrollHeight}px`; // Set the height to match the scroll height
  }

  convo: any = {};
  sid: any;
  uid: any;
  private intervalId: any;

  msgForm = new FormGroup({
    message_sender: new FormControl(localStorage.getItem('id')),
    message_reciever: new FormControl(null),
    message: new FormControl(null)
  })

  constructor(private auth: AuthService,
    private aroute: ActivatedRoute,
    private route: Router,
    private cdRef: ChangeDetectorRef
  ) { }
  toggleTimeDisplay(message: any) {
    // Toggle `showTime` for the clicked message
    message.showTime = !message.showTime;
  }

  ngOnInit(): void {
    const uid = localStorage.getItem('id')
    
    this.aroute.paramMap.subscribe((params) => {
      const sid = params.get('sid');
      this.sid = sid;
      this.uid = uid;
      this.msgForm.get('message_reciever')?.setValue(this.sid);
      this.getConvo(sid, uid);
    });

    this.startPolling();
  }

  ngOnDestroy(): void {
    this.stopPolling(); // Clear the interval when the component is destroyed
  }

  startPolling(): void {
    this.intervalId = setInterval(() => {
      this.getConvo(this.sid, this.uid);
    }, 10000); // 10 seconds
  }

  stopPolling(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  

  getConvo(sid: any, uid: any) {
    console.log("Fetching conversation with sid:", sid, "and uid:", uid);
    this.auth.getConvo(sid, uid).subscribe((result: any) => {
        console.log("Received conversation:", result); // Check if data is here
        this.convo = result; // Assign API response to 'convo'
        this.cdRef.detectChanges();
    });
}



sendMessage() {
  if (this.msgForm.valid) {
    console.log(this.msgForm.value);
    this.auth.sendMessage(this.msgForm.value).subscribe(
      (result: any) => {
        console.log(result);
        this.getConvo(this.aroute.snapshot.paramMap.get('sid'), this.uid); // Refresh the conversation
        this.msgForm.get('message')?.reset(); // Clear the message input
      },
      (error: any) => {
        console.error('Error sending message:', error);
      }
    );
  } else {
    console.warn('Message form is invalid');
  }
}

}
