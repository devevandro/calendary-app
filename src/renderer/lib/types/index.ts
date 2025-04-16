export type FilteredEventsType = {
  date: Date;
  title: string;
  description?: string;
  time?: string;
}[];

export type CurrentMonthHolidaysType = {
  date: number;
  name: string;
}[];
