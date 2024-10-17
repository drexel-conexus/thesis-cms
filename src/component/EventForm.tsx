// EventForm.tsx
import React, { useState, useEffect } from 'react';
import { Event } from '../constant/type';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface EventFormProps {
  event?: Event;
  onSubmit: (event: Omit<Event, '_id'>) => void;
  onCancel: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ event, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Event, '_id'>>({
    title: '',
    subtitle: '',
    body: '',
    footer: '',
    date: new Date().toISOString(), // Change this to store a Date object
  });

  useEffect(() => {
    if (event) {
      setFormData(event);
    }
  }, [event]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date: Date | null) => {
    setFormData({ ...formData, date: date?.toISOString() || new Date().toISOString() });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-green-700">{event ? 'Edit Event' : 'Add Event'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full border text-gray-500 bg-green-100 border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>    
          <div>
            <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700">Subtitle</label>
            <input
              type="text"
              name="subtitle"
              id="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              required
              className="mt-1 block w-full border text-gray-500 bg-green-100 border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label htmlFor="body" className="block text-sm font-medium text-gray-700">Body</label>
            <textarea
              name="body"
              id="body"
              value={formData.body}
              onChange={handleChange}
              required
              className="mt-1 block w-full border text-gray-500 bg-green-100 border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label htmlFor="footer" className="block text-sm font-medium text-gray-700">Footer</label>
            <input
              type="text"
              name="footer"
              id="footer"
              value={formData.footer}
              onChange={handleChange}
              required
              className="mt-1 block w-full border text-gray-500 bg-green-100 border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
            <DatePicker
              selected={formData.date}
              onChange={handleDateChange}
              className="mt-1 block w-full border text-gray-500 bg-green-100 border-gray-300 rounded-md shadow-sm p-2"
              dateFormat="yyyy-MM-dd"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
              {event ? 'Update' : 'Add'} Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
