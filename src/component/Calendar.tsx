/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';
import { API_BASE_URL } from '../constant/data';
import axios from 'axios';
import { Event } from '../constant/type';
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
          const { data } = await axios.get(`${API_BASE_URL}/events/current-month${query}`);
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
        const month = currentMonth.toLocaleString('default', { month: 'long' });
        fetchEvents(getMonthNumber(month));
    }, [currentMonth]);

    const getMonthEvents = () => {
        return events.filter(event => {
            const eventDate = new Date(event.date);
            const isSameMonth = eventDate.getMonth() === currentMonth.getMonth();
            const isSameYear = eventDate.getFullYear() === currentMonth.getFullYear();
            return isSameMonth && isSameYear;
        }).sort((a, b) => a.date.getTime() - b.date.getTime());
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
                <div className="text-xs text-green-600">
                    {dayEvents.length} event(s)
                </div>
            ) : null;
        }
    };

    const monthEvents = getMonthEvents();

    if (loading) {
        return <div>Loading events...</div>;
    }

    return (
        <div className="flex flex-col gap-4 bg-gray-100 p-4 rounded-lg">
            <div className="flex gap-8">
                <Calendar
                    onChange={(value) => {
                        const newDate = value as Date;
                        console.log(newDate);
                        setCurrentMonth(newDate);
                    }}
                    value={currentMonth}
                    tileContent={tileContent}
                    className="rounded-lg border-none !w-[400px]"
                    view="month"
                    onClickDay={(value, event) => event.preventDefault()}
                />
                
                <div className="flex-1 max-w-md">
                    <h3 className="text-lg font-semibold mb-2 text-center text-green-500">
                        Events for {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </h3>
                    {monthEvents.length > 0 ? (
                        <div className="space-y-2">
                            {monthEvents.map((event, index) => (
                                <div key={index} className="bg-green-500 p-3 rounded">
                                    <h4 className="font-medium">
                                        {new Date(event.date).toLocaleDateString()} - {event.title}
                                    </h4>
                                    <p className="text-sm text-gray-600">{event.body}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No events for this month</p>
                    )}
                </div>
            </div>
        </div>
    );
};
