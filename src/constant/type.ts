
export type DashBoardData = {
    announcements: Announcement[];
    events: Event[];
    users: User[];
};

export interface Announcement {
    _id: string;
    title: string;
    author: string;
    body: string;
    image?:{
        s3key?: string;
        s3Url?: string;
    };
    startDate: string;
    endDate: string;
    file?: File;
  }
  
  export interface Event {
    _id: string;
    title: string;
    subtitle: string;
    body: string;
    footer?: string;
    date: Date;
    image: {
      s3key: string;
      s3Url: string;
    };
    file?: File;
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
  