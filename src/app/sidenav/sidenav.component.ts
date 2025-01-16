import { CommonModule } from '@angular/common';
import { Component, computed, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';

export type MenuItem = {
  icon: string;
  label: string;
  route: string;
  unreadCount?: any;
}

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, RouterModule, MatBadgeModule, MatTooltipModule],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent implements OnInit, OnDestroy {
  @Input() item: any;

  private intervalId: any; // To store the interval ID

  unreadMessagesCount: any = 0;

  AccountDetails: any;
  uid: any;
  lname = '';
  fname = '';
  mname = '';

  sideNavCollapsed = signal(false);
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
      route: 'message',
      unreadCount: this.unreadMessagesCount
    }
  ]);

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.uid = localStorage.getItem('id');

    this.loadUserData();
    this.startPolling(); // Start polling for unread messages count

    this.authService.adminPic$.subscribe((newImageUrl) => {
      if (newImageUrl) {
        this.adminPic = newImageUrl;
      }
    });

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.parent_pic) {
      this.adminPic = user.parent_pic;
    }
  }

  ngOnDestroy(): void {
    this.stopPolling(); // Clear the interval when the component is destroyed
  }

  startPolling(): void {
    this.intervalId = setInterval(() => {
      this.loadUnreadMessagesCount();
    }, 10000); // Fetch messages every 10 seconds
  }

  stopPolling(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  loadUserData() {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedData = JSON.parse(userData);
      this.lname = parsedData.lname || '';
      this.mname = parsedData.mname || '';
      this.fname = parsedData.fname || '';
    }
  }

  loadUnreadMessagesCount() {
    if (this.uid) {
      this.authService.getUnreadMessagesCount(this.uid).subscribe(response => {
        this.unreadMessagesCount = response;
        this.updateMenuItems();
      });
    }
  }

  updateMenuItems() {
    this.menuItems.set([
      {
        icon: 'home',
        label: 'Home',
        route: 'home'
      },
      {
        icon: 'message',
        label: 'Messages',
        route: 'message',
        unreadCount: this.unreadMessagesCount
      }
    ]);
  }

  trackByFn(index: number, item: MenuItem) {
    return item.route; // or any unique identifier
  }

  profilePicSize = computed(() => this.sideNavCollapsed() ? '32' : '100');
}
