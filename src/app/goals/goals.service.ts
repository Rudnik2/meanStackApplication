import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Goal } from "./goal.model";
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import { Router } from "@angular/router";
import {environment} from "../../environments/environment.prod";

const BACKEND_URL = environment.apiUrl+"/goals/";

@Injectable({providedIn: 'root'})
export class GoalsService{
  private goals: Goal[]=[];
  private goalsUpdated = new Subject<Goal[]>();



  constructor(private http: HttpClient,private router: Router){}

  getGoals(){
    this.http.get<{message:string,goals:any}>(BACKEND_URL).pipe(map((goalData)=>{
        return goalData.goals.map((goal: {
          title: any;
           Poziom3: any;
            Poziom2: any;
             Poziom1: any;
              Poziom3Date: any;
               Poziom2Date: any;
                Poziom1Date: any;
                 _id: any;
                 Inspiration:any;
                 reasonWhy:any;
                 Failure:any;
                 creator: any})=>{
          return {
              title: goal.title,
              Poziom3: goal.Poziom3,
              Poziom3Date:goal.Poziom3Date,

              Poziom2: goal.Poziom2,
              Poziom2Date:goal.Poziom2Date,

              Poziom1: goal.Poziom1,
              Poziom1Date:goal.Poziom1Date,

              Inspiration: goal.Inspiration,
              reasonWhy: goal.Inspiration,
              Failure: goal.Failure,
              id: goal._id,
              creator: goal.creator
          };
        });
    })).subscribe((transformedGoals)=>{
      this.goals = transformedGoals;
      this.goalsUpdated.next([...this.goals]);
    });
  }
  getGoalsUpdateListener(){
    return this.goalsUpdated.asObservable();
  }
  getGoal(id:string){
    return this.http.get<{
      _id:string,
      title:string,

      Poziom3:string,
      Poziom3Date:number,

      Poziom2:string,
      Poziom2Date:number,

      Poziom1:string,
      Poziom1Date:number,

      Inspiration: string,
      reasonWhy:string,
      Failure:string,

      creator:string}>(BACKEND_URL+id);
  }

  addGoal(
     title: string,
     Poziom3: string,
     poziom3Date:number,

     Poziom2: string,
     poziom2Date:number,

     Poziom1: string,
     poziom1Date:number,
     Inspiration:string,
     reasonWhy: string,
     Failure:string){

    const goal: Goal = {
      id:null,
      title:title,
      Poziom3:Poziom3,Poziom3Date:poziom3Date,
      Poziom2:Poziom2,Poziom2Date:poziom2Date,
      Poziom1:Poziom1,Poziom1Date:poziom1Date,

      Inspiration:Inspiration,
      reasonWhy:reasonWhy,
      Failure:Failure,
      creator:null};

    this.http.post<{message: string, goalId: string}>(BACKEND_URL,goal).subscribe((responseData)=>{
      const id = responseData.goalId;
      goal.id = id;
      this.goals.push(goal);
      this.goalsUpdated.next([...this.goals]);
      this.router.navigate(["/newsFeed"]);
    });
  }

  updateGoals(
    id:string,title:string,
    Poziom3:string,poziom3Date:number,
    Poziom2:string,poziom2Date:number,
    Poziom1:string,poziom1Date:number,
    Inspiration:string,
    reasonWhy: string,
    Failure:string){

    const goal: Goal = {
      id:id,
      title:title,
      Poziom3:Poziom3,
      Poziom3Date:poziom3Date,
      Poziom2:Poziom2,
      Poziom2Date:poziom2Date,
      Poziom1:Poziom1,
      Poziom1Date:poziom1Date,
      Inspiration:Inspiration,
      reasonWhy:reasonWhy,
      Failure:Failure,
      creator:null};

    this.http.put(BACKEND_URL+id,goal).subscribe(response=>{
      const updatedGoals = [...this.goals];
      const oldGoalIndex = updatedGoals.findIndex(p=>p.id === goal.id);
      updatedGoals[oldGoalIndex]=goal;
      this.goals=updatedGoals;
      this.goalsUpdated.next([...this.goals]);
      this.router.navigate(["/newsFeed"]);
    });
  }

  deleteGoal(goalId:string){
    this.http.delete(BACKEND_URL+goalId).subscribe(()=>{
      const updatedGoals = this.goals.filter(goal=>goal.id !== goalId);
      this.goals = updatedGoals;
      this.goalsUpdated.next([...this.goals]);
    });
  }

}
