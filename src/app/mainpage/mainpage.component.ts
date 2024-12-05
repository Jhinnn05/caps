import { Component, computed, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
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
export class MainpageComponent implements OnInit{
  collapsed = signal(false)
  sidenavWidth = computed(() => this.collapsed() ? '65px' : '250px');  
  constructor(private authService: AuthService, private router: Router) {}
  
  adminPic: string | null = null;
  ngOnInit(): void {
    
    this.authService.adminPic$.subscribe((newImageUrl) => {
      if (newImageUrl) {
        this.adminPic = newImageUrl; // Update the component's admin picture
      }
    });

    // Optionally, initialize with the image from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.parent_pic) {
      this.adminPic = user.parent_pic;
    }
  }

  onLogout() {
    this.authService.logout().subscribe(
        (response) => {
          console.log('Logout successful:', response);
          localStorage.removeItem('token');
          localStorage.removeItem('user'); 
          localStorage.removeItem('admin_id');// Clear the token from localStorage
          this.router.navigate(['/login']);
        },
        (error) => {
            console.error('Logout failed', error); // Handle error
        }
    );
}

}