import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-announcement',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './announcement.component.html',
  styleUrl: './announcement.component.css'
})
export class AnnouncementComponent implements OnInit {
  
  @Input() announcements: any[] = [];

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.fetchAnnouncements();
  }
  trackByFn(index: number, item: any): number {
    return item.id; // Use a unique identifier for announcements
  }
  //fetch Announcements
  fetchAnnouncements(){
    this.authService.getannouncement().subscribe((data) => {
      this.announcements = data;
      console.log(this.announcements); 
    });
  } 
  showFullAnnouncement(ann: any): void {
    Swal.fire({
      title: ann.title,
      text: ann.announcement,
      icon: 'info',
      confirmButtonText: 'Close',
      customClass: {
        popup: 'swal-wide' // Optional: custom class for styling
      }
    });
  }
}
