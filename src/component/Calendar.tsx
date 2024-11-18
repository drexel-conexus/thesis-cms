import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';

interface Event {
    date: Date;
    title: string;
    description?: string;
}

interface SchoolCalendarProps {
    events?: Event[];
}

export const SchoolCalendar: React.FC<SchoolCalendarProps> = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Helper function to convert month name to number (0-11)
    const getMonthNumber = (monthName: string): number => {
        const months = {
            'January': 0, 'February': 1, 'March': 2, 'April': 3,
            'May': 4, 'June': 5, 'July': 6, 'August': 7,
            'September': 8, 'October': 9, 'November': 10, 'December': 11
        };
        return months[monthName as keyof typeof months];
    };

    // Function to parse the event data
    const parseEvents = () => {
        const eventData = {
            "2024": {
              "May": [
                {
                  "date": "15",
                  "event": "Start of Enrolment for S.Y. 2024-2025"
                }
              ],
              "June": [
                {
                  "date": "10",
                  "event": "Augustinian Mission Awareness"
                },
                {
                  "date": "12",
                  "event": "Independence Day"
                }
              ],
              "July": [
                {
                  "date": "1-31",
                  "event": "Nutrition Month"
                },
                {
                  "date": "1-3",
                  "event": "INSET (High School)"
                },
                {
                  "date": "4-5",
                  "event": "INSET (Elementary)"
                },
                {
                  "date": "10",
                  "event": "Employees' Orientation"
                },
                {
                  "date": "18",
                  "event": ["Opening of Classes", "Classroom Orientation"]
                },
                {
                  "date": "19",
                  "event": "Subject Orientation"
                },
                {
                  "date": "22",
                  "event": [
                    "AM - Homeroom Election and Club Shopping",
                    "PM - Academic and Non-Academic Club Election"
                  ]
                },
                {
                  "date": "29",
                  "event": [
                    "Mass of the Holy Spirit",
                    "Acquaintance Party",
                    "Celebration of Nutrition Month",
                    "Oath Taking (Student Council)"
                  ]
                }
              ],
              "August": [
                {
                  "date": "1-31",
                  "event": "Buwan ng Wika"
                },
                {
                  "date": "3",
                  "event": "General PTA Assembly Meeting and Election"
                },
                {
                  "date": "5",
                  "event": "Oath Taking (Clubs, General and Homeroom PTA)"
                },
                {
                  "date": "14",
                  "event": "Last Day of Monthly Payment"
                },
                {
                  "date": "15-16",
                  "event": "First Unit Examination (no acceptance of payment)"
                },
                {
                  "date": "19",
                  "event": "Start of Nine-Day Novena Mass in Honor to St. Augustine"
                },
                {
                  "date": "21",
                  "event": "Ninoy Aquino Day"
                },
                {
                  "date": "22-23",
                  "event": "Special Examination (with valid reason only other than non-payment of dues)"
                },
                {
                  "date": "26",
                  "event": "National Heroes Day"
                },
                {
                  "date": "27",
                  "event": "Feast of St. Monica"
                },
                {
                  "date": "28",
                  "event": "Feast of St. Augustine"
                },
                {
                  "date": "30",
                  "event": "Celebration of Buwan ng Wika"
                }
              ],
              "September": [
                {
                  "date": "6",
                  "event": "Monthly Mass"
                },
                {
                  "date": "8",
                  "event": "Birthday of Blessed Virgin Mary"
                },
                {
                  "date": "17",
                  "event": "Last Day of Monthly Payment"
                },
                {
                  "date": "18-19",
                  "event": "First Quarterly Examination (no acceptance of payment)"
                },
                {
                  "date": "20",
                  "event": "Celebration of Math and Science Month"
                },
                {
                  "date": "26-27",
                  "event": "Special Examination (with valid reason only other than non-payment of dues)"
                }
              ],
              "October": [
                {
                  "date": "4",
                  "event": [
                    "Celebration of World Teachers' Day",
                    "Monthly Mass"
                  ]
                },
                {
                  "date": "5",
                  "event": "First Quarterly Card Distribution"
                },
                {
                  "date": "7",
                  "event": "First Quarterly Recognition"
                },
                {
                  "date": "16",
                  "event": "Last Day of Monthly Payment"
                },
                {
                  "date": "17-18",
                  "event": "Second Unit Examination (no acceptance of payment)"
                },
                {
                  "date": "24-25",
                  "event": "Special Examination (with valid reason only other than non-payment of dues)"
                },
                {
                  "date": "29",
                  "event": "Celebration of UN Day"
                },
                {
                  "date": "30",
                  "event": "Celebration of Month of the Holy Rosary"
                }
              ],
              "November": [
                {
                  "date": "1",
                  "event": "All Saints Day"
                },
                {
                  "date": "2",
                  "event": "All Souls Day"
                },
                {
                  "date": "4",
                  "event": "Resumption of Classes"
                },
                {
                  "date": "13",
                  "event": [
                    "Birthday of St. Augustine",
                    "Celebration of English and Book Lovers' Month"
                  ]
                },
                {
                  "date": "20",
                  "event": "Last Day of Monthly Payment"
                },
                {
                  "date": "21-22",
                  "event": "Second Quarterly Examination (no acceptance of payment)"
                },
                {
                  "date": "25-26",
                  "event": "Overnight Recollection (Grade 6)"
                },
                {
                  "date": "28-29",
                  "event": [
                    "Special Examination (with valid reason only other than non-payment of dues)",
                    "Overnight Recollection (Grade 10)"
                  ]
                },
                {
                  "date": "30",
                  "event": "Bonifacio Day"
                }
              ],
              "December": [
                {
                  "date": "6",
                  "event": [
                    "Monthly Mass",
                    "First Holy Communion (Grade 4 and Grade 5)"
                  ]
                },
                {
                  "date": "7",
                  "event": "Second Quarterly Card Distribution"
                },
                {
                  "date": "8",
                  "event": "Immaculate Conception"
                },
                {
                  "date": "9",
                  "event": "Second Quarterly Recognition"
                },
                {
                  "date": "17",
                  "event": "Last Day of Monthly Payment"
                },
                {
                  "date": "18",
                  "event": "Graciano Lopez Jaena Day"
                },
                {
                  "date": "19-20",
                  "event": "Third Unit Examination (no acceptance of payment)"
                },
                {
                  "date": "21",
                  "event": [
                    "AM - Christmas Party of Students",
                    "PM - Christmas Party of Employees"
                  ]
                },
                {
                  "date": "25",
                  "event": "Christmas Day"
                },
                {
                  "date": "30",
                  "event": "Rizal Day"
                }
              ]
            },
            "2025": {
              "January": [
                {
                  "date": "1",
                  "event": "New Year's Day"
                },
                {
                  "date": "6",
                  "event": "Resumption of Classes"
                },
                {
                  "date": "9-10",
                  "event": "Special Examination (with valid reason only other than non-payment of dues)"
                },
                {
                  "date": "10",
                  "event": "Monthly Mass"
                },
                {
                  "date": "28",
                  "event": "Last Day of Monthly Payment"
                },
                {
                  "date": "29",
                  "event": "Chinese New Year"
                },
                {
                  "date": "30-31",
                  "event": "Third Quarterly Examination (no acceptance of payment)"
                }
              ],
              "February": [
                {
                  "date": "2",
                  "event": "Our Lady of Candles"
                },
                {
                  "date": "6-7",
                  "event": "Special Examination (with valid reason only other than non-payment of dues)"
                },
                {
                  "date": "7",
                  "event": "Monthly Mass"
                },
                {
                  "date": "11",
                  "event": "Evelio Javier"
                },
                {
                  "date": "14",
                  "event": [
                    "Valentine's Day",
                    "JS Promenade"
                  ]
                },
                {
                  "date": "15",
                  "event": "Third Quarterly Card Distribution"
                },
                {
                  "date": "17",
                  "event": "Third Quarterly Recognition"
                },
                {
                  "date": "19",
                  "event": "Last Day of Monthly Payment"
                },
                {
                  "date": "20-21",
                  "event": "Fourth Unit Examination (no acceptance of payment)"
                },
                {
                  "date": "25",
                  "event": "EDSA"
                },
                {
                  "date": "27-28",
                  "event": "Special Examination (with valid reason only other than non-payment of dues)"
                }
              ],
              "March": [
                {
                  "date": "5",
                  "event": "Last Day of Monthly Payment"
                },
                {
                  "date": "6-7",
                  "event": "Fourth Quarterly Examination (no acceptance of payment)"
                },
                {
                  "date": "10",
                  "event": "Start of Novena Mass in Honor to St. Joseph"
                },
                {
                  "date": "18",
                  "event": "Liberation of Panay"
                },
                {
                  "date": "19",
                  "event": [
                    "Feast of St. Joseph",
                    "75th Founding Anniversary"
                  ]
                },
                {
                  "date": "26",
                  "event": "Settlement of Accounts"
                },
                {
                  "date": "31",
                  "event": [
                    "Eidl ul-Fitr",
                    "Director's Birthday"
                  ]
                }
              ],
              "April": [
                {
                  "date": "9",
                  "event": "Araw ng Kagitingan"
                },
                {
                  "date": "11",
                  "event": [
                    "AM - Baccalaureate Mass and Recognition Day",
                    "PM - 70th Commencement and Moving - Up Exercises"
                  ]
                },
                {
                  "date": "17",
                  "event": "Holy Thursday"
                },
                {
                  "date": "18",
                  "event": "Good Friday"
                },
                {
                  "date": "19",
                  "event": "Black Saturday"
                }
              ]
            }
          }
        
        const parsedEvents: Event[] = [];
        
        Object.entries(eventData).forEach(([year, months]) => {
            Object.entries(months).forEach(([month, events]) => {
                events.forEach((event: any) => {
                    const dateStr = event.date;
                    const eventTitle = Array.isArray(event.event) 
                        ? event.event.join(', ') 
                        : event.event;

                    // Handle date ranges (e.g., "1-31")
                    if (dateStr.includes('-')) {
                        const [start, end] = dateStr.split('-').map(Number);
                        for (let day = start; day <= end; day++) {
                            const date = new Date(Number(year), getMonthNumber(month), day);
                            parsedEvents.push({
                                date,
                                title: eventTitle
                            });
                        }
                    } else {
                        // Single day events
                        const date = new Date(Number(year), getMonthNumber(month), Number(dateStr));
                        parsedEvents.push({
                            date,
                            title: eventTitle
                        });
                    }
                });
            });
        });
        
        return parsedEvents;
    };

    // Move this after all the function definitions
    const [events] = useState(() => parseEvents());

    const getMonthEvents = () => {
        return events.filter(event => {
            const isSameMonth = event.date.getMonth() === currentMonth.getMonth();
            const isSameYear = event.date.getFullYear() === currentMonth.getFullYear();
            return isSameMonth && isSameYear;
        }).sort((a, b) => a.date.getTime() - b.date.getTime());
    };

    const tileContent = ({ date, view }: { date: Date; view: string }) => {
        if (view === 'month') {
            const dayEvents = events.filter(event => {
                const isSameDate = event.date.getDate() === date.getDate();
                const isSameMonth = event.date.getMonth() === date.getMonth();
                const isSameYear = event.date.getFullYear() === date.getFullYear();
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

    return (
        <div className="flex flex-col gap-4 bg-gray-100 p-4 rounded-lg">
            <div className="flex gap-8">
                <Calendar
                    onChange={(value) => setCurrentMonth(value as Date)}
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
                                        {event.date.toLocaleDateString()} - {event.title}
                                    </h4>
                                    <p className="text-sm text-gray-600">{event.description}</p>
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
