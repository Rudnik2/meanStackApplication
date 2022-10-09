import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { CalendarComponent } from './calendar/calendar.component';
import { GoalCreateComponent } from './goals/goal-create/goal-create.component';
import { GoalListComponent } from './goals/goal-list/goal-list.component';
import { MyGoalsComponent } from './goals/my-goals/my-goals.component';
import { ProfileComponent } from './profile/profile.component';
import { MyTasksComponent } from './tasks/my-tasks/my-tasks.component';
import { TaskCreateComponent } from './tasks/task-create/task-create.component';


const routes: Routes = [
  {path:'',component: GoalListComponent},
  {path:'create',component:GoalCreateComponent,canActivate:[AuthGuard]},
  {path:'profile',component:ProfileComponent,canActivate:[AuthGuard]},
  {path:'profile/myGoals',component:MyGoalsComponent,canActivate:[AuthGuard]},
  {path:'profile/todayTasks',component:MyTasksComponent,canActivate:[AuthGuard]},
  {path:'profile/calendar',component:CalendarComponent,canActivate:[AuthGuard]},
  {path:'task',component:TaskCreateComponent,canActivate:[AuthGuard]},
  {path:'edit/:goalId',component:GoalCreateComponent,canActivate:[AuthGuard]},
  {path:"auth", loadChildren:()=>import("../app/auth/auth-routing.module").then(x=>x.AuthRoutingModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
