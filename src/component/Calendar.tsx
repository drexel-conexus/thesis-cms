/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';
import { API_BASE_URL } from '../constant/data';
import axios from 'axios';
import { Event } from '../constant/type';
import { EventsList } from './EventsList';

interface SchoolCalendarProps {
    events?: Event[];
}

export const SchoolCalendar: React.FC<SchoolCalendarProps> = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    // Helper function to convert month name to number (0-11)
    const getMonthNumber = (monthName: string): number => {
        const months = {
            'January': 0, 'February': 1, 'March': 2, 'April': 3,
            'May': 4, 'June': 5, 'July': 6, 'August': 7,
            'September': 8, 'October': 9, 'November': 10, 'December': 11
        };
        return months[monthName as keyof typeof months];
    };

    const fetchEvents = async (month?: number) => {
      try {
          setLoading(true);
          const query = month ? `?month=${month}` : '';
          const { data } = await axios.get(`${API_BASE_URL}/events/web/current-month${query}`);
          console.log(data);
          const parsedEvents: Event[] = data;
          
          setEvents(parsedEvents);
      } catch (error) {
          console.error('Error fetching events:', error);
          if (axios.isAxiosError(error)) {
              console.error('Axios error:', error.response?.data);
          }
      } finally {
          setLoading(false);
      }
  };


    useEffect(() => {
        console.log('Current Month changed:', currentMonth);
        const month = currentMonth.toLocaleString('default', { month: 'long' });
        console.log('Month string:', month);
        const monthNum = getMonthNumber(month);
        console.log('Month number:', monthNum);
        fetchEvents(getMonthNumber(month));
    }, [currentMonth]);

    const getMonthEvents = () => {
        return events.filter(event => {
            const eventDate = new Date(event.date);
            const isSameMonth = eventDate.getMonth() === currentMonth.getMonth();
            const isSameYear = eventDate.getFullYear() === currentMonth.getFullYear();
            return isSameMonth && isSameYear;
        }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    };

    const tileContent = ({ date, view }: { date: Date; view: string }) => {
        if (view === 'month') {
            const dayEvents = events.filter(event => {
                const eventDate = new Date(event.date);
                const isSameDate = eventDate.getDate() === date.getDate();
                const isSameMonth = eventDate.getMonth() === date.getMonth();
                const isSameYear = eventDate.getFullYear() === date.getFullYear();
                return isSameDate && isSameMonth && isSameYear;
            });
            
            return dayEvents.length > 0 ? (
                <div className="flex flex-col items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 mb-1"></div>
                    <div className="text-xs font-medium text-green-700">
                        {dayEvents.length > 1 ? `${dayEvents.length} events` : '1 event'}
                    </div>
                </div>
            ) : null;
        }
    };

    const monthEvents = getMonthEvents();

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-gradient-to-br from-green-50 to-white rounded-lg shadow-lg p-6 border border-green-100">
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                        <span className="ml-3 text-gray-600">Loading calendar events...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-gradient-to-br from-green-50 to-white rounded-lg shadow-xl p-8 border border-green-100">
                <h2 className="text-3xl font-bold text-green-700 mb-8 text-center">
                    School Calendar
                </h2>
                
                <div className="flex flex-col lg:flex-row gap-10">
                    <div className="lg:w-[500px]">
                        <div className="p-4 bg-white rounded-xl shadow-md">
                            <Calendar
                                onChange={(value) => {
                                    if (value instanceof Date) {
                                        setCurrentMonth(value);
                                    } else if (Array.isArray(value) && value[0] instanceof Date) {
                                        setCurrentMonth(value[0]);
                                    }
                                }}
                                value={currentMonth}
                                tileContent={tileContent}
                                className="rounded-lg border-none w-full"
                                view="month"
                                onClickDay={(_, event) => {
                                    event.preventDefault();
                                }}
                                onActiveStartDateChange={({ activeStartDate }) => {
                                    if (activeStartDate) {
                                        setCurrentMonth(activeStartDate);
                                    }
                                }}
                            />
                        </div>
                    </div>
                    
                    <div className="flex-1">
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-2xl font-semibold mb-6 text-green-700 border-b-2 border-green-200 pb-3">
                                Events for {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </h3>
                            <EventsList events={monthEvents} loading={loading} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
