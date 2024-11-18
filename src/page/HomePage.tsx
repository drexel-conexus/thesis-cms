import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../assets/style.css'; 
import { API_BASE_URL } from '../constant/data';
import { Announcement, Event } from '../constant/type';
import AnnouncementModal from '../component/AnnouncementModal';
import EventModal from '../component/EventModal';

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

    const renderAnnouncementsContent = () => {
        if (loading) {
            return <div className="text-white">Loading announcements...</div>;
        }

        if (error) {
            return <div className="text-red-500">{error}</div>;
        }

        return (
            <div className="overflow-hidden">
                <div className="animate-scroll flex gap-3">
                    {[...announcements, ...announcements].map((announcement, index) => (
                        <div 
                            key={index} 
                            className="flex-shrink-0 w-64 bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                            onClick={() => setSelectedAnnouncement(announcement)}
                        >
                            <img 
                                src={announcement.image?.s3Url || '/images/default.png'} 
                                alt={announcement.title}
                                className="w-full h-32 object-cover"
                            />
                            <div className="p-3">
                                <h3 className="text-sm font-semibold text-gray-800 hover:text-green-500">
                                    {announcement.title}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderEventsContent = () => {
        if (eventsLoading) {
            return <div className="text-white">Loading events...</div>;
        }

        if (eventsError) {
            return <div className="text-red-500">{eventsError}</div>;
        }

        return (
            <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2">
                {events.map((event, index) => (
                    <div 
                        key={index}
                        className="bg-white rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                        onClick={() => setSelectedEvent(event)}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">{event.title}</h3>
                                <p className="text-sm text-gray-600">{event.subtitle}</p>
                            </div>
                            <div className="text-right">
                                <div className="text-green-500 font-semibold">{new Date(event.date).toLocaleDateString()}</div>
                            </div>
                        </div>
                    </div>
                ))}
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
                <nav className="flex-grow flex justify-center bg-green-500 text-white">
                    <ul className="flex space-x-6">
                        <li><a href="#" className="hover:underline">Home</a></li>
                        <li className="relative">
                            <button 
                                ref={buttonRef}
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="hover:underline focus:outline-none flex items-center"
                            >
                                About Us
                                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </button>
                            <ul 
                                ref={dropdownRef}
                                className={`absolute left-0 mt-2 w-48 bg-white text-black rounded-lg shadow-lg dropdown-content ${
                                    isDropdownOpen ? '' : 'hidden'
                                }`}
                            >
                                <li><a href="/history" className="block px-4 py-2 hover:bg-gray-200">Our History</a></li>
                                <li><a href="/mission" className="block px-4 py-2 hover:bg-gray-200">Mission & Vision</a></li>
                                <li><a href="/core-values" className="block px-4 py-2 hover:bg-gray-200">Core Values</a></li>
                                <li><a href="/faculty" className="block px-4 py-2 hover:bg-gray-200">Faculty and Staff</a></li>
                            </ul>
                        </li>
                    </ul>
                </nav>
            </header>

            <main className="flex-grow p-4 flex flex-col" style={{
                backgroundImage: "url('/images/bg.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: '0'
            }}>
                <div className="flex flex-col h-full">
                    <div className="flex flex-1 gap-4 mb-4">
                        <div className="flex-1"></div>
                        <div className="w-1/3 bg-gray-700 bg-opacity-50 p-4 h-[600px]">
                            <h2 className="text-2xl font-bold mb-4 text-green-500">Upcoming Events</h2>
                            {renderEventsContent()}
                        </div>
                    </div>

                    <div className="w-full bg-gray-700 bg-opacity-50 p-4">
                        <h2 className="text-2xl font-bold mb-4 text-green-500">Announcements</h2>
                        {renderAnnouncementsContent()}
                    </div>
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
};

export default HomePage;
