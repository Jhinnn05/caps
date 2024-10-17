import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';

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
    this.authService.login(this.loginform.value).subscribe((result: any) => {
      if (result.token != null) {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('token', result.token); // Save the token only in the browser
          localStorage.setItem('id',result.id);
          localStorage.setItem('email',result.email);
        }
        this.router.navigate(['/main']);
      }
      console.log(result);
    });
  }
}