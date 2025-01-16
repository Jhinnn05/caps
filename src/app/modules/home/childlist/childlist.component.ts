import { Component, OnInit } from '@angular/core';
import {  Router, RouterModule, } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth.service';
import { AnnouncementComponent } from '../announcement/announcement.component';

@Component({
  selector: 'app-childlist',
  standalone: true,
  imports: [RouterModule,CommonModule,AnnouncementComponent],
  templateUrl: './childlist.component.html',
  styleUrl: './childlist.component.css'
})

export class ChildlistComponent implements OnInit {
  selectedSection: any;
  email: any;
  AccDetails: any;
  parents: any;
  students: any[] = []; // Use any[] to store students
  selectedStudent: any | null = null;
  announcements: any[] = [];

  currentDay: string;
    currentDate: string;
    lname = '';
    fname = '';
    mname = '';
    activeLink: string = ''; 

  constructor(public authService: AuthService, private router: Router) {
    this.currentDay = this.getCurrentDay();
    this.currentDate = this.getCurrentDate(); 
  }
  preloader: boolean = false;

  ngOnInit(): void {
    this.fetchParent();
   
    this.loadUserData();
    // Listen for router events to toggle preloader
  }
  loadUserData() {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedData = JSON.parse(userData);
      this.lname = parsedData.lname || "";
      this.mname = parsedData.mname || "";
      this.fname = parsedData.fname || "";
    }
  }
  getCurrentDay(): string {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long'
    };
    return date.toLocaleDateString(undefined, options); 
  }
  getCurrentDate(): string {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric',
      month: 'long',
      day: 'numeric' 
    };
    return date.toLocaleDateString(undefined, options);
  }
  getGreeting(): string {
    const hours = new Date().getHours();
    if (hours < 12) {
      return 'Good Morning, ';
    } else if (hours < 18) {
      return 'Good Afternoon, ';
    } else {
      return 'Good Evening, ';
    }
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
    this.resetActiveLink(); 
  
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
  // Navigation methods
  navigateToFinance() {
    this.activeLink = 'finance';
    this.authService.preloader = true;
    setTimeout(() => {
      this.router.navigate(['/main/home/home/childlist/childmain/finance']).then(() => {
      this.authService.preloader = false;
      });
    }, 500);
  }

  navigateToGrades() {
    this.activeLink = 'grades';
    this.authService.preloader = true;
    setTimeout(() => {
      this.router.navigate(['/main/home/home/childlist/acadsmain']).then(() => {
      this.authService.preloader = false;
      });
    }, 500);
  }

  navigateToAttendance() {
    this.activeLink = 'attendance';
    this.authService.preloader = true;
    setTimeout(() => {
      this.router.navigate(['/main/home/home/childlist/attendancemain/attendance']).then(() => {
      this.authService.preloader = false;
      });
    }, 500);
  }
  resetActiveLink() {
    this.activeLink = ''; // Reset the active link when selecting a child
  }
  
}