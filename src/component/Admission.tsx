import { useState } from 'react';
import Card from '@mui/material/Card';
import AdmissionForm from './AdmissionForm';

const Admission = () => {
    const [showForm, setShowForm] = useState(false);
  
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
  
    return (
      <div className="flex flex-col w-full gap-4 p-4 bg-gray-50/80">
        {/* Button Container */}
        <div className="flex justify-end px-4">
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 text-sm rounded hover:bg-green-700 transition-colors duration-200 shadow-sm"
          >
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M12 4v16m8-8H4"
              />
            </svg>
            Submit Admission
          </button>
        </div>
  
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left Section */}
          <div className="lg:w-1/2 space-y-4">
            <div className="bg-yellow-400 p-4 rounded-lg">
              <div className="flex items-center gap-4">
                <img src="/images/logo.svg" alt="School Logo" className="w-16 h-16" />
                <div>
                  <h1 className="text-2xl font-bold text-green-800">SAN JOSE CATHOLIC SCHOOL</h1>
                  <p className="text-red-600">(Formerly San Jose Parochial School)</p>
                  <p className="text-sm">The AUGUSTINIANS - Since 1950</p>
                  <p className="text-sm">Plaza Libertad, Iloilo City</p>
                </div>
              </div>
            </div>
  
            <div className="bg-red-600 text-white text-center py-2 text-3xl font-bold">
              ENROLL NOW!
            </div>
  
            <div className="text-center text-xl">
              for S.Y. 2024-2025
            </div>
  
            <div className="text-center text-2xl italic text-red-600">
              We offer:
              <div className="font-bold">
                Pre-Elementary, Elementary
                <br />
                and Junior High School
              </div>
            </div>
  
            <Card className="p-4">
              <h2 className="text-xl font-bold text-red-600">REQUIREMENTS FOR NEW STUDENTS</h2>
              <ul className="list-disc pl-6 mt-2">
                {requirements.new.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
              <p className="text-sm text-green-700 mt-4">
                For incoming Grade7, additional slots for ESC grantees (government subsidy)
                are available in first come first serve basis only.
              </p>
            </Card>
  
            <Card className="p-4">
              <h2 className="text-xl font-bold text-red-600">REQUIREMENTS FOR OLD STUDENTS</h2>
              <ul className="list-disc pl-6 mt-2">
                {requirements.old.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </Card>
          </div>
  
          {/* Right Section */}
          <div className="lg:w-1/2 space-y-4">
            <div className="bg-gradient-to-r from-green-600 to-green-800 p-6 rounded-lg text-white">
              <h2 className="text-3xl italic font-script">Be part of our</h2>
              <h3 className="text-4xl font-script">Holistic-Augustinian</h3>
              <h3 className="text-4xl font-script">Education Community</h3>
            </div>
  
            <div className="bg-red-600 text-white text-center py-2 text-xl">
              NO TUITION FEE INCREASE!
            </div>
  
            <div className="bg-green-700 text-white p-4 rounded-lg">
              <div className="text-2xl font-bold mb-4">PEAC-GASTPE Accredited</div>
              
              <h3 className="text-xl font-bold mb-2">Entrance Examination Schedule:</h3>
              {schedules.map((schedule, index) => (
                <div key={index} className="mb-2">
                  <div className="font-bold">{schedule.days}</div>
                  {schedule.times.map((time, timeIndex) => (
                    <div key={timeIndex}>{time}</div>
                  ))}
                </div>
              ))}
            </div>
  
            {/* <div className="grid grid-cols-3 gap-2">
              {[...Array(9)].map((_, i) => (
                <img 
                  key={i}
                  src="/api/placeholder/120/120"
                  alt={`School activity ${i + 1}`}
                  className="w-full h-24 object-cover rounded"
                />
              ))}
            </div> */}
  
            <div className="text-center text-sm">
              For inquiries, please call the Registrar's Office at 326-47-65
              <br />
              or 336-19-21 or visit our school's official FaceBook page.
            </div>
          </div>
        </div>
  
        {showForm && <AdmissionForm onClose={() => setShowForm(false)} />}
      </div>
    );
  };
  
  export default Admission;
