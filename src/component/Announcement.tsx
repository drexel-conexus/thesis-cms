// Announcements.tsx
import React from 'react';
import { Announcement } from '../constant/type';

interface AnnouncementsProps {
  announcements: Announcement[];
}

const Announcements: React.FC<AnnouncementsProps> = ({ announcements }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-green-600">Announcements</h2>
      {announcements.map((announcement) => (
        <div key={announcement.id} className="mb-4 last:mb-0">
          <h3 className="text-lg font-semibold text-green-700">{announcement.title}</h3>
          <p className="text-gray-600">{announcement.content}</p>
          <p className="text-sm text-gray-500 mt-1">Date: {announcement.date}</p>
        </div>
      ))}
    </div>
  );
};

export default Announcements;