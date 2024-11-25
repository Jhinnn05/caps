import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule,ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginform = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    if (this.loginform.valid) {
      this.authService.login(this.loginform.value).subscribe((result: any) => {
        if (result.token != null) {
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('token', result.token); // Save the token only in the browser
            localStorage.setItem('id',result.id);
            localStorage.setItem('email',result.email);
            const user = result.parent;
            // const user = result.parent;
            if (user && user.parent_pic) {
              if (!user.parent_pic.startsWith('http://localhost:8000')) {
                user.parent_pic = `http://localhost:8000/assets/parentPic/${user.parent_pic}`;
              }
          }
          localStorage.setItem('user', JSON.stringify(user));
        }
          // Show success SweetAlert
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Login Successful',
            // text: 'Welcome back!',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.router.navigate(['/main']); // Redirect to the main page
          });
        } else {
          // Show error if login fails
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Login Failed',
            text: 'Incorrect credentials, please try again.',
            showConfirmButton: true
          });
        }
      },
      (error) => {
        console.error('Error during login:', error);
        // Show error alert if there's an API error
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Error',
          text: 'There was an issue with the login process. Please try again.',
          showConfirmButton: true
        });
      }
    );
  } else {
    Swal.fire({
      position: 'center',
      icon: 'warning',
      title: 'Validation Failed',
      text: 'Please fill in both fields before submitting.',
      showConfirmButton: true
      });
    }
  }
}