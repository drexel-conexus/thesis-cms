import React from 'react';
import { missionData } from '../constant/data';

const Mission: React.FC = () => {
  const [mission, vision] = missionData.Content.split('\n').map(text => text.trim());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {missionData.Title}
        </h1>
        <div className="w-24 h-1 bg-green-500 mx-auto mb-8"></div>
      </div>

      {/* Mission & Vision Cards */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
          <div className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">Our Mission</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-700 leading-relaxed">
              {mission}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
          <div className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">Our Vision</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-700 leading-relaxed">
              {vision}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mission; 