import React from 'react';
import { coreValuesData } from '../constant/data';

const CoreValues: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-lg p-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{coreValuesData.Title}</h2>
          <div className="w-24 h-1 bg-green-500 mx-auto mb-6"></div>
          <p className="text-xl font-semibold text-green-600 mb-8">{coreValuesData.Subtitle}</p>
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {coreValuesData.Content}
          </p>
        </div>

        {/* Values Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {['Veritas', 'Unitas', 'Caritas'].map((value, index) => (
            <div key={index} className="text-center p-6 rounded-lg bg-green-50 hover:bg-green-100 transition-colors duration-300">
              <div className="flex justify-center mb-4">
                {index === 0 && (
                  <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                )}
                {index === 1 && (
                  <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
                {index === 2 && (
                  <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{value}</h3>
              <p className="text-gray-600">
                {index === 0 && "Truth - The pursuit of knowledge and understanding"}
                {index === 1 && "Unity - Coming together as one community"}
                {index === 2 && "Love - Serving with compassion and dedication"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoreValues; 