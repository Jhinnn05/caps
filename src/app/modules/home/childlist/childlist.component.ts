import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { FinanceStatementComponent } from './finance-statement/finance-statement.component';
import { ChildmainComponent } from './childmain/childmain.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth.service';


@Component({
  selector: 'app-childlist',
  standalone: true,
  imports: [RouterLink,RouterModule,ChildmainComponent,CommonModule],
  templateUrl: './childlist.component.html',
  styleUrl: './childlist.component.css'
})

export class ChildlistComponent implements OnInit {
  selectedSection: any;
  email: any;
  AccDetails: any;
  parents: any[] = []; // Use any[] for parents
  students: any[] = []; // Use any[] to store students
  selectedStudent: any | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.fetchParent();
  }

  fetchParent() {
    this.email = localStorage.getItem('email');
    this.authService.getparent(this.email).subscribe((data) => {
      this.parents = data.map(parent => ({
        lname: parent.lname || '',
        fname: parent.fname || '',
        mname: parent.mname || '',
        address: parent.address || '',
        relationship: parent.relationship || '',
        contact_no: parent.contact_no || '',
        email: parent.email || '',
        students: parent.students || [] // Ensure students is an array
      }));
      
      // Automatically select the first student of the first parent
      if (this.parents.length > 0 && this.parents[0].students.length > 0) {
        this.selectedStudent = this.parents[0].students[0];
      }

      console.log(this.parents);
    }, error => {
      console.error('Error fetching parents:', error);
    });
  }

  // Method to check if a value is an array
  isArray(value: any): boolean {
      return Array.isArray(value);
  }

  selectStudent(student: any) {
      this.selectedStudent = student; // Set the selected student
      // Set the student's LRN in local storage
      if (student && student.LRN) {
          localStorage.setItem('LRN', student.LRN);
          console.log('Student LRN set in local storage:', student.LRN);
      } else {
          console.warn('Selected student does not have a valid LRN.');
      }
      // Navigate to the finance statement immediately after selecting a student
      this.router.navigate(['/main/home/home/childlist/childmain/finance']);
  }
}