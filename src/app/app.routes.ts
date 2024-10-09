import { Routes } from '@angular/router';
import { SidenavComponent } from './sidenav/sidenav.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { accountroutes } from './modules/account/account.route';
import { childlistroutes } from './modules/home/childlist/childlist.route';
import { messageroutes } from './modules/message/message.route';
import { homeroutes } from './modules/home/home.route';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    {path: 'login',component:LoginComponent},
    {path: 'main', component: MainpageComponent,
        children:[
            { path: 'account', loadChildren: () => import('./modules/account/account.route').then(r => accountroutes) },
            { path: 'home', loadChildren: () => import('./modules/home/home.route').then(r => homeroutes) },
            { path: 'message', loadChildren: () => import('./modules/message/message.route').then(r => messageroutes) },
        { path: '', redirectTo: 'home', pathMatch: 'full' }
      ],
    
    },
    {path: '',redirectTo: 'login',pathMatch:'full'}

];
