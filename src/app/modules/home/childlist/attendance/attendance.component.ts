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
  attendance_status: string;
  subject_name: string;
  subject_count: number;
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
  months = Array.from({ length: 10 }, (_, i) => ({
    value: new Date(2024, 7 + i), // Start from August (month index 7)
    viewValue: new Intl.DateTimeFormat('en', { month: 'long' }).format(
      new Date(2024, 7 + i)
    ),
  }));

  selectedMonth = this.getCurrentMonth();
  days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  attendanceRecords: AttendanceRecord[] = [];
  calendarDates: { date: Date; status: string; subject_name: string }[] = [];
  cid: string | null = null;
  subjectCount: number = 0;
  attendanceByMonth: { [key: string]: number } = {};
  totalDaysPresent: number = 0;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.cid = localStorage.getItem('LRN');
    this.loadAttendance();
  }

  // Function to get the current month from the `months` array
  getCurrentMonth(): { value: Date; viewValue: string } {
    const currentMonth = new Date().getMonth();
    return (
      this.months.find(
        (month) =>
          month.value.getMonth() === currentMonth &&
          month.value.getFullYear() === new Date().getFullYear()
      ) || this.months[0] // Fallback to the first month if not found
    );
  }

  loadAttendance(): void {
    if (!this.cid) {
      console.error('LRN not found in local storage.');
      return;
    }
    this.authService.getAttendance(this.cid).subscribe(
      (data: AttendanceRecord[]) => {
        this.attendanceRecords = data.map((record) => ({
          ...record,
          date: new Date(record.date), // Ensure date is a Date object
        }));
        this.subjectCount = this.attendanceRecords[0]?.subject_count || 0; // Get subject count
        this.updateCalendar();
        this.calculateAttendanceByMonth();
      },
      (error) => console.error('Error fetching attendance:', error)
    );
  }

  calculateAttendanceByMonth(): void {
    this.totalDaysPresent = 0; // Reset total attendance count
    this.months.forEach((month) => {
      const daysPresentForMonth = this.getAttendanceForMonth(month.value);
      this.attendanceByMonth[month.viewValue] = daysPresentForMonth;
      this.totalDaysPresent += daysPresentForMonth; // Add the month's attendance to the total
    });
  }

  getAttendanceForMonth(month: Date): number {
    return this.calendarDates.filter(
      (dateInfo) =>
        dateInfo.date.getMonth() === month.getMonth() &&
        dateInfo.date.getFullYear() === month.getFullYear() &&
        (dateInfo.status === 'present' || dateInfo.status === 'late')  // Count both present and late
    ).length;
  }

  showAllSubjectRecords(date: Date): void {
    const recordsForDate = this.attendanceRecords.filter(
      (record) => record.date.toDateString() === date.toDateString()
    );

    let modalContent = `<h6>${date.toDateString()}</h6>`;

    if (recordsForDate.length === 0) {
      modalContent += '<p>No records available for this date.</p>';
    } else {
      modalContent += `
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left; word-wrap: break-word; white-space: normal; min-width: 200px;">Subject Name</th>
              <th style="border: 1px solid #ddd; padding: 8px; word-wrap: break-word; white-space: normal; min-width: 100px; word-break: break-word;">Status</th>
            </tr>
          </thead>
          <tbody>
      `;
      recordsForDate.forEach((record) => {
        modalContent += `
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px; text-align: left; word-wrap: break-word; white-space: normal; min-width: 200px;">${record.subject_name}</td>
            <td style="border: 1px solid #ddd; padding: 10px; word-wrap: break-word; white-space: normal; min-width: 100px; word-break: break-word;">${record.attendance_status}</td>
          </tr>
        `;
      });

      modalContent += '</tbody></table>';
    }

    Swal.fire({
      title: '',
      html: modalContent,
      showCloseButton: true,
      confirmButtonText: 'Close',
    });
  }

  handleDateClick(date: Date): void {
    this.showAllSubjectRecords(date);
  }

  updateCalendar(): void {
    const year = this.selectedMonth.value.getFullYear();
    const month = this.selectedMonth.value.getMonth();

    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);

    const filteredRecords = this.attendanceRecords.filter(
      (record) => record.date.getMonth() === month && record.date.getFullYear() === year
    );

    const attendanceMap = new Map<string, { status: string; subject_name: string }>();
    filteredRecords.forEach((record) => {
      attendanceMap.set(record.date.toDateString(), {
        status: record.attendance_status,
        subject_name: record.subject_name,
      });
    });

    this.calendarDates = Array.from({ length: end.getDate() }, (_, i) => {
      const date = new Date(year, month, i + 1);
      const attendance =
        attendanceMap.get(date.toDateString()) || { status: 'No Record', subject_name: 'N/A' };
      return {
        date,
        status: attendance.status,
        subject_name: attendance.subject_name,
      };
    }).filter((dateInfo) => dateInfo.date.getDay() >= 1 && dateInfo.date.getDay() <= 5);
  }

  getDaysOfSchool(month: Date): number {
    const start = new Date(month.getFullYear(), month.getMonth(), 1);
    const end = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    return Array.from({ length: end.getDate() }, (_, i) =>
      new Date(start.getFullYear(), start.getMonth(), i + 1)
    ).filter((date) => date.getDay() >= 1 && date.getDay() <= 5).length; // Weekdays only
  }

  getTotalDaysPresent(): number {
    return this.attendanceRecords.filter(
      (record) => record.attendance_status === 'present' || record.attendance_status === 'late'  // Count both present and late
    ).length;
  }

  getTotalDaysOfSchool(): number {
    return this.months.reduce((total, month) => total + this.getDaysOfSchool(month.value), 0);
  }

  getAttendanceClass(status: string): string {
    return { present: 'present', absent: 'absent', late: 'late' }[status] || '';
  }

  onMonthClick(month: { value: Date; viewValue: string }): void {
    this.selectedMonth = month;
    this.updateCalendar();
  }
}
