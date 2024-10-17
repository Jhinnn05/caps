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

  constructor(private gradesService: AuthService) {}

  ngOnInit(): void {
    this.loadCidFromLocalStorage();
    this.loadGrades();
  }
  loadCidFromLocalStorage(): void {
    // Retrieve the LRN from local storage
    this.cid = localStorage.getItem('LRN');
  }

  loadGrades(): void {
    if (this.cid) { // Check if cid is not null
      this.gradesService.getGrades(this.cid).subscribe(data => {
        this.grades = data;
        console.log(this.grades)
      });
    } else {
      console.error('LRN not found in local storage.');
    }
  }

  calculateAverage(quarter: number): number {
    const total = this.grades.reduce((sum, grade) => {
      return sum + (grade[`grade_Q${quarter}`] || 0);
    }, 0);
    return total / this.grades.length || 0; // Prevent division by zero
  }
}
