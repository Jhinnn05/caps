import { Component, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-mainpage',
  standalone: true,
  imports: [RouterModule, MatSidenavModule, 
    CommonModule, MatToolbarModule, 
    MatButtonModule, MatIconModule, 
    MatListModule, SidenavComponent,
    MatExpansionModule, MatBadgeModule, MatMenuModule, MatTooltipModule],
  templateUrl: './mainpage.component.html',
  styleUrl: './mainpage.component.css'
})
export class MainpageComponent {
  collapsed = signal(false)
  sidenavWidth = computed(() => this.collapsed() ? '65px' : '250px');  
  constructor(private authService: AuthService) {}

  onLogout() {
    this.authService.logout().subscribe(
        (response) => {
            console.log(response.message); // Handle success
            localStorage.removeItem('token'); // Clear token from local storage
            // this.router.navigate(['/login']); // Redirect to login page
        },
        (error) => {
            console.error('Logout failed', error); // Handle error
        }
    );
}
}