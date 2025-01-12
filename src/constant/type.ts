export enum GradeLevel {
  NURSERY = 'nursery',
  PRE_KINDER = 'pre-kinder',
  KINDER = 'kinder',
  GRADE_1 = 'grade-1',
  GRADE_2 = 'grade-2',
  GRADE_3 = 'grade-3',
  GRADE_4 = 'grade-4',
  GRADE_5 = 'grade-5',
  GRADE_6 = 'grade-6',
  GRADE_7 = 'grade-7',
  GRADE_8 = 'grade-8',
  GRADE_9 = 'grade-9',
  GRADE_10 = 'grade-10',
  GRADE_11 = 'grade-11',
  GRADE_12 = 'grade-12'
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
  