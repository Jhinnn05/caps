import { Component } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { FinanceStatementComponent } from './finance-statement/finance-statement.component';
import { ChildmainComponent } from './childmain/childmain.component';

@Component({
  selector: 'app-childlist',
  standalone: true,
  imports: [RouterLink,RouterModule,ChildmainComponent],
  templateUrl: './childlist.component.html',
  styleUrl: './childlist.component.css'
})
export class ChildlistComponent {

}
