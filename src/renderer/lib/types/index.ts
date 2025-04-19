export type FilteredEventsType = {
  date: Date;
  commitment: string;
  description?: string;
  time?: string;
}[];

export type CurrentMonthHolidaysType = {
  date: number;
  name: string;
}[];
