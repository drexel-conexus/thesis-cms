import React, { useEffect, useState, useCallback } from 'react';
import { Event } from '../constant/type';
import axios from 'axios';
import { API_BASE_URL } from '../constant/data';
import EventForm from './EventForm';
import { FaEdit, FaTrash, FaCalendarAlt, FaPlus } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom';

interface EventsProps {
  events: Event[];
}

// Add loading skeleton component
const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-white rounded-lg border border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="flex space-x-2">
            <div className="h-6 w-6 bg-gray-200 rounded"></div>
            <div className="h-6 w-6 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="h-48 bg-gray-200 rounded mb-4"></div>
        <div className="h-16 bg-gray-200 rounded mb-3"></div>
        <div className="h-24 bg-gray-200 rounded mb-3"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  </div>
);

const Events: React.FC<EventsProps> = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    setIsSubmitting(true);
    try {
      let image = eventData.image;
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      if (eventData.file) {
        const formData = new FormData();
        formData.append('image', eventData.file);
        formData.append('fileType', 'image');
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
      const response = await axios.post<Event>(
        `${API_BASE_URL}/events`, 
        {...eventData, image}, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setEvents([...events, response.data]);
      setIsFormOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
        navigate('/login');
      } else {
        console.error('Error adding event:', error);
        setError('Failed to add event. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditEvent = async (eventId: string, eventData: Omit<Event, '_id'>) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const response = await axios.patch<Event>(
        `${API_BASE_URL}/events/${eventId}`, 
        eventData, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setEvents(events.map(event => event._id === eventId ? response.data : event));
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error updating event:', error);
      setError('Failed to update event. Please try again.');
    } finally {
      setIsSubmitting(false);
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
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Events</h2>
        <button
          onClick={handleAddClick}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
        >
          <FaPlus className="-ml-1 mr-2 h-4 w-4" />
          Add Event
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-transparent rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <EventForm
              event={editingEvent || undefined}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <LoadingSkeleton />
          <LoadingSkeleton />
          <LoadingSkeleton />
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div 
              key={event._id} 
              className="bg-white rounded-lg border border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] overflow-hidden transform transition duration-200 hover:-translate-y-1 hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)]"
            >
              <div className="relative">
                {event.image && event.image.s3Url && (
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={event.image.s3Url}
                      alt={event.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => handleEditClick(event)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200"
                    aria-label="Edit event"
                  >
                    <FaEdit className="text-blue-500 w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event._id)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200"
                    aria-label="Delete event"
                  >
                    <FaTrash className="text-red-500 w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  {event.title}
                </h3>
                <p className="text-gray-600 mb-3 line-clamp-2">
                  {event.subtitle}
                </p>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {event.body}
                </p>
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-500 mb-2 line-clamp-1">{event.footer}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <FaCalendarAlt className="mr-2 h-4 w-4 text-gray-400" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
