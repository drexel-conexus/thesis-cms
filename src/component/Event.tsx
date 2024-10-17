import React, { useEffect, useState } from 'react';
import { Event } from '../constant/type';
import axios from 'axios';
import { API_BASE_URL } from '../constant/data';
import UserForm from './UserForm';
import EventForm from './EventForm';

interface EventsProps {
  events: Event[];
}

const Events: React.FC<EventsProps> = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get<Event[]>(`${API_BASE_URL}/events`);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to fetch events. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEvent = async (eventData: Omit<Event, '_id'>) => {
    try {
      const response = await axios.post<Event>(`${API_BASE_URL}/events`, eventData);
      setEvents([...events, response.data]);
    } catch (error) {
      console.error('Error adding event:', error);
      setError('Failed to add event. Please try again.');
    }
  };

  const handleEditEvent = async (eventId: string, eventData: Omit<Event, '_id'>) => {
    try {
      const response = await axios.patch<Event>(`${API_BASE_URL}/events/${eventId}`, eventData);
      setEvents(events.map(event => event._id === eventId ? response.data : event));
    } catch (error) {
      console.error('Error updating event:', error);
      setError('Failed to update event. Please try again.');
    }
  };

  const handleAddClick = () => {
    setEditingEvent(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (event: Event) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (eventData: Omit<Event, '_id'>) => {
    if (editingEvent) {
      handleEditEvent(editingEvent._id, eventData);
    } else {
      handleAddEvent(eventData);
    }
    setIsFormOpen(false);
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-green-600">Events</h2>
        <button
          onClick={handleAddClick}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Add Event
        </button>
      </div>
      {isFormOpen && (
        <div className="mb-4">
          <EventForm
            event={editingEvent || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </div>
      )}
      {events.map((event) => (
        <div key={event._id} className="mb-4 last:mb-0">
          <h3 className="text-lg font-semibold text-green-700">{event.title}</h3>
          <p className="text-gray-600">{event.subtitle}</p>
          <p className="text-gray-600">{event.body}</p>
          <p className="text-sm text-gray-500">{event.footer}</p>
          <p className="text-sm text-gray-500 mt-1">Date: {new Date(event.date).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};

export default Events;
