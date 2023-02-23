import { animate, state, style, transition, trigger } from "@angular/animations";
import { Component,OnDestroy,OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CalendarEvent, CalendarEventTimesChangedEvent, CalendarView } from "angular-calendar";
import { isSameDay, isSameMonth } from "date-fns";
import { Subject, Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { AuthData } from "../auth/auth-data.model";
import { Goal } from "../goals/goal.model";
import { GoalsService } from "../goals/goals.service";
import { Task } from "../tasks/task.model";
import { TasksService } from "../tasks/tasks.service";

@Component({
  selector:'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit,OnDestroy{

  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  isNextDisable = true;
  mode="myProfile";
  goals:Goal[] = [];
  tasks:Task[] = [];
  alreadyFollowed = false; // na poczatku nie followujemy
  users: AuthData[];
  user: AuthData={
    id:null,
    Imie:null,
    Nazwisko:null,
    email:null,
    password:null,
    imagePath:null,
    followers:null,
    followings:null
  };
  myGoals:Goal[]=[];
  myTasks:Task[]=[];
  myCompletedTasks: Task[] = [];

  viewDate: Date;

  modalData: {
    action: string;
    event: CalendarEvent;
  };
  refresh = new Subject<void>();
  activeDayIsOpen: boolean = false;
  events: CalendarEvent[]=[];

  startOfTheMonth: Date; // sprawdzic czy zgadza sie miesiac
  endOfTheMonth: Date;

  startOfTheWeek: Date; // sprawdzic czy zgadza sie miesiac
  endOfTheWeek: Date;


  isLoading = false;
  userIsAuthenticated = false;
  userId!: string;
  form: FormGroup;
  imagePreview: string|null|ArrayBuffer;

  constructor(private modal: NgbModal,public goalsService: GoalsService,public route: ActivatedRoute,private authService: AuthService,private tasksService: TasksService){}

  private tasksSub: Subscription = new Subscription;
  private goalsSub: Subscription = new Subscription;
  private authStatusSub: Subscription = new Subscription;

  ngOnInit(){
    if(this.viewDate==null){
      this.viewDate = new Date();
    }
    this.setDates();
    this.isLoading = true;
    this.userId = this.authService.getUserId();

    if(!this.goalsSub.closed){
      this.goalsService.getGoals();
    this.goalsSub = this.goalsService.getGoalsUpdateListener().subscribe((goals: Goal[])=>{
      this.isLoading = false;
      this.goals=goals;
      for(let goal of this.goals){
        if(this.userIsAuthenticated&&goal.creator==this.userId){
          this.myGoals.push(goal);
        }
      }
    });
    }

    if(!this.tasksSub.closed){
      this.tasksService.getTasks();
      this.tasksSub = this.tasksService.getTasksUpdateListener().subscribe((tasks: Task[])=>{
        this.isLoading = false;
        this.tasks=tasks;
        for(let task of this.tasks){
          let taskDate = new Date(task.taskComplitionDate!);
          task.taskComplitionDate = taskDate;
        }
      });
    }

    if(!this.authStatusSub.closed){
      this.userIsAuthenticated = this.authService.getIsAuth();
      this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated=>{
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });
    }
   }

  ngOnDestroy(){
    this.goalsSub.unsubscribe();
    this.tasksSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  setView(view: CalendarView) {
    this.view = view;
  }
  setDates(){

    const now = new Date();

    if(isSameMonth(this.viewDate,now)&&isSameDay(this.viewDate,now)){
      this.isNextDisable = true;
    }else{
      this.isNextDisable = false;
    }

    this.startOfTheWeek = new Date(this.viewDate);
    this.endOfTheWeek = new Date(this.viewDate);

    this.startOfTheMonth = new Date(this.viewDate);
    this.endOfTheMonth = new Date(this.viewDate);

    this.startOfTheMonth.setDate(this.startOfTheMonth.getDate()-this.startOfTheMonth.getDate()+1);
    this.startOfTheMonth.setHours(0);
    this.startOfTheMonth.setMinutes(0);
    this.startOfTheMonth.setSeconds(0);


    this.startOfTheWeek.setDate(this.startOfTheWeek.getDate()-this.startOfTheWeek.getDay()+1);
    this.startOfTheWeek.setHours(0);
    this.startOfTheWeek.setMinutes(0);
    this.startOfTheWeek.setSeconds(0);

    this.endOfTheWeek.setDate(this.endOfTheWeek.getDate()+(7-this.endOfTheWeek.getDay()));
    this.endOfTheWeek.setHours(23);
    this.endOfTheWeek.setMinutes(59);
    this.endOfTheWeek.setSeconds(59);

    this.endOfTheMonth.setDate(this.endOfTheMonth.getDate()+(31-this.endOfTheMonth.getDate()));
    this.endOfTheMonth.setHours(23);
    this.endOfTheMonth.setMinutes(59);
    this.endOfTheMonth.setSeconds(59);
  }

  changeDate() {
    this.activeDayIsOpen = false;
    this.setDates();
  }

}
