import { SlicePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { SearchFilterPipe } from '../../../search-filter.pipe';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../auth.service';

@Component({
  selector: 'app-send',
  standalone: true,
  imports: [RouterModule,
    SearchFilterPipe,
    RouterOutlet, 
     FormsModule,
     MatIconModule,
     SlicePipe],
  templateUrl: './send.component.html',
  styleUrl: './send.component.css'
})
export class SendComponent implements OnInit{
  
  messages: any;
  conversation: any;
  keyword: any;
  sid: any;
  uid: any;
  inputClicked: boolean = false;
  admins: any;

  constructor(private auth: AuthService,
    private aroute: ActivatedRoute,
    private route: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.uid = localStorage.getItem('id');
    this.getMessages();
    this.getAdmins();
}

getMessages(){
    console.log(this.uid)
    this.auth.getMessages(this.uid).subscribe((result: any) => {
      console.log(result)
      const uniqueMessages = [];
      const seenSenders = new Set();

      for (const msg of result) {
          if (!seenSenders.has(msg.sender_name)) {
              seenSenders.add(msg.sender_name);
              uniqueMessages.push(msg);
          }
      }

      this.messages = uniqueMessages; // Assign filtered messages to 'messages'
    })
  }

onInputClick() {
    this.inputClicked = true; // Set to true when the input is clicked
    this.keyword = ''; // Clear the keyword if desired
}

onBackClick() {
    this.inputClicked = false; // Set to true when the input is clicked
    this.keyword = ''; // Clear the keyword if desired
}

getAdmins() {
    this.auth.getAdmins().subscribe((result: any) => {
        console.log("getAdmin",result)
        this.admins = result; 
    });
}

openConvo(sid: any, uid: any) {
    this.auth.getConvo(sid, uid).subscribe((result: any) => {
        this.route.navigate(['/main/message/messagepage/messages/view', sid]);
        console.log(result);
        this.conversation = result;
    });
}

}
