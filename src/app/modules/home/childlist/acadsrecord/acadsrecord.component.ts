import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../auth.service';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-acadsrecord',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './acadsrecord.component.html',
  styleUrl: './acadsrecord.component.css'
})
export class AcadsrecordComponent implements OnInit{
  grades: any[] = []; // Use any[] for grades
  cid: string | null = null; // Declare cid as nullable
  grade_level: number | null = null; // Declare grade_level as nullable
  loading: boolean = false; // Loading state

  constructor(public gradesService: AuthService, public authService: AuthService) {}

  ngOnInit(): void {
    this.loadCidFromLocalStorage();
    this.loadGradeLevel(); // Load the grade level first
    this.loadGrades(); // Load grades after grade level
     // Start loading
    
  }
 


  loadCidFromLocalStorage(): void {
    // Retrieve the LRN from local storage
    this.cid = localStorage.getItem('LRN');
  }

  loadGrades(): void {
    this.authService.preloader = true;
    if (this.cid) { // Check if cid is not null
      this.loading = true; // Set loading state to true
      this.gradesService.getGrades(this.cid).subscribe(
        data => {
          this.grades = data;
          console.log(this.grades);
          this.authService.preloader = false;
        },
        error => {
          console.error('Error fetching grades:', error);
          this.authService.preloader = false;
        }
      );
    } else {
      console.error('LRN not found in local storage.');
    }
     
  }

  loadGradeLevel(): void {
    // Retrieve the grade level from local storage or any other source
    this.grade_level = parseInt(localStorage.getItem('grade_level') || '0', 10);
  }

  hasSemester(semester: number): boolean {
    return this.grades.some(grade => grade.semester === semester);
  }

  hasNullSemester(): boolean {
    return this.grades.some(grade => grade.semester === null);
  }

  calculateGeneralAverage(semester: number | null): string {
    const gradesForSemester = this.grades.filter(grade => grade.semester === semester);
    if (!gradesForSemester.length) return "N/A";

    // Check if all grades in the semester are fully populated
    const allGradesAvailable = gradesForSemester.every(grade => 
        grade.semester === null 
            ? [grade.First_Quarter, grade.Second_Quarter, grade.Third_Quarter, grade.Fourth_Quarter].every(q => q != null && q !== '')
            : grade.Midterm != null && grade.Final != null
    );

    if (!allGradesAvailable) return "N/A";

    const total = gradesForSemester.reduce((sum, grade) => {
        const finalGrade = this.calculateFinalGrade(grade);
        return finalGrade !== null ? sum + finalGrade : sum; // Only add if final grade is valid
    }, 0);

    const average = Math.ceil(total / gradesForSemester.length);
    return `${average}`;
}

calculateFinalGrade(grade: any): number | null {
    let finalGrade: number | null = null;

    if (grade.semester === null) {
        // For high school (quarters)
        const quarters = [
            grade.First_Quarter,
            grade.Second_Quarter,
            grade.Third_Quarter,
            grade.Fourth_Quarter
        ];

        // Check if all quarters are present and valid
        if (quarters.every(q => q != null && q !== '')) {
            // Calculate the sum of the quarters
            finalGrade = Math.ceil(quarters.reduce((sum, value) => sum + (value || 0), 0) / 4);
        }
    } else {
        // For senior high (midterm and final)
        if (grade.Midterm != null && grade.Final != null) {
            finalGrade = Math.ceil((grade.Midterm + grade.Final) / 2); // Average of midterm and final
        }
    }

    return finalGrade; // Return the final grade (or null if any required value is missing)
}

}