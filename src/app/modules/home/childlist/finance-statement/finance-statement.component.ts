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
  // LRN:{ id: string | null } = {id:localStorage.getItem('LRN')}
  students: any;
  lname:any;
  fname: any;
  mname: any;
  currentDate: any;
  remaining_balance: any;
  tuition: any;
  total_paid: any;
  name: any;
  LRN:any;
  constructor(
    private conn: AuthService
  ){}
  
  formDate(date: Date):string{
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: '2-digit',
      year: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  }

  ngOnInit(): void {
    this.currentDate = this.formDate(new Date());
    this.LRN = localStorage.getItem('LRN');
    this.conn.printSOA(this.LRN).subscribe((result: any) => {
      this.students = result.payments;
      this.name = result.payments[0].name;
      this.remaining_balance = result.remaining_balance;
      this.tuition = result.payments[0].tuition;
      this.total_paid = result.total_paid;
      console.log(this.students, this.tuition);
      
    })
  }
}
