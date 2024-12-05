import { CommonModule } from '@angular/common';
import { Component, computed, Input, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';


export type MenuItem = {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, RouterModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})

export class SidenavComponent implements OnInit{

  AccountDetails:any;
  Accountid:any;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadUserData();

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
  lname = '';
  fname = '';
  mname = '';

  loadUserData() {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedData = JSON.parse(userData);
      this.lname = parsedData.lname || "";
      this.mname = parsedData.mname || "";
      this.fname = parsedData.fname || "";
      
    }
  }

  sideNavCollapsed = signal(true);
  @Input() set collapsed(val: boolean) {
    this.sideNavCollapsed.set(val)
  }
  adminPic: string | null = null;


  menuItems = signal<MenuItem[]>([
    {
      icon: 'home',
      label: 'Home',
      route: 'home'
    },
    {
      icon: 'message',
      label: 'Messages',
      route: 'message'
    },
    {
      icon: 'account_circle',
      label: 'My Account',
      route: 'account'
    }
  ])
  profilePicSize = computed (() => this.sideNavCollapsed() ? '32' : '100');
}