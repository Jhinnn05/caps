import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { FinanceStatementComponent } from './finance-statement/finance-statement.component';
import { ChildmainComponent } from './childmain/childmain.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-childlist',
  standalone: true,
  imports: [RouterLink,RouterModule,ChildmainComponent,CommonModule],
  templateUrl: './childlist.component.html',
  styleUrl: './childlist.component.css'
})
export class ChildlistComponent implements OnInit{
  ngOnInit(): void {
    this.selectChild(this.children[0]);
  }
  children = [
    { name: 'Jhonnel Manaois', yearLevel: 12, section: 'A', schoolYear: '2024-2025' },
    { name: 'Mario Ofiaza III', yearLevel: 12, section: 'B', schoolYear: '2024-2025' },
    { name: 'Glenson Lozada', yearLevel: 11, section: 'A', schoolYear: '2024-2025' }
    // Add more children here
  ];

  // Selected child and default content
  selectedChild: any = null;
  content: string = 'finance'; // Default content to show (grades/attendance/finance)

  selectChild(child: any) {
    this.selectedChild = child;
    // Default to showing grades when a child is selected
    this.content = 'finance';
  }

  // Method to change content (grades, attendance, finance)
  changeContent(contentType: string) {
    this.content = contentType;
  }
}
