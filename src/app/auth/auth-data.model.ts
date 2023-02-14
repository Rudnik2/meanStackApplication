export interface AuthData{
  id?:string|null;
  Imie?:string|null;
  Nazwisko?:string|null;
  email?:string|null;
  password?: string|null;
  imagePath?: string|null;
  followers?:Array<string>|null;
  followings?:Array<string>|null;
  summaryType?: string|null; //tygodniowe czy miesięczne
  summaryNotificationDate?:Date|null; // data kiedy komunikat o podsumowanie się wyświetliło
  status?:string|null;
  confirmationCode?:string|null;
}

