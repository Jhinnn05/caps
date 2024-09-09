import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { announcementroutes } from './announcement/announcement.route';
import { childlistroutes } from './childlist/childlist.route';




export const homeroutes: Routes = [
 {path:'home', component: HomeComponent,
    children: [
    { path: 'announcement', loadChildren: () => import('./announcement/announcement.route').then(r => announcementroutes) },
    { path: 'childlist', loadChildren: () => import('./childlist/childlist.route').then(r => childlistroutes) },
],
 },
{path: '', redirectTo: 'home', pathMatch: 'full'}
];
