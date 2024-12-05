import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../auth.service';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

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
  isLoadingEnrollments = true;
  
  ngOnInit(): void {
    this.loadUserData();
    this.isLoadingEnrollments = false;
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
  
      const Email = formData.email;
      const OldPassword = formData.oldPassword ?? '';
  
      if (!Email || !OldPassword) {
        Swal.fire('Error', 'Invalid email or missing old password', 'error');
        return;
      }
  
      this.authService.update(Email, OldPassword, {
        fname: formData.fname,
        mname: formData.mname,
        lname: formData.lname,
        email: formData.email,
        address: formData.address,
        newPassword: formData.newPassword,
        newPassword_confirmation: formData.newPassword_confirmation,
      }).subscribe(
        (result) => {
          Swal.fire('Success', 'Profile updated successfully', 'success');
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
          Swal.fire('Error', 'Failed to update profile. Please try again.', 'error');
          console.error('Error details:', error.error);
        }
      );
    } else {
      Swal.fire('Error', 'Form is invalid. Please check your inputs.', 'error');
    }
  }
    
  onFileChange(event: any): void {
    const file = event.target.files[0];
    const user = JSON.parse(localStorage.getItem('user') || '{}');
  
    if (file && user.email) {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('email', user.email);
  
      this.authService.uploadImage(formData).subscribe(
        (response) => {
          const newImageUrl = `http://localhost:8000/assets/parentPic/${response['image_url'].split('/').pop()}`;
          this.Parent_pic = newImageUrl;
          user.parent_pic = newImageUrl;
          localStorage.setItem('user', JSON.stringify(user));
          this.authService.updateParentPic(newImageUrl);
  
          Swal.fire('Success', 'Image uploaded successfully', 'success');
        },
        (error) => {
          Swal.fire('Error', 'Failed to upload image. Please try again.', 'error');
          console.error('Error details:', error.error);
        }
      );
    } else {
      Swal.fire('Error', 'No file selected or email is missing', 'error');
    }
  }
      
}

