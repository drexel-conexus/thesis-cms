import React from 'react';
import { Event } from '../constant/type';

interface EventModalProps {
    event: Event;
    onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({ event, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white/95 rounded-2xl p-8 max-w-[90%] md:max-w-[80%] w-full mx-auto relative 
                          min-h-[50vh] max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp">
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors
                             bg-gray-100 hover:bg-gray-200 rounded-full p-2"
                    aria-label="Close modal"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                
                <div className="mb-8">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">{event.title}</h2>
                    <div className="flex flex-wrap items-center text-sm text-gray-600 gap-4">
                        <span className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(event.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </span>
                        {event.subtitle && (
                            <>
                                <div className="h-1 w-1 bg-gray-300 rounded-full"></div>
                                <span>{event.subtitle}</span>
                            </>
                        )}
                    </div>
                </div>

                {event.image?.s3Url && (
                    <div className="mb-8">
                        <div className="relative rounded-xl overflow-hidden shadow-lg">
                            <img 
                                src={event.image.s3Url} 
                                alt={event.title}
                                className="w-full h-auto max-h-[600px] object-cover"
                            />
                        </div>
                    </div>
                )}
                
                <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                        {event.body}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EventModal;