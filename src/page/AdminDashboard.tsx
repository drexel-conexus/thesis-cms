// HomePage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardData } from '../constant/data';
import Announcements from '../component/Announcement';
import Events from '../component/Event';
import Users from '../component/User';
import Home from '../component/home';
import AdminAdmissions from '../component/AdminAdmissions';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'announcements' | 'events' | 'user' | 'home' | 'pre-registration'>('announcements');

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
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-green-50">
      {/* Side Menu */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-4 flex-grow">
          <h2 className="text-2xl font-bold text-green-700 mb-4">Dashboard</h2>
          <nav>
            {['announcements', 'events', 'user', 'home', 'pre-registration'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`w-full text-left p-2 rounded mt-2 ${activeTab === tab ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:bg-green-50'}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>
        {/* Logout button */}
        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="block w-full py-2 px-4 text-center text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        <h1 className="text-4xl font-bold mb-6 text-green-700">Welcome to the Dashboard</h1>
        
        {/* Tab Content */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
