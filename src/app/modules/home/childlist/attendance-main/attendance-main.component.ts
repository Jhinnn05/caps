import { Component } from '@angular/core';
import { AttendanceComponent } from "../attendance/attendance.component";

@Component({
  selector: 'app-attendance-main',
  standalone: true,
  imports: [AttendanceComponent],
  templateUrl: './attendance-main.component.html',
  styleUrl: './attendance-main.component.css'
})
export class AttendanceMainComponent {

}
