export interface CalendarProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onSelectDate: (date: Date) => void;
  events: { date: Date; title: string; description?: string; time?: string }[];
  minYear: number;
}

export interface Event {
  date: Date;
  title: string;
  description?: string;
  time?: string;
}

export interface EventsModalProps {
  selectedDate: Date;
  events: Event[];
  onClose: () => void;
  onAddEvent: () => void;
  onEditEvent: (index: number) => void;
  onDeleteEvent: (index: number) => void;
  eventIndices: number[];
}

export interface EventFormProps {
  onSubmit: (event: {
    title: string;
    description?: string;
    time?: string;
  }) => void;
  onCancel: () => void;
  selectedDate: Date;
  editingEvent?: {
    date: Date;
    title: string;
    description?: string;
    time?: string;
  } | null;
}
