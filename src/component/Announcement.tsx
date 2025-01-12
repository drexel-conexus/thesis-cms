import React, { useEffect, useState, useCallback } from 'react';
import { Announcement } from '../constant/type';
import axios from 'axios';
import { API_BASE_URL } from '../constant/data';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Import icons
import AnnouncementForm from './AnnouncementForm';
import { useNavigate } from 'react-router-dom';

interface AnnouncementsProps {
  announcements: Announcement[];
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
        <div className="h-20 bg-gray-200 rounded mb-3"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/5"></div>
        </div>
      </div>
    </div>
  </div>
);

const Announcements: React.FC<AnnouncementsProps> = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAnnouncements = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const response = await axios.get<Announcement[]>(`${API_BASE_URL}/announcements`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
        navigate('/login');
      } else {
        setError('Failed to fetch announcements. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);


  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const handleAddAnnouncement = async (announcementData: Omit<Announcement, '_id'>) => {
    setIsSubmitting(true);
    try {
      let image = announcementData.image;
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      if (announcementData.file) {
        const formData = new FormData();
        formData.append('image', announcementData.file);
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

      const response = await axios.post<Announcement>(
        `${API_BASE_URL}/announcements`, 
        {...announcementData, image}, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setAnnouncements([...announcements, response.data]);
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error adding announcement:', error);
      setError('Failed to add announcement. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditAnnouncement = async (announcementId: string, announcementData: Omit<Announcement, '_id'>) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const response = await axios.patch<Announcement>(
        `${API_BASE_URL}/announcements/${announcementId}`, 
        announcementData, 
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setAnnouncements(announcements.map(announcement => 
        announcement._id === announcementId ? response.data : announcement
      ));
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error updating announcement:', error);
      setError('Failed to update announcement. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddClick = () => {
    setEditingAnnouncement(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setIsFormOpen(true);
  };

  const handleDeleteAnnouncement = async (announcementId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      await axios.delete(`${API_BASE_URL}/announcements/${announcementId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setAnnouncements(announcements.filter(announcement => announcement._id !== announcementId));
    } catch (error) {
      console.error('Error deleting announcement:', error);
      setError('Failed to delete announcement. Please try again.');
    }
  };

  const handleFormSubmit = (announcementData: Omit<Announcement, '_id'>) => {
    if (editingAnnouncement) {
      handleEditAnnouncement(editingAnnouncement._id, announcementData);
    } else {
      handleAddAnnouncement(announcementData);
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
        <h2 className="text-3xl font-bold text-gray-900">Announcements</h2>
        <button
          onClick={handleAddClick}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Announcement
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-transparent rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <AnnouncementForm  
              announcement={editingAnnouncement || undefined}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      )}

      {isLoading ? (
        <>
          <LoadingSkeleton />
          <LoadingSkeleton />
        </>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {announcements.map((announcement) => (
            <div 
              key={announcement._id} 
              className="bg-white rounded-lg border border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] overflow-hidden transform transition duration-200 hover:-translate-y-1 hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)]"
            >
              <div className="relative">
                {announcement.image && announcement.image.s3Url && (
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={announcement.image.s3Url}
                      alt={announcement.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => handleEditClick(announcement)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200"
                    aria-label="Edit announcement"
                  >
                    <FaEdit className="text-blue-500 w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteAnnouncement(announcement._id)}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors duration-200"
                    aria-label="Delete announcement"
                  >
                    <FaTrash className="text-red-500 w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  {announcement.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {announcement.body}
                </p>
                <div className="border-t pt-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>
                      {new Date(announcement.startDate).toLocaleDateString()} - {new Date(announcement.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{announcement.author}</span>
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

export default Announcements;
