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
  grades: any[] = [];
  cid: string | null = null; // Declare cid as nullable
  grade_level: number | null = null; // Declare grade_level as nullable

  constructor(private gradesService: AuthService) {}

  ngOnInit(): void {
    this.loadCidFromLocalStorage();
    this.loadGrades();
    this.loadGradeLevel(); // Load the grade level
  }

  loadCidFromLocalStorage(): void {
    // Retrieve the LRN from local storage
    this.cid = localStorage.getItem('LRN');
  }

  loadGrades(): void {
    if (this.cid) { // Check if cid is not null
      this.gradesService.getGrades(this.cid).subscribe(data => {
        this.grades = data;
        console.log(this.grades);
      });
    } else {
      console.error('LRN not found in local storage.');
    }
  }

  loadGradeLevel(): void {
    // Retrieve the grade level from local storage or any other source
    this.grade_level = parseInt(localStorage.getItem('grade_level') || '0', 10);
  }

  calculateAverage(quarter: string): number {
    const total = this.grades.reduce((sum, grade) => {
      return sum + (grade[quarter] || 0);
    }, 0);
    return total / this.grades.length || 0; // Prevent division by zero
  }
}
