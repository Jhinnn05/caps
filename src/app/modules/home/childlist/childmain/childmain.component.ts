import { Component } from '@angular/core';
import { FinanceStatementComponent } from '../finance-statement/finance-statement.component';
import { AnnouncementComponent } from '../../announcement/announcement.component';

@Component({
  selector: 'app-childmain',
  standalone: true,
  imports: [FinanceStatementComponent,AnnouncementComponent],
  templateUrl: './childmain.component.html',
  styleUrl: './childmain.component.css'
})
export class ChildmainComponent {

}
