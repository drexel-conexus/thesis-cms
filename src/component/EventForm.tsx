// EventForm.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Event } from '../constant/type';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaTimes } from 'react-icons/fa';

interface EventFormProps {
  event?: Event;
  onSubmit: (event: Omit<Event, '_id'>) => void;
  onCancel: () => void;
}

interface FormData {
  title: string;
  subtitle: string;
  body: string;
  footer?: string;
  date: string;
  image: {
    s3key: string;
    s3Url: string;
  };
  file?: File;
}

const EventForm: React.FC<EventFormProps> = ({ event, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    subtitle: '',
    body: '',
    date: new Date().toISOString(),
    image: { s3key: '', s3Url: '' }
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (event) {
        const { ...eventData } = event;
        setFormData({
            ...eventData,
            date: new Date(event.date).toISOString(),
            footer: event.footer || ''
        });
    }
  }, [event]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date: Date | null) => {
    setFormData({ ...formData, date: date?.toISOString() || new Date().toISOString() });
  };

  const handleImageRemove = () => {
    setFormData({
      ...formData,
      image: { s3key: '', s3Url: '' },
      file: undefined,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, file });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
        ...formData,
        date: new Date(formData.date)
    });
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
              className="mt-1 block w-full border text-gray-500 bg-green-100 border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
            <DatePicker
              selected={formData.date ? new Date(formData.date) : null}
              onChange={handleDateChange}
              className="mt-1 block w-full border text-gray-500 bg-green-100 border-gray-300 rounded-md shadow-sm p-2"
              dateFormat="yyyy-MM-dd"
              required
            />
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="hidden"
            />
            <div
              onClick={handleImageClick}
              className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer"
            >
              {formData.image.s3Url || formData.file ? (
                          <>
                          <img src={formData.file ? URL.createObjectURL(formData.file) : formData.image.s3Url} alt="Uploaded" className="max-h-48 object-contain" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleImageRemove();
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <FaTimes size={16} />
                          </button>
                        </>
              ) : (
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                    >
                      <span>Upload a file</span>
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
            </div>
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
