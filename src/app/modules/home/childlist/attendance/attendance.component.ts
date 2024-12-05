import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../../../auth.service';
import Swal from 'sweetalert2';

interface AttendanceRecord {
  date: Date;
  attendance_status: 'present' | 'absent' | 'late';
  subject_name: string;  // Add subject name to attendance records
  subject_count: number;  // Add subject count to attendance records
}
interface Month {
  value: Date;
  viewValue: string;
}

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [ MatCardModule,
    MatDatepickerModule,
    CommonModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatSelectModule],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.css'
})

export class AttendanceComponent implements OnInit{
  months = Array.from({ length: 12 }, (_, i) => ({
    value: new Date(2024, i),
    viewValue: new Intl.DateTimeFormat('en', { month: 'long' }).format(new Date(2024, i)),
  }));

  selectedMonth = this.months[7]; // Default: August
  days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  attendanceRecords: AttendanceRecord[] = [];
  calendarDates: { date: Date; status: string; subject_name: string  }[] = [];
  cid: string | null = null;
  subjectCount: number = 0;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.cid = localStorage.getItem('LRN');
    this.loadAttendance();
  }

  loadAttendance(): void {
    if (!this.cid) return console.error('LRN not found in local storage.');
    this.authService.getAttendance(this.cid).subscribe(
      (data: AttendanceRecord[]) => {
        this.attendanceRecords = data.map((record) => ({
          ...record,
          date: new Date(record.date),  // Ensure date is a Date object
        }));
        this.subjectCount = this.attendanceRecords[0]?.subject_count || 0;  // Get subject count from the first record
        this.updateCalendar();
      },
      (error) => console.error('Error fetching attendance:', error)
    );
  }
  showAllSubjectRecords(date: Date): void {
    // Fetch records for the selected date
    const recordsForDate = this.attendanceRecords.filter(record => 
      new Date(record.date).toDateString() === date.toDateString()
    );
  
    // Prepare modal content
    let modalContent = '<h2>' + date.toDateString() + '</h2>';
    
    if (recordsForDate.length === 0) {
      modalContent += '<p>No records available for this date.</p>';
    } else {
      modalContent += '<ul>';
      recordsForDate.forEach(record => {
        modalContent += `<li>${record.subject_name}: ${record.attendance_status}</li>`;
      });
      modalContent += '</ul>';
    }
  
    // Display modal using SweetAlert2
    Swal.fire({
      title: 'Subject Records',
      html: modalContent,
      showCloseButton: true,
      confirmButtonText: 'Close',
    });
  }
  
  handleDateClick(date: Date): void {
    this.showAllSubjectRecords(date);
  }

  updateCalendar(): void {
    const start = new Date(this.selectedMonth.value.getFullYear(), this.selectedMonth.value.getMonth(), 1);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
  
    // Create a map to hold attendance records by date
    const attendanceMap = new Map<string, { status: string; subject_name: string }>();
  
    // Populate the map with attendance records
    this.attendanceRecords.forEach((record) => {
      attendanceMap.set(new Date(record.date).toDateString(), {
        status: record.attendance_status,
        subject_name: record.subject_name,  // Include subject name
      });
    });
  
    // Create calendarDates with the required properties
    this.calendarDates = Array.from({ length: end.getDate() }, (_, i) => new Date(start.getFullYear(), start.getMonth(), i + 1))
      .filter((date) => date.getDay() >= 1 && date.getDay() <= 5) // Weekdays only
      .map((date) => {
        const attendance = attendanceMap.get(date.toDateString()) || { status: 'No Record', subject_name: 'N/A' };
        return {
          date,
          status: attendance.status,
          subject_name: attendance.subject_name,  // Include subject name
        };
      });
  }

  getAverageAttendance(): number {
    if (this.subjectCount === 0) return 0;  // Avoid division by zero
    const totalPresent = this.getTotalDaysPresent();  // Get the total present days
    return totalPresent / this.subjectCount;  // Calculate average attendance
  }

  onMonthClick(month: { value: Date; viewValue: string }): void {
    this.selectedMonth = month;
    this.updateCalendar();
  }

  getDaysOfSchool(month: Date): number {
    const start = new Date(month.getFullYear(), month.getMonth(), 1);
    const end = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    return Array.from({ length: end.getDate() }, (_, i) => new Date(start.getFullYear(), start.getMonth(), i + 1))
      .filter((date) => date.getDay() >= 1 && date.getDay() <= 5).length; // Weekdays only
  }

  getAttendanceForMonth(month: Date): number {
    return this.attendanceRecords.filter(
      (record) =>
        new Date(record.date).getMonth() === month.getMonth() &&
        new Date(record.date).getFullYear() === month.getFullYear() &&
        record.attendance_status === 'present'
    ).length;
  }

  getTotalDaysPresent(): number {
    return this.attendanceRecords.filter((record) => record.attendance_status === 'present').length;
  }

  getAttendanceClass(status: string): string {
    return { present: 'present', absent: 'absent', late: 'late' }[status] || 'no-record';
  }
  
  getTotalDaysOfSchool(): number {
    let totalDays = 0;
  
    this.months.forEach(month => {
      const startOfMonth = new Date(month.value.getFullYear(), month.value.getMonth(), 1);
      const endOfMonth = new Date(month.value.getFullYear(), month.value.getMonth() + 1, 0);
  
      for (let day = startOfMonth.getDate(); day <= endOfMonth.getDate(); day++) {
        const currentDate = new Date(month.value.getFullYear(), month.value.getMonth(), day);
        if (currentDate.getDay() >= 1 && currentDate.getDay() <= 5) {
          totalDays++;
        }
      }
    });
  
    return totalDays;
  }
  getCountForStatus(date: Date, status: string): number {
    // Count the number of attendance records with the specified status on the given date
    return this.attendanceRecords.filter(record => 
      new Date(record.date).toDateString() === date.toDateString() && record.attendance_status === status
    ).length;
  }
}
