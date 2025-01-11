import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AdmissionForm from './AdmissionForm';

const Admission: React.FC = () => {
  const requirements = {
    new: [
      'Original Copy of Report Card',
      'Original Copy of Good Moral',
      'Photocopy of Birth Certificate (PSA)',
      'Photocopy of Baptismal Certificate',
      '2 copies of 2" by 2" ID Picture with white background'
    ],
    old: [
      'Original Copy of Report Card',
      '2 copies of 2" by 2" ID Picture with white background'
    ]
  };

  const schedules = [
    {
      days: 'Monday to Friday',
      times: ['8:00am-11:00am', '1:30pm-4:00pm']
    },
    {
      days: 'Saturday',
      times: ['8:00am-11:00am']
    }
  ];

  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-green-500 h-96">
        <div className="absolute inset-0">
          <img 
            src="/images/admission.jpeg" 
            alt="Students in classroom" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Join Our Academic Community
            </h1>
            <p className="text-xl md:text-2xl text-green-100 max-w-2xl">
              Begin your journey towards excellence with our comprehensive education program
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10 pb-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Info Cards */}
          {[
            {
              title: 'Admission Process',
              description: 'Simple and straightforward admission process to help you get started',
              icon: (
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              )
            },
            {
              title: 'Requirements',
              description: 'Check the requirements and prepare necessary documents',
              icon: (
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )
            },
            {
              title: 'Schedule',
              description: 'View important dates and deadlines for admission',
              icon: (
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )
            }
          ].map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="bg-green-50 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                {card.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h3>
              <p className="text-gray-600">{card.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Requirements Section */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          {/* New Students Requirements */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Requirements for New Students</h2>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                {requirements.new.map((req, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">
                  For incoming Grade 7, additional slots for ESC grantees (government subsidy)
                  are available on a first-come, first-served basis only.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Old Students Requirements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-green-500 to-green-400 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Requirements for Old Students</h2>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                {requirements.old.map((req, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Schedule Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8 bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Entrance Examination Schedule</h2>
          </div>
          <div className="p-6 grid md:grid-cols-2 gap-6">
            {schedules.map((schedule, index) => (
              <div key={index} className="bg-green-50 rounded-lg p-4">
                <h3 className="font-bold text-green-800 mb-2">{schedule.days}</h3>
                <ul className="space-y-1">
                  {schedule.times.map((time, timeIndex) => (
                    <li key={timeIndex} className="text-green-600">{time}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 text-center bg-white rounded-lg shadow-lg p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2">For inquiries, please contact:</h3>
          <p className="text-gray-600">
            Registrar's Office: <span className="font-medium">326-47-65</span> or <span className="font-medium">336-19-21</span>
            <br />
            Or visit our school's official Facebook page
          </p>
        </motion.div>

        {/* Pre-Registration Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-12 text-center"
        >
          <button
            onClick={() => setShowForm(true)}
            className="group relative px-8 py-4 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg 
              hover:from-green-500 hover:to-green-400 transition-all duration-300 
              transform hover:scale-105 text-lg font-semibold shadow-lg hover:shadow-2xl"
          >
            <span className="flex items-center justify-center">
              <svg 
                className="w-6 h-6 mr-2 group-hover:animate-bounce" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
              Start Pre-Registration
            </span>
            <div className="absolute inset-0 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white to-white opacity-0 group-hover:opacity-20 transform translate-y-full group-hover:translate-y-0 transition-all duration-300"></div>
            </div>
          </button>
        </motion.div>

        {/* Modal Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 overflow-y-auto"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setShowForm(false);
                }
              }}
            >
              <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity" />
              <div className="flex min-h-full items-center justify-center p-4">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all w-full max-w-4xl"
                >
                  <AdmissionForm onClose={() => setShowForm(false)} />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
      </div>
    </div>
  );
};

export default Admission;
