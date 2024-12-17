import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../assets/style.css'; 
import { API_BASE_URL, coreValuesData, missionData } from '../constant/data';
import { Announcement, Event } from '../constant/type';
import AnnouncementModal from '../component/AnnouncementModal';
import EventModal from '../component/EventModal';
import { SchoolCalendar } from '../component/Calendar';
import Admission from '../component/Admission';
import { Box, Typography, Paper, Divider } from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import facultyData from '../assets/faculty.json';

// Update ActiveSection type
type ActiveSection = 'home' | 'calendar' | 'mission' | 'core-values' | 'faculty' | 'admission' | 'announcements';

// Add custom arrow components
const CustomArrow = ({ direction, onClick }: { direction: 'prev' | 'next', onClick?: () => void }) => (
  <button
    onClick={onClick}
    className={`absolute z-10 top-1/2 transform -translate-y-1/2 ${
      direction === 'prev' ? 'left-4' : 'right-4'
    } bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all duration-200`}
  >
    {direction === 'prev' ? (
      <IoChevronBackOutline size={24} />
    ) : (
      <IoChevronForwardOutline size={24} />
    )}
  </button>
);

const HomePage: React.FC = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLUListElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [eventsLoading, setEventsLoading] = useState(true);
    const [eventsError, setEventsError] = useState<string | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [activeSection, setActiveSection] = useState<ActiveSection>('home');
    const [homeImages, setHomeImages] = useState<{ s3Url: string; title?: string }[]>([]);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${API_BASE_URL}/announcements`);
                setAnnouncements(res.data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch announcements');
                console.error('Error fetching announcements:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncements();
    }, []);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setEventsLoading(true);
                const res = await axios.get(`${API_BASE_URL}/events`);
                setEvents(res.data);
                setEventsError(null);
            } catch (err) {
                setEventsError('Failed to fetch events');
                console.error('Error fetching events:', err);
            } finally {
                setEventsLoading(false);
            }
        };

        fetchEvents();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current && 
                buttonRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchHomeImages = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/asset/home`);
                if (response.data && response.data.images) {
                    setHomeImages(response.data.images);
                }
            } catch (err) {
                console.error('Error fetching home images:', err);
            }
        };

        fetchHomeImages();
    }, []);

    const renderAnnouncementsContent = () => {
        if (loading) {
            return <div className="text-gray-500 text-center py-4">Loading announcements...</div>;
        }

        if (error) {
            return <div className="text-red-500 text-center py-4">{error}</div>;
        }

        return (
            <div className="relative">
                <Carousel
                    showStatus={false}
                    showThumbs={false}
                    showIndicators={false}
                    centerMode={true}
                    centerSlidePercentage={33.33}
                    className="mx-[-1rem]"
                    renderArrowPrev={(clickHandler) => (
                        <CustomArrow direction="prev" onClick={clickHandler} />
                    )}
                    renderArrowNext={(clickHandler) => (
                        <CustomArrow direction="next" onClick={clickHandler} />
                    )}
                >
                    {announcements.map((announcement, index) => (
                        <div key={announcement._id || index} className="px-2 py-4">
                            <div 
                                className="bg-gradient-to-b from-white to-green-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-green-100 hover:border-green-300 group h-[400px] flex flex-col"
                                onClick={() => setSelectedAnnouncement(announcement)}
                            >
                                <div className="relative w-full h-48">
                                    <div className="absolute inset-0 bg-green-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10"></div>
                                    <img 
                                        src={announcement.image?.s3Url || '/images/default.png'}
                                        alt={announcement.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 p-5 flex flex-col">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
                                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-800 line-clamp-1 group-hover:text-green-600 transition-colors duration-200">
                                            {announcement.title}
                                        </h3>
                                    </div>
                                    <p className="text-gray-600 text-sm line-clamp-3 flex-1">
                                        {announcement.body}
                                    </p>
                                    <div className="mt-4 text-green-600 text-sm font-medium flex items-center gap-1 group-hover:text-green-700">
                                        Read more
                                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </Carousel>
            </div>
        );
    };

    const renderEventsContent = () => {
        if (eventsLoading) {
            return <div className="text-gray-500 text-center py-4">Loading events...</div>;
        }

        if (eventsError) {
            return <div className="text-red-500 text-center py-4">{eventsError}</div>;
        }

        return (
            <div className="relative">
                <Carousel
                    showStatus={false}
                    showThumbs={false}
                    showIndicators={false}
                    centerMode={true}
                    centerSlidePercentage={33.33}
                    className="mx-[-1rem]"
                    renderArrowPrev={(clickHandler) => (
                        <CustomArrow direction="prev" onClick={clickHandler} />
                    )}
                    renderArrowNext={(clickHandler) => (
                        <CustomArrow direction="next" onClick={clickHandler} />
                    )}
                >
                    {events.map((event, index) => (
                        <div key={index} className="px-2 py-4">
                            <div 
                                className="bg-gradient-to-b from-white to-green-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-green-100 hover:border-green-300 group h-[400px] flex flex-col"
                                onClick={() => setSelectedEvent(event)}
                            >
                                <div className="relative w-full h-48">
                                    <div className="absolute inset-0 bg-green-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10"></div>
                                    <img
                                        src={event.image?.s3Url}
                                        alt={event.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 p-5 flex flex-col">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
                                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <span className="text-green-700 text-sm font-semibold">
                                            {new Date(event.date).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800 line-clamp-1 group-hover:text-green-600 transition-colors duration-200">
                                        {event.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm line-clamp-2 flex-1">
                                        {event.subtitle}
                                    </p>
                                    <div className="mt-4 text-green-600 text-sm font-medium flex items-center gap-1 group-hover:text-green-700">
                                        Learn more
                                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </Carousel>
            </div>
        );
    };

    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-white text-green-500">
                <div className="flex items-center p-4">
                    <img src="/images/logo.svg" className="h-24 w-auto mr-6 ml-24" alt="School Logo" />
                    <h1 className="text-2xl font-bold">SAN JOSE CATHOLIC SCHOOL</h1>
                </div>
                <nav className="flex-grow flex justify-center bg-green-500 text-white relative">
                    <ul className="flex space-x-6 py-4">
                        <li>
                            <button 
                                onClick={() => setActiveSection('home')}
                                className={`hover:underline ${activeSection === 'home' ? 'underline' : ''}`}
                            >
                                Home
                            </button>
                        </li>
                        <li className="relative">
                            <button 
                                ref={buttonRef}
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="hover:underline focus:outline-none flex items-center"
                            >
                                About Us
                                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <ul 
                                ref={dropdownRef}
                                className={`absolute left-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg dropdown-content z-50 ${
                                    isDropdownOpen ? '' : 'hidden'
                                }`}
                            >
                                <li>
                                    <button 
                                        onClick={() => {
                                            setActiveSection('mission');
                                            setIsDropdownOpen(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                                    >
                                        Mission & Vision
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        onClick={() => {
                                            setActiveSection('core-values');
                                            setIsDropdownOpen(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                                    >
                                        Core Values
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        onClick={() => {
                                            setActiveSection('faculty');
                                            setIsDropdownOpen(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                                    >
                                        Faculty and Staff
                                    </button>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <button 
                                onClick={() => setActiveSection('announcements')}
                                className={`hover:underline ${activeSection === 'announcements' ? 'underline' : ''}`}
                            >
                                Announcements
                            </button>
                        </li>
                        <li>
                            <button 
                                onClick={() => setActiveSection('calendar')}
                                className={`hover:underline ${activeSection === 'calendar' ? 'underline' : ''}`}
                            >
                                School Calendar
                            </button>
                        </li>
                        <li>
                            <button 
                                onClick={() => setActiveSection('admission')}
                                className={`hover:underline ${activeSection === 'admission' ? 'underline' : ''}`}
                            >
                                Admission
                            </button>
                        </li>
                    </ul>
                </nav>
            </header>

            <main className="flex-grow" style={{ minHeight: '0' }}>
                <div className="flex flex-col">
                    {renderContent()}
                </div>
            </main>

            <footer className="bg-gray-200 text-center p-2">
                © 2024 SAN JOSE CATHOLIC SCHOOL
            </footer>

            {selectedAnnouncement && (
                <AnnouncementModal 
                    announcement={selectedAnnouncement}
                    onClose={() => setSelectedAnnouncement(null)}
                />
            )}

            {selectedEvent && (
                <EventModal 
                    event={selectedEvent}
                    onClose={() => setSelectedEvent(null)}
                />
            )}
        </div>
    );

    // Add new renderContent function
    function renderContent() {
        switch (activeSection) {
            case 'home':
                return (
                    <div className="space-y-8">
                        {/* Image Carousel */}
                        <div className="w-full relative aspect-[16/9]">
                            <Carousel
                                autoPlay
                                infiniteLoop
                                showStatus={false}
                                showThumbs={false}
                                interval={5000}
                                className="w-full h-full"
                                showIndicators={false}
                                renderArrowPrev={(clickHandler) => (
                                    <CustomArrow direction="prev" onClick={clickHandler} />
                                )}
                                renderArrowNext={(clickHandler) => (
                                    <CustomArrow direction="next" onClick={clickHandler} />
                                )}
                            >
                                {homeImages.map((image, index) => (
                                    <div key={index} className="w-full relative aspect-[16/9]">
                                        <img
                                            src={image.s3Url}
                                            alt="Carousel image"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                ))}
                            </Carousel>
                        </div>

                        {/* Events and Announcements Section */}
                        <div className="container mx-auto px-4 space-y-8">
                            {/* Events Section */}
                            <div className="bg-gradient-to-br from-green-50 to-white rounded-lg shadow-lg p-6 border border-green-100">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h2 className="text-3xl font-bold text-green-600">Upcoming Events</h2>
                                        <p className="text-green-700 mt-1">Stay updated with our latest events</p>
                                    </div>
                                    <button
                                        onClick={() => setActiveSection('calendar')}
                                        className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg active:transform active:scale-95"
                                    >
                                        Show More
                                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                                {renderEventsContent()}
                            </div>

                            {/* Announcements Section */}
                            <div className="bg-gradient-to-br from-green-50 to-white rounded-lg shadow-lg p-6 border border-green-100">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h2 className="text-3xl font-bold text-green-600">Announcements</h2>
                                        <p className="text-green-700 mt-1">Latest updates and news</p>
                                    </div>
                                    <button
                                        className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg active:transform active:scale-95"
                                        onClick={() => setActiveSection('announcements')}
                                    >
                                        View All
                                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                                {renderAnnouncementsContent()}
                            </div>
                        </div>
                    </div>
                );

            case 'calendar':
                return (
                    <SchoolCalendar />
                );

            case 'mission':
                return (
                    <Box className="bg-gray-700 bg-opacity-50 p-6 rounded-lg">
                        <Typography variant="h3" className="mb-6 text-green-500 font-bold text-center">
                            {missionData.Title}
                        </Typography>
                        
                        <Paper elevation={3} className="p-8">
                            <Box className="space-y-8">
                                <Box>
                                    <Typography variant="h4" className="text-green-700 font-semibold mb-4">
                                        Mission
                                    </Typography>
                                    <Typography variant="h6" className="text-gray-700 leading-relaxed">
                                        {missionData.Content.split('\n')[0]}
                                    </Typography>
                                </Box>

                                <Divider />

                                <Box>
                                    <Typography variant="h4" className="text-green-700 font-semibold mb-4">
                                        Vision
                                    </Typography>
                                    <Typography variant="h6" className="text-gray-700 leading-relaxed">
                                        {missionData.Content.split('\n')[1]}
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Box>
                );

            case 'core-values':
                return (
                    <Box className="bg-gray-700 bg-opacity-50 p-6 rounded-lg">
                        <Typography variant="h3" className="mb-6 text-green-500 font-bold text-center">
                            {coreValuesData.Title}
                        </Typography>
                        
                        <Paper elevation={3} className="p-8">
                            <Typography variant="h4" className="text-center mb-6 text-green-700 font-semibold">
                                {coreValuesData.Subtitle}
                            </Typography>
                            
                            <Divider className="my-6" />
                            
                            <Box className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                                {['Veritas', 'Unitas', 'Caritas'].map((value) => (
                                    <Paper key={value} elevation={2} className="p-6 text-center bg-green-50">
                                        <Typography variant="h4" className="text-green-700 font-bold mb-3">
                                            {value}
                                        </Typography>
                                        <Typography variant="h5" className="text-gray-600">
                                            {value === 'Veritas' && 'Truth'}
                                            {value === 'Unitas' && 'Unity'}
                                            {value === 'Caritas' && 'Love'}
                                        </Typography>
                                    </Paper>
                                ))}
                            </Box>

                            <Typography variant="h6" className="text-gray-700 leading-relaxed text-center">
                                {coreValuesData.Content}
                            </Typography>
                        </Paper>
                    </Box>
                );

            case 'faculty':
                return (
                    <div className="container mx-auto px-4 py-8">
                        <div className="bg-gradient-to-br from-green-50 to-white rounded-lg shadow-lg p-6 border border-green-100">
                            <h2 className="text-3xl font-bold text-green-600 mb-8 text-center">Faculty and Staff</h2>
                            
                            {/* Administrators Section */}
                            <div className="mb-12">
                                <h3 className="text-2xl font-semibold text-green-700 mb-6 border-b-2 border-green-200 pb-2">
                                    School Administrators
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {facultyData.administrators.map((admin, index) => (
                                        <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
                                            <h4 className="text-lg font-bold text-gray-800 mb-2">{admin.name}</h4>
                                            <div className="space-y-1">
                                                {admin.titles.map((title, idx) => (
                                                    <span 
                                                        key={idx} 
                                                        className="inline-block bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full mr-2 mb-2"
                                                    >
                                                        {title}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Academic Staff Section */}
                            <div className="mb-12">
                                <h3 className="text-2xl font-semibold text-green-700 mb-6 border-b-2 border-green-200 pb-2">
                                    Academic Staff
                                </h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {facultyData.academic_staff.map((staff, index) => (
                                        <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
                                            <h4 className="text-lg font-bold text-gray-800 mb-2">{staff.name}</h4>
                                            <div className="mb-3">
                                                {staff.titles.map((title, idx) => (
                                                    <span 
                                                        key={idx} 
                                                        className="inline-block bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full mr-2 mb-2"
                                                    >
                                                        {title}
                                                    </span>
                                                ))}
                                            </div>
                                            {staff.subjects && (
                                                <div className="border-t pt-3">
                                                    <p className="text-sm text-gray-600 font-medium mb-2">Subjects:</p>
                                                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                                        {staff.subjects.map((subject, idx) => (
                                                            <li key={idx}>{subject}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Support Staff Sections */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {/* Non-Academic Staff */}
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h3 className="text-xl font-semibold text-green-700 mb-4 border-b-2 border-green-200 pb-2">
                                        Non-Academic Staff
                                    </h3>
                                    <div className="space-y-4">
                                        {facultyData.non_academic_staff.map((staff, index) => (
                                            <div key={index} className="border-b border-gray-100 last:border-0 pb-2 last:pb-0">
                                                <p className="font-medium text-gray-800">{staff.name}</p>
                                                <p className="text-sm text-gray-600">{staff.titles[0]}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Medical & Dental Staff */}
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h3 className="text-xl font-semibold text-green-700 mb-4 border-b-2 border-green-200 pb-2">
                                        Medical & Dental Staff
                                    </h3>
                                    <div className="space-y-4">
                                        {facultyData.medical_dental_staff.map((staff, index) => (
                                            <div key={index} className="border-b border-gray-100 last:border-0 pb-2 last:pb-0">
                                                <p className="font-medium text-gray-800">{staff.name}</p>
                                                <p className="text-sm text-gray-600">{staff.titles[0]}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Support Staff */}
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h3 className="text-xl font-semibold text-green-700 mb-4 border-b-2 border-green-200 pb-2">
                                        Support Staff
                                    </h3>
                                    <div className="space-y-4">
                                        {facultyData.support_staff.map((staff, index) => (
                                            <div key={index} className="border-b border-gray-100 last:border-0 pb-2 last:pb-0">
                                                <p className="font-medium text-gray-800">{staff.name}</p>
                                                <p className="text-sm text-gray-600">{staff.titles[0]}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'admission':
                return (
                    <Admission />
                );

            case 'announcements':
                return (
                    <div className="container mx-auto px-4 py-8">
                        <div className="bg-gradient-to-br from-green-50 to-white rounded-lg shadow-lg p-6 border border-green-100">
                            <h2 className="text-3xl font-bold text-green-600 mb-8">School Announcements</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {announcements.map((announcement, index) => (
                                    <div 
                                        key={announcement._id || index}
                                        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-green-100 hover:border-green-300 group"
                                        onClick={() => setSelectedAnnouncement(announcement)}
                                    >
                                        <div className="relative h-48">
                                            <div className="absolute inset-0 bg-green-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300 z-10"></div>
                                            <img 
                                                src={announcement.image?.s3Url || '/images/default.png'}
                                                alt={announcement.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="p-5">
                                            <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors duration-200">
                                                {announcement.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                                                {announcement.body}
                                            </p>
                                            <div className="text-green-600 text-sm font-medium flex items-center gap-1 group-hover:text-green-700">
                                                Read more
                                                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    }
};

export default HomePage;
