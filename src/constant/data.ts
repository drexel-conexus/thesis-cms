import { DashBoardData, UserType } from "./type";

export const dashboardData: DashBoardData = {
    announcements: [
      { id: 1, title: "New Feature", content: "We've launched a new feature...", date: "2024-08-15" },
      { id: 2, title: "Maintenance", content: "Scheduled maintenance will occur...", date: "2024-08-20" },
    ],
    events: [
      { _id: '1', title: "Annual Conference", subtitle: "Join us for our annual conference...", date: "2024-09-10", body: "Virtual" },
      { _id: '2', title: "Webinar", body: "Learn about our latest products...", date: "2024-09-15", subtitle: "Online" },
    ],
    users: [
        { _id: '1', email: "john@example.com", firstName: "John", lastName: "Doe", userType: UserType.ADMIN },
        { _id: '2', email: "jane@example.com", firstName: "Jane", lastName: "Smith", userType: UserType.USER },
        { _id: '3', email: "bob@example.com", firstName: "Bob", lastName: "Johnson", userType: UserType.USER },
      ],
      };
export const API_BASE_URL = 'http://localhost:8080';