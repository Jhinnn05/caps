import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-finance-statement',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatInputModule,
    MatBadgeModule,
    MatMenuModule,
    MatDividerModule,
    MatListModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule],
  templateUrl: './finance-statement.component.html',
  styleUrl: './finance-statement.component.css'
})
export class FinanceStatementComponent implements OnInit{
  filename: string | null = null;  // Store the filename (image)
  constructor(
    public conn: AuthService
  ){}
  

  ngOnInit(): void {
    const LRN = localStorage.getItem('LRN');

    // Fetch the filename for the given LRN
    this.conn.printSOA(LRN).subscribe((result: any) => {
      this.filename = result.filename;  // Get the filename from the response
      console.log(this.filename);  // Log to check the filename
    });
  }
}
