import { Routes } from '@angular/router';
import { MessageComponent } from './message.component';
// import { Childlistcomponent } from './account.component';
// import { ChildlistComponent } from './childlist.component';

export const messageroutes: Routes = [
 {path:'message', component: MessageComponent},
{path: '', redirectTo: 'message', pathMatch: 'full'}
];
