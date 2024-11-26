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
  Parent_pic:any;
  user: any;
  constructor(private authService: AuthService, private router: Router, private http:HttpClient) {}
  profileForm = new FormGroup({
    admin_id: new FormControl('',),
    fname: new FormControl(''),
    mname: new FormControl(''),
    lname: new FormControl(''),
    email: new FormControl(''),
    address: new FormControl(''),
    oldPassword: new FormControl(null),
    newPassword: new FormControl(''),
    newPassword_confirmation: new FormControl(''),
    role: new FormControl(''),

  })
  ngOnInit(): void {
    this.loadUserData();
  }
  loadUserData(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log(user);
    if (user) {
      this.profileForm.patchValue({
        fname: user.fname,
        mname: user.mname,
        lname: user.lname,
        email: user.email,
        address: user.address,
        oldPassword: user.oldPassword,
        
      });
    }
    this.Parent_pic = user.parent_pic || 'default-image-url';
  }
  saveChanges(): void {
     if (this.profileForm.valid) {
      const formData = this.profileForm.value;
  
      const Email = (formData.email);
      const OldPassword = formData.oldPassword ?? ''; // Ensure this is a string
  
      if (!Email || !OldPassword) {
        console.error('Invalid email or missing old password');
        return;
      }
      this.authService.update(Email, OldPassword, {
        fname: formData.fname,
        mname: formData.mname,
        lname: formData.lname,
        email: formData.email,
        address: formData.address,
        newPassword: formData.newPassword,
        newPassword_confirmation: formData.newPassword_confirmation // Include confirmation if needed
      }).subscribe(
        (result) => {
          console.log('Profile updated successfully', result);
          const updatedUser = {
            ...this.AccDetails,
            fname: formData.fname,
            mname: formData.mname,
            lname: formData.lname,
            email: formData.email,
            address: formData.address,
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          this.loadUserData();
        },
        (error) => {
          console.error('Error updating profile:', error);
          console.error('Error details:', error.error);
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }
    
  onFileChange(event: any): void {
    const file = event.target.files[0];
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (file && user.email) { // Changed admin_id to email
        const formData = new FormData();
        formData.append('image', file);
        formData.append('email', user.email); // Changed admin_id to email

        this.authService.uploadImage(formData).subscribe(response => { // Changed adminService to authService
            console.log(response); 
            const newImageUrl = `http://localhost:8000/assets/parentPic/${response['image_url'].split('/').pop()}`; // Changed adminPic to parentPic
            
            // Update parentPic variable and the service
            this.Parent_pic = newImageUrl; // Changed adminPic to parentPic
            user.parent_pic = newImageUrl; // Changed admin_pic to parent_pic
            localStorage.setItem('user', JSON.stringify(user)); 
            
            // Notify other components by updating the service
            this.authService.updateParentPic(newImageUrl); // Changed adminService to authService and adminPic to parentPic
            console.log('Parent Picture URL:', this.Parent_pic); // Changed adminPic to parentPic
        }, error => {
            console.error('Error uploading image:', error);
        });
    } else {
        console.error('No file selected or email is missing'); // Changed admin ID to email
    }
}
      
}

