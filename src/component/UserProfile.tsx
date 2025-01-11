import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../constant/data';
import ChangePassword from './ChangePassword';

interface UserData {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: string;
  image?: {
    s3key: string;
    s3Url: string;
  };
}

const UserProfile: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get(`${API_BASE_URL}/users/current`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUserData(response.data);
      } catch (err) {
        if (axios.isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 403)) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else {
          setError('Failed to fetch user profile');
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);
        
        const token = localStorage.getItem('token');
        const uploadResponse = await axios.post(`${API_BASE_URL}/upload`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const updateResponse = await axios.patch(
          `${API_BASE_URL}/users/${userData?._id}`,
          { image: uploadResponse.data },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setUserData(updateResponse.data);
      } catch (err) {
        console.error('Failed to upload image:', err);
      } finally {
        setUploading(false);
      }
    }
  };

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!userData) return <div>No profile data available</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-8">
          <div className="flex items-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-6 mr-6 relative group cursor-pointer"
              onClick={handleImageClick}
            >
              {uploading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              ) : (
                <>
                  {userData.image?.s3Url ? (
                    <img
                      src={userData.image.s3Url}
                      alt={`${userData.firstName}'s profile`}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <img
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${userData.firstName}%20${userData.lastName}`}
                      alt={`${userData.firstName}'s avatar`}
                      className="w-20 h-20 rounded-full"
                    />
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full flex items-center justify-center transition-all duration-200">
                    <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">
                {`${userData.firstName} ${userData.lastName}`}
              </h3>
              <p className="text-green-100 text-lg">@{userData.email.split('@')[0]}</p>
            </div>
          </div>
        </div>
        
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-green-50 rounded-lg p-6">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-medium text-green-600 uppercase tracking-wide">
                  Account Information
                </h4>
                <button
                  onClick={() => setShowChangePassword(true)}
                  className="text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  Change Password
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Email Address</label>
                  <p className="text-lg font-medium text-gray-900">{userData.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Role</label>
                  <p className="text-lg font-medium text-gray-900 capitalize">{userData.userType}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-6">
              <h4 className="text-sm font-medium text-green-600 uppercase tracking-wide mb-3">
                Personal Information
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">First Name</label>
                  <p className="text-lg font-medium text-gray-900">{userData.firstName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Name</label>
                  <p className="text-lg font-medium text-gray-900">{userData.lastName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showChangePassword && userData && (
        <ChangePassword
          userId={userData._id}
          onClose={() => setShowChangePassword(false)}
        />
      )}
    </div>
  );
};

export default UserProfile; 