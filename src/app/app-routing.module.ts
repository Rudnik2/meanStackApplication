import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { CalendarComponent } from './calendar/calendar.component';
import { GoalCreateComponent } from './goals/goal-create/goal-create.component';
import { GoalListComponent } from './goals/goal-list/goal-list.component';
import { MyGoalsComponent } from './goals/my-goals/my-goals.component';
import { MainPageComponent } from './main-page/main-page.component';
import { ProfileComponent } from './profile/profile.component';
import { RequestResetComponent } from './request-reset-password/request-reset-password.component';
import { ResponseResetComponent } from './response-reset-password/response-reset-password.component';
import { SearchComponent } from './search/search.component';
import { SummaryComponent } from './summary/summary.component';
import { MyTasksComponent } from './tasks/my-tasks/my-tasks.component';
import { TaskCreateComponent } from './tasks/task-create/task-create.component';
import { TaskListComponent } from './tasks/task-list/task-list.component';
import { verifiedWelcomePageComponent } from './verifiedWelcomePage/verifiedWelcomePage.component';


const routes: Routes = [
  {path:'',component: MainPageComponent},
  {path:'confirm/:confirmationCode',component: verifiedWelcomePageComponent},
  {path:'newsFeed',component: TaskListComponent,canActivate:[AuthGuard]},
  {path:'request-reset-password',component: RequestResetComponent},
  {path:'response-reset-password/:token',component: ResponseResetComponent},
  {path:'create',component:GoalCreateComponent,canActivate:[AuthGuard]},
  {path:'profile',component:ProfileComponent,canActivate:[AuthGuard]},
  {path:'profile/myGoals',component:MyGoalsComponent,canActivate:[AuthGuard]},
  {path:'profile/myGoals/:userId',component:MyGoalsComponent,canActivate:[AuthGuard]},
  {path:'profile/todayTasks',component:MyTasksComponent,canActivate:[AuthGuard]},
  {path:'profile/calendar',component:CalendarComponent,canActivate:[AuthGuard]},
  {path:'profile/summary',component:SummaryComponent,canActivate:[AuthGuard]},
  {path:'task',component:TaskCreateComponent,canActivate:[AuthGuard]},
  {path:'search',component:SearchComponent,canActivate:[AuthGuard]},
  {path:'profile/:userId',component:ProfileComponent,canActivate:[AuthGuard]},
  {path:'edit/:goalId',component:GoalCreateComponent,canActivate:[AuthGuard]},
  {path:'task/edit/:taskId',component:TaskCreateComponent,canActivate:[AuthGuard]},
  {path:"auth", loadChildren:()=>import("../app/auth/auth-routing.module").then(x=>x.AuthRoutingModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{onSameUrlNavigation: 'reload'})],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
