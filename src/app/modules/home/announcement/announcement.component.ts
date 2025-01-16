import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';


export interface Announcement {
  admin_name: string;     // Name of the admin who made the announcement
  created_at: string;     // Date when the announcement was created
  subject_name: string;    // Subject associated with the announcement
  title: string;          // Title of the announcement
  announcement: string;   // The content of the announcement
}

@Component({
  selector: 'app-announcement',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './announcement.component.html',
  styleUrl: './announcement.component.css'
})
export class AnnouncementComponent implements OnInit {
  
  @Input() announcements: any[] = [];

  constructor(public authService: AuthService, private router: Router, public dialog: MatDialog ){}

  ngOnInit(): void {
    this.fetchAnnouncements();
  }
  trackByFn(index: number, item: any): number {
    return item.id; // Use a unique identifier for announcements
  }
  //fetch Announcements
  fetchAnnouncements() {
    this.authService.getannouncement().subscribe((data) => {
      this.announcements = data;
      console.log(this.announcements); 
    });
  }

  showFullAnnouncement(ann: any): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        title: ann.title,
        announcement: ann.announcement,
        admin_name: ann.admin_name,        // Include admin_name
        created_at: ann.created_at,        // Include created_at
        subject_name: ann.subject_name     // Include subject_name
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }  
}
