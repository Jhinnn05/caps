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

  // constructor(private authService: AuthService) {}

  ngOnInit(): void {
    
  }
  sideNavCollapsed = signal(false);
  @Input() set collapsed(val: boolean) {
    this.sideNavCollapsed.set(val)
  }
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