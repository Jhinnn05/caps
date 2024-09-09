import { Routes } from '@angular/router';
import { AnnouncementComponent } from './announcement.component';
// import { Childlistcomponent } from './account.component';



export const announcementroutes: Routes = [
 {path:'announcement', component: AnnouncementComponent},
{path: '', redirectTo: 'announcement', pathMatch: 'full'}
];
