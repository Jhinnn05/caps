import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [RouterModule,ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})

export class AccountComponent implements OnInit{
  AccDetails:any;
  UpdatePass:any;
  Accid:any;
  changepasswordFrom:any;

  constructor(private authService: AuthService, private router: Router, private http:HttpClient) {}
  
  ngOnInit(): void {
    this.Accid = localStorage.getItem('email');
    this,this.authService.getProfile(this.Accid).subscribe((response:any)=>{
      console.log(response);
      this.AccDetails = response;
      console.log('profile',this.AccDetails);
    },
    (error) =>{
      console.error("Error Fetching Account Details",error);
    }
    );
    this.changepasswordFrom = new FormGroup({
      email: new FormControl(this.Accid),
      oldPassword: new FormControl('', Validators.required),
      newPassword: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required),
    });
  }
  updatePass(): void {
    if(this.changepasswordFrom.valid){
    
      const oldPassword = this.changepasswordFrom.get('oldPassword').value;
      const newPassword = this.changepasswordFrom.get('newPassword').value;
      const confirmPassword = this.changepasswordFrom.get('confirmPassword').value;

      if(newPassword !== confirmPassword){
        alert('New Password and Confirm Password do not match');
        return;
      }
      this.http.post('http://localhost:8000/api/Account/updatePass/{id}',this.changepasswordFrom.value)
      .subscribe(Response => {
        console.log(Response);
        alert('password Changed Successfully');
      },error => {
        console.error("Error Updating Password",error);
      })
      }
    }
}

