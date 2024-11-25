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

export const coreValuesData = {
  Title:    "Augustinian Core Values",
  Subtitle: "Veritas, Unitas, Caritas",
  Content:  "\"In Deum\" is a Latin phrase which means \"on the way to God\" or \"towards God\". This is taken from the famous Augustinian dictum \"ANIMA UNA ET COR UNUM IN DEUM\" translated as \"ONE MIND and ONE HEART on the way to GOD\". This expression manifests our collective awareness that in everything we do, we offer it in the name and for the glory of God. By greeting each other \"In Deum\", we wish to recognize in ourselves God's infinite and sustaining generosity as we journey back to Him.",
}

export const missionData = {
  Title: "Mission & Vision",
  Content: "An Augustinian Basic Education community that aims to develop and nurture competitive and disciplined learners through virtue and science. \n To develop responsible learners who are equipped with values, competencies, and skills for the need of local and global society.",
}