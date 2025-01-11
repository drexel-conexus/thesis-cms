export enum GradeLevel {
    NURSERY = 'Nursery',
    PRE_KINDER = 'Pre-Kinder',
    KINDER = 'Kinder',
    GRADE_1 = 'Grade 1',
    GRADE_2 = 'Grade 2',
    GRADE_3 = 'Grade 3',
    GRADE_4 = 'Grade 4',
    GRADE_5 = 'Grade 5',
    GRADE_6 = 'Grade 6',
    GRADE_7 = 'Grade 7',
    GRADE_8 = 'Grade 8',
    GRADE_9 = 'Grade 9',
    GRADE_10 = 'Grade 10',
    GRADE_11 = 'Grade 11',
    GRADE_12 = 'Grade 12'
}

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
  