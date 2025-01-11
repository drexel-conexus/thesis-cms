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
        <div className="w-24 h-1 bg-gradient-to-r from-green-600 to-green-400 mx-auto mb-8"></div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto italic">
          "Nurturing minds, building futures, and fostering excellence in education"
        </p>
      </div>

      {/* Mission & Vision Cards */}
      <div className="grid md:grid-cols-2 gap-12">
        {/* Mission Card */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
          <div className="bg-gradient-to-r from-green-600 to-green-500 px-8 py-6 flex items-center space-x-4">
            <div className="bg-white/10 rounded-full p-3">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" 
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">Our Mission</h2>
          </div>
          <div className="p-8">
            <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-500">
              <p className="text-gray-700 leading-relaxed text-lg">
                {mission}
              </p>
            </div>
          </div>
        </div>

        {/* Vision Card */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
          <div className="bg-gradient-to-r from-green-500 to-green-400 px-8 py-6 flex items-center space-x-4">
            <div className="bg-white/10 rounded-full p-3">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" 
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">Our Vision</h2>
          </div>
          <div className="p-8">
            <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-400">
              <p className="text-gray-700 leading-relaxed text-lg">
                {vision}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Decoration */}
      <div className="mt-16 flex justify-center">
        <div className="w-16 h-1 bg-gradient-to-r from-green-600 to-green-400 rounded-full"></div>
      </div>
    </div>
  );
};

export default Mission; 