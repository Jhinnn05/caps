import { Component } from '@angular/core';
import { ChildlistComponent } from "./childlist/childlist.component";
import { AnnouncementComponent } from "./announcement/announcement.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ChildlistComponent, AnnouncementComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
