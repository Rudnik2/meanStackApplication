export interface Task {
  id?: string|null;

  title?: string|null;
  content?: string|null;
  plannedDate?:Date|null;

  creator?:string|null;
  creatorName?:string|null;
  creatorImage?:string|null;
  isDone?:boolean;
  taskComplitionDate?:Date|null;
  repeatable?:boolean;
}

