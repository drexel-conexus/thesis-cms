// HomePage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL, dashboardData } from '../constant/data';
import Announcements from '../component/Announcement';
import Events from '../component/Event';
import Users from '../component/User';
import Home from '../component/home';
import AdminAdmissions from '../component/AdminAdmissions';
import axios from 'axios';
import UserProfile from '../component/UserProfile';

interface UserData {
  _id: string;
  firstName: string;
  userType: string;
  image?: {
    s3key: string;
    s3Url: string;
  };
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'announcements' | 'events' | 'user' | 'home' | 'pre-registration' | 'profile'>('announcements');
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const response = await axios.get(`${API_BASE_URL}/users/current`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(response.data);
      } catch (err) {
        if (axios.isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 403)) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else {
          console.error(err);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'announcements':
        return <Announcements announcements={dashboardData.announcements} />;
      case 'events':
        return <Events events={dashboardData.events} />;
      case 'user':
        return <Users users={dashboardData.users} />;
      case 'home':
        return <Home />;
      case 'pre-registration':
        return <AdminAdmissions />;
      case 'profile':
        return <UserProfile />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-green-50">
      {/* Side Menu - Add sticky and height classes */}
      <div className="w-64 bg-white shadow-lg flex flex-col sticky top-0 h-screen">
        <div className="p-4 flex-grow overflow-y-auto">
          {/* User Profile Section at Top */}
          <div className="mb-6 pb-4 border-b border-gray-200">
            <div className="flex items-center space-x-3 mb-3">
              <div className="bg-green-100 rounded-full p-2 w-12 h-12 flex items-center justify-center overflow-hidden">
                {userData?.image?.s3Url ? (
                  <img
                    src={userData.image.s3Url}
                    alt={`${userData.firstName}'s profile`}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <img
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${userData?.firstName || 'User'}`}
                    alt="User avatar"
                    className="w-full h-full rounded-full"
                  />
                )}
              </div>
              <button
                onClick={() => setActiveTab('profile')}
                className="text-left hover:text-green-600 flex-1"
              >
                <div className="font-medium text-gray-900">@{userData?.firstName || 'User'}</div>
                <div className="text-sm text-gray-500">{userData?.userType || 'Loading...'}</div>
              </button>
            </div>
          </div>

          {/* Rest of the navigation */}
          <h2 className="text-2xl font-bold text-green-700 mb-4">Dashboard</h2>
          <nav className="space-y-1">
            {['announcements', 'events', 'user', 'home', 'pre-registration'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`w-full text-left p-2 rounded flex items-center ${
                  activeTab === tab ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-green-50'
                }`}
              >
                {tab === 'profile' && (
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
        {/* Logout button - Add sticky bottom */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <button 
            onClick={handleLogout}
            className="block w-full py-2 px-4 text-center text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content - Add overflow handling */}
      <div className="flex-1 p-10 overflow-auto">
        <h1 className="text-4xl font-bold mb-6 text-green-700">Welcome to the Dashboard</h1>
        <div className="bg-white shadow-lg rounded-lg p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
