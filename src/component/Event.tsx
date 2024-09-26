import React from 'react';
import { Event } from '../constant/type';

interface EventsProps {
  events: Event[];
}

const Events: React.FC<EventsProps> = ({ events }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-green-600">Events</h2>
      {events.map((event) => (
        <div key={event._id} className="mb-4 last:mb-0">
          <h3 className="text-lg font-semibold text-green-700">{event.title}</h3>
          <p className="text-gray-600">{event.subtitle}</p>
          <p className="text-gray-600">{event.body}</p>
          <p className="text-sm text-gray-500">{event.footer}</p>
          <p className="text-sm text-gray-500 mt-1">Date: {event.date}</p>
        </div>
      ))}
    </div>
  );
};

export default Events;