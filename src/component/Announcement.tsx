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

const Announcements: React.FC<AnnouncementsProps> = () => {
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

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
    try {
      let image = announcementData.image;
      console.log(announcementData.file);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      if (announcementData.file) {
        const formData = new FormData();
        formData.append('image', announcementData.file);
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

      const response = await axios.post<Announcement>(`${API_BASE_URL}/announcements`, {...announcementData, image}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setAnnouncements([...announcements, response.data]);
    } catch (error) {
      console.error('Error adding announcement:', error);
      setError('Failed to add announcement. Please try again.');
    }
  };

  const handleEditAnnouncement = async (announcementId: string, announcementData: Omit<Announcement, '_id'>) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const response = await axios.patch<Announcement>(`${API_BASE_URL}/announcements/${announcementId}`, announcementData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setAnnouncements(announcements.map(announcement => announcement._id === announcementId ? response.data : announcement));
    } catch (error) {
      console.error('Error updating announcement:', error);
      setError('Failed to update announcement. Please try again.');
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
      await axios.delete(`${API_BASE_URL}/announcements/${announcementId}`);
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
        <h2 className="text-2xl font-bold text-green-600">Announcements</h2>
        <button
          onClick={handleAddClick}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Add Announcement
        </button>
      </div>
      {isFormOpen && (
        <div className="mb-4">  
          <AnnouncementForm  
            announcement={editingAnnouncement || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </div>
      )}
      {announcements.map((announcement) => (
        <div key={announcement._id} className="mb-8 bg-white rounded-md shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-green-700">{announcement.title}</h3>
            <div>
              <button
                onClick={() => handleEditClick(announcement)}
                className="text-blue-500 hover:text-blue-600 mr-2"
                aria-label="Edit announcement"
              >
                <FaEdit size={20} />
              </button>
              <button
                onClick={() => handleDeleteAnnouncement(announcement._id)}
                className="text-red-500 hover:text-red-600"
                aria-label="Delete announcement"
              >
                <FaTrash size={20} />
              </button>
            </div>
          </div>
          {announcement.image && announcement.image.s3Url && (
            <div className="mb-4 flex justify-center">
              <img
                src={announcement.image.s3Url}
                alt={announcement.title}
                className="max-w-full h-auto max-h-48 object-contain"
              />
            </div>
          )}
          
          <p className="text-gray-600 mb-3">{announcement.body}</p>
          <div className="text-sm text-gray-500">
            <p>Date: {new Date(announcement.startDate).toLocaleDateString()} - {new Date(announcement.endDate).toLocaleDateString()}</p>
            <p>Author: {announcement.author}</p>
          </div>
        </div>
      </div>
      ))}
    </div>
  );
};

export default Announcements;
