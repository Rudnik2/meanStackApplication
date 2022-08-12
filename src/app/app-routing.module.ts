import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { GoalCreateComponent } from './goals/goal-create/goal-create.component';
import { GoalListComponent } from './goals/goal-list/goal-list.component';


const routes: Routes = [
  {path:'',component: GoalListComponent},
  {path:'create',component:GoalCreateComponent,canActivate:[AuthGuard]},
  {path:'edit/:goalId',component:GoalCreateComponent,canActivate:[AuthGuard]},
  {path:"auth", loadChildren:()=>import("../app/auth/auth-routing.module").then(x=>x.AuthRoutingModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
