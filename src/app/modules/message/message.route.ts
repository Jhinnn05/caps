
import { Routes } from '@angular/router';
import { MessagepageComponent } from './messagepage/messagepage.component';
import { SendComponent } from './send/send.component';
import { ViewComponent } from './view/view.component';
import { ViewMessageComponent } from './view-message/view-message.component';

export const messageroutes: Routes = [
    {path: 'messagepage', component: MessagepageComponent,
        children: [
            {path: 'messages', component: SendComponent, 
                children: [
                    {path: 'view/:sid', component: ViewComponent},
                ]
            },
            {path: '', redirectTo: 'messages', pathMatch: 'full'}
        ]
    },
    {path: '', redirectTo:'messagepage', pathMatch: 'full'}
];