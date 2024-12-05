import { Component, OnInit } from '@angular/core';
import { ChildlistComponent } from "./childlist/childlist.component";
import { AnnouncementComponent } from "./announcement/announcement.component";
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ChildlistComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
    
  constructor(auth:AuthService) {
    
  }
  ngOnInit(): void {
    
  }
  

  
}
