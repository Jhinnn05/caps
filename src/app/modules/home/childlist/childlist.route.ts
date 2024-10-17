import { Routes } from '@angular/router';
// import { Childlistcomponent } from './account.component';
import { ChildlistComponent } from './childlist.component';
import { Component } from '@angular/core';
import { FinanceStatementComponent } from './finance-statement/finance-statement.component';
import { ChildmainComponent } from './childmain/childmain.component';
import { AcadsrecordComponent } from './acadsrecord/acadsrecord.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { AcadsmainComponent } from './acadsmain/acadsmain.component';
import { AttendanceMainComponent } from './attendance-main/attendance-main.component';
// import { announcementroutes } from '../announcement/announcement.route';
export const childlistroutes: Routes = [
    {
    path:'childmain',component:ChildmainComponent,
    children:[
        {path:'finance', component: FinanceStatementComponent},
        {path: '', redirectTo: 'finance', pathMatch: 'full'},
        ],
    
    },
    {path:'acadsmain',component:AcadsmainComponent,
    children:[
        {path:'acadsrecord',component:AcadsrecordComponent},
        {path: '', redirectTo: 'acadsrecord', pathMatch: 'full'},
        ]
    },
    
    {path:'attendancemain',component:AttendanceMainComponent,
        children:[
            {path:'attendance',component:AttendanceComponent},
            {path: '', redirectTo: 'attendance', pathMatch: 'full'},
            ]
    },
    
    {path: '', redirectTo: 'childmain', pathMatch: 'full'}

];
