
export type DashBoardData = {
    announcements: Announcement[];
    events: Event[];
    users: User[];
};

export interface Announcement {
    id: number;
    title: string;
    content: string;
    date: string;
  }
  
  export interface Event {
    _id: string;
    title: string;
    subtitle: string;
    body: string;
    footer?: string;
    date: string;
  }
  
  export enum UserType {
    SU = 'su',
    ADMIN = 'admin',
    USER = 'user',
  }
  
  export interface User {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    userType: UserType;
    password?: string;
  }
  