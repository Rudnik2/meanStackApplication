export interface Task {
  id?: string|null;

  title?: string|null;
  content?: string|null;
  plannedDate?:Date|null;

  creator:string|null;
}

