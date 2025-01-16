import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatList, MatListItem } from '@angular/material/list';
import { AnnouncementComponent } from '../announcement.component';
import { CommonModule } from '@angular/common';

export interface Announcement {
  admin_name: string;     // Name of the admin who made the announcement
  created_at: string;     // Date when the announcement was created
  subject_name: string;    // Subject associated with the announcement
  title: string;          // Title of the announcement
  announcement: string;   // The content of the announcement
}

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [MatDialogModule,
    MatButtonModule,MatCardModule,MatDivider,MatIcon,MatList,MatListItem,MatExpansionModule,CommonModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css'
})
export class DialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AnnouncementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Announcement // Injecting the announcement data
  ) {}

  ngOnInit(): void {
    console.log('Received announcement data:', this.data); // Log received data for debugging
  }

  closeDialog(): void {
    this.dialogRef.close(); // Method to close the dialog
  }
}