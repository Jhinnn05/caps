import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../../../auth.service';

interface AttendanceRecord {
  date: Date;
  attendance_status: 'present' | 'absent' | 'late';
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
  months = [
    { value: new Date(2024, 7), viewValue: 'August' },
    { value: new Date(2024, 8), viewValue: 'September' },
    { value: new Date(2024, 9), viewValue: 'October' },
    { value: new Date(2024, 10), viewValue: 'November' },
    { value: new Date(2024, 11), viewValue: 'December' },
    { value: new Date(2024, 0), viewValue: 'January' },
    { value: new Date(2024, 1), viewValue: 'February' },
    { value: new Date(2024, 2), viewValue: 'March' },
    { value: new Date(2024, 3), viewValue: 'April' },
    { value: new Date(2024, 4), viewValue: 'May' },
  ];
  
  selectedMonth: any = this.months[7]; // Default to August
  days = [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  attendanceRecords: AttendanceRecord[] = [];
  cid: string | null = null; // LRN
  
  calendarDates: { date: Date, attendanceStatus: string }[] = []; // Store the fetched dates for the current month
  // Assuming `month.value` is in a Date or number format (e.g., month index from 0 to 11)
  currentMonth = new Date().getMonth(); // gets the current month index (0 = January, 1 = February, etc.)

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadCidFromLocalStorage();
    this.loadAttendance();
    this.refreshCalendarDates(); // Initial calendar loading
  }

  loadCidFromLocalStorage(): void {
    this.cid = localStorage.getItem('LRN');
  }

  loadAttendance(): void {
    if (this.cid) {
        this.authService.getAttendance(this.cid).subscribe(data => {
            this.attendanceRecords = data;
            console.log('Fetched attendance records:', this.attendanceRecords);
            this.refreshCalendarDates();  // Call this to refresh the calendar with attendance data
        }, error => {
            console.error('Error fetching attendance records:', error);
        });
    } else {
        console.error('LRN not found in local storage.');
    }
}


getCalendarDates(): { date: Date, attendanceStatus: string }[] {
  const startOfMonth = new Date(this.selectedMonth.value.getFullYear(), this.selectedMonth.value.getMonth(), 1);
  const endOfMonth = new Date(this.selectedMonth.value.getFullYear(), this.selectedMonth.value.getMonth() + 1, 0);
  const datesWithStatus: { date: Date, attendanceStatus: string }[] = [];

  // Create a map to store attendance status by date
  const attendanceMap: Map<string, string> = new Map();

  // Populate the attendanceMap with attendance records fetched from the database
  this.attendanceRecords.forEach(record => {
      const recordDate = new Date(record.date).toDateString(); // Convert to string for easy comparison
      attendanceMap.set(recordDate, record.attendance_status);
  });

  // Loop through each day in the selected month (only weekdays)
  for (let day = startOfMonth.getDate(); day <= endOfMonth.getDate(); day++) {
      const currentDate = new Date(this.selectedMonth.value.getFullYear(), this.selectedMonth.value.getMonth(), day);
      
      // Only include weekdays (Monday to Friday, i.e., day index 1-5)
      if (currentDate.getDay() >= 1 && currentDate.getDay() <= 5) {
          const dateKey = currentDate.toDateString();  // Convert to string to match with the attendanceMap
          const status = attendanceMap.get(dateKey) || 'No Record';  // Default to 'No Record' if no status is found

          // Add the date and status to the result array
          datesWithStatus.push({
              date: currentDate,
              attendanceStatus: status
          });
      }
  }

  return datesWithStatus;
}

  onMonthClick(month: { value: Date; viewValue: string }): void {
    this.selectedMonth = month; // Update the selected month
    this.refreshCalendarDates(); // Refresh the calendar to display weekdays
  }

  refreshCalendarDates(): void {
    this.calendarDates = this.getCalendarDates(); // Refresh dates for the current month
  }

  getAttendanceForMonth(month: Date): number {
    // Filter attendanceRecords to count how many days are marked 'Present' for the selected month
    return this.attendanceRecords.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() === month.getMonth() && recordDate.getFullYear() === month.getFullYear() && record.attendance_status === 'present';
    }).length;
  }

  getTotalDaysPresent(): number {
    // Calculate total days present from all attendance records
    return this.attendanceRecords.filter(record => record.attendance_status === 'present').length;
  }
  /**
   * Method to calculate the total number of school days (Monday to Friday) across all selected months.
   */
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
  getDaysOfSchool(month: Date): number {
    let totalDays = 0;
    const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
    const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);

    for (let day = startOfMonth.getDate(); day <= endOfMonth.getDate(); day++) {
        const currentDate = new Date(month.getFullYear(), month.getMonth(), day);
        // Only count weekdays (Monday to Friday)
        if (currentDate.getDay() >= 1 && currentDate.getDay() <= 5) {
            totalDays++;
        }
    }

    return totalDays;
}
getAttendanceClass(status: string): string {
  switch (status) {
    case 'present':
      return 'present';
    case 'absent':
      return 'absent';
    case 'late':
      return 'late';
    default:
      return 'no-record'; // Default class for "No Record"
  }
}

}
