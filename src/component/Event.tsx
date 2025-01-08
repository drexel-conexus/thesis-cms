import React, { useEffect, useState, useCallback } from 'react';
import { Event } from '../constant/type';
import axios from 'axios';
import { API_BASE_URL } from '../constant/data';
import EventForm from './EventForm';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Import icons
import { useNavigate } from 'react-router-dom';

interface EventsProps {
  events: Event[];
}

const Events: React.FC<EventsProps> = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const navigate = useNavigate();

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const response = await axios.get<Event[]>(`${API_BASE_URL}/events`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setEvents(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
        navigate('/login');
      } else {
        console.error('Error fetching events:', error);
        setError('Failed to fetch events. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleAddEvent = async (eventData: Omit<Event, '_id'>) => {
    try {
      let image = eventData.image;
      console.log(eventData.file);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      if (eventData.file) {
        const formData = new FormData();
        formData.append('image', eventData.file);
        const res = await axios.post(`${API_BASE_URL}/upload`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res) {
          image = {
            s3key: res.data.s3key,
          s3Url: res.data.s3Url,
          }
        }
      }
      const response = await axios.post<Event>(`${API_BASE_URL}/events`, {...eventData, image}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setEvents([...events, response.data]);
    } catch (error) {
      if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
        navigate('/login');
      } else {
        console.error('Error adding event:', error);
        setError('Failed to add event. Please try again.');
      }
    }
  };

  const handleEditEvent = async (eventId: string, eventData: Omit<Event, '_id'>) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const response = await axios.patch<Event>(`${API_BASE_URL}/events/${eventId}`, eventData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
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

  const handleDeleteEvent = async (eventId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
        await axios.delete(`${API_BASE_URL}/events/${eventId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setEvents(events.filter(event => event._id !== eventId));
    } catch (error) {
      if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
        navigate('/login');
      } else {
        console.error('Error deleting event:', error);
        setError('Failed to delete event. Please try again.');
      }
    }
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
        {isLoading && <div>Loading...</div>}
        {error && <div className="text-red-500">{error}</div>}
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
          <div key={event._id} className="mb-8 bg-white rounded-md shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-green-700">{event.title}</h3>
              <div>
                <button
                  onClick={() => handleEditClick(event)}
                  className="text-blue-500 hover:text-blue-600 mr-2"
                  aria-label="Edit event"
                >
                  <FaEdit size={20} />
                </button>
                <button
                  onClick={() => handleDeleteEvent(event._id)}
                  className="text-red-500 hover:text-red-600"
                  aria-label="Delete event"
                >
                  <FaTrash size={20} />
                </button>
              </div>
            </div>
            {event.image && event.image.s3Url && (
              <div className="mb-4 flex justify-center">
                <img
                  src={event.image.s3Url}
                  alt={event.title}
                  className="max-w-full h-auto max-h-48 object-contain"
                />
              </div>
            )}
            <p className="text-gray-600 mb-3">{event.subtitle}</p>
            <p className="text-gray-600 mb-4">{event.body}</p>
            <p className="text-sm text-gray-500 mb-1">{event.footer}</p>
            <p className="text-sm text-gray-500">Date: {new Date(event.date).toLocaleDateString()}</p>
          </div>
        </div>
        ))}
    </div>
  );
};

export default Events;
