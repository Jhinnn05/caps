import { Component, OnInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { FinanceStatementComponent } from './finance-statement/finance-statement.component';
import { ChildmainComponent } from './childmain/childmain.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth.service';


@Component({
  selector: 'app-childlist',
  standalone: true,
  imports: [RouterModule,CommonModule],
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
  announcements: any[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  preloader: boolean = false;

  ngOnInit(): void {
    this.fetchParent();
    this.fetchAnnouncements();

    // Listen for router events to toggle preloader
    
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
    this.authService.preloader = true;
    this.selectedStudent = student;
  
    if (student && student.LRN) {
      localStorage.setItem('LRN', student.LRN);
      console.log('Student LRN set in local storage:', student.LRN);
  
      // Simulate a delay for demo purposes; replace with real logic if needed
      
      setTimeout(() => {
        this.router.navigate(['/main/home/home']).then(() => {
        this.authService.preloader = false;
        });
      }, 500); // Adjust timeout as needed
    } else {
      this.preloader = false; // Stop preloader if no valid student
      console.warn('Selected student does not have a valid LRN.');
    }
  }

  //fetch Announcements
  fetchAnnouncements(){
    this.authService.getannouncement().subscribe((data) => {
      this.announcements = data;
      console.log(this.announcements); 
    });
  } 

  // Navigation methods
  navigateToFinance() {
    this.preloader = true;
    this.router.navigate(['/main/home/home/childlist/childmain/finance']).then(() => {
      this.preloader = false; // Stop preloader after navigation
    });
  }

  navigateToGrades() {
    this.preloader = true;
    this.router.navigate(['/main/home/home/childlist/acadsmain']).then(() => {
      this.preloader = false; // Stop preloader after navigation
    });
  }

  navigateToAttendance() {
    this.preloader = true;
    this.router.navigate(['/main/home/home/childlist/attendancemain/attendance']).then(() => {
      this.preloader = false; // Stop preloader after navigation
    });
  }
  
}