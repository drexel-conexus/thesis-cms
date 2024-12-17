import React from 'react';
import { Event } from '../constant/type';

interface EventsListProps {
    events: Event[];
    loading: boolean;
}

export const EventsList = React.memo(({ events, loading }: EventsListProps) => {
    if (loading) {
        return <div className="text-center py-8 text-gray-500">Loading events...</div>;
    }

    return events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto max-h-[600px] pr-2">
            {events.map((event, index) => (
                <div 
                    key={index} 
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-green-100"
                >
                    {event.image && event.image.s3Url && (
                        <div className="h-48 overflow-hidden">
                            <img
                                src={event.image.s3Url}
                                alt={event.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                    <div className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="bg-green-100 rounded-full p-2">
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
                        <h4 className="text-lg font-bold text-gray-800 mb-2">
                            {event.title}
                        </h4>
                        {event.subtitle && (
                            <p className="text-gray-600 text-sm mb-2">{event.subtitle}</p>
                        )}
                        <p className="text-gray-600 text-sm line-clamp-3">
                            {event.body}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    ) : (
        <div className="text-center py-8 text-gray-500">
            No events scheduled for this month
        </div>
    );
});

EventsList.displayName = 'EventsList'; 