import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../constant/data';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { GradeLevel } from '../constant/type';
import { FaSearch, FaSpinner, FaTrash, FaTimes, FaGraduationCap, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaDownload, FaFileAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface Admission {
    _id: string;
    fileNumber: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    birthDate: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    sex: 'male' | 'female';
    maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
    birthPlace: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    phoneNumber: string;
    email?: string;
    lastSchoolAttended?: string;
    gradeToEnroll: GradeLevel;
    motherName: string;
    motherPhoneNumber: string;
    motherOccupation?: string;
    fatherName: string;
    fatherPhoneNumber: string;
    fatherOccupation?: string;
    picture?: {
        s3Key: string;
        s3Url: string;
    };
    reportCard?: {
        s3Key: string;
        s3Url: string;
    };
}

const AdminAdmissions: React.FC = () => {
    const [admissions, setAdmissions] = useState<Admission[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAdmission, setSelectedAdmission] = useState<Admission | null>(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState<{
        show: boolean;
        id: string | null;
        fileNumber: string | null;
    }>({
        show: false,
        id: null,
        fileNumber: null
    });
    const [selectedGrades, setSelectedGrades] = useState<GradeLevel[]>([]);

    const navigate = useNavigate();

    const gradeOptions = Object.values(GradeLevel).map(grade => ({
        value: grade,
        label: grade
    }));

    const filteredAdmissions = admissions;

    const fetchAdmissions = useCallback(async () => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            const gradeQuery = selectedGrades.length > 0 
                ? `&gradeToEnroll=${selectedGrades.join(',')}`
                : '';
            const response = await axios.get(
                `${API_BASE_URL}/registration?${searchQuery ? `fileNumber=${searchQuery}` : ''}${gradeQuery}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setAdmissions(response.data);
        } catch (err) {
            if (axios.isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 403)) {    
                navigate('/login');
            } else {
                setError('Failed to fetch admissions');
                console.error(err);
            }
        } finally {
            setLoading(false);
        }
    }, [navigate, searchQuery, selectedGrades]);

    useEffect(() => {
        fetchAdmissions();
    }, [fetchAdmissions]);

    const handleSearch = async (key: string) => {
        if (!key.trim()) return;
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE_URL}/registration?fileNumber=${key}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setAdmissions(response.data);
        } catch (err) {
            if (axios.isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 403)) {
                navigate('/login');
            } else {
                setError('No admission found with this file number');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            setLoading(true);
            await axios.delete(`${API_BASE_URL}/registration/${id}`);
            setDeleteConfirmation({ show: false, id: null, fileNumber: null });
            fetchAdmissions();
        } catch (err) {
            setError('Failed to delete admission');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const DeleteConfirmationModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Deletion</h3>
                <p className="text-gray-600 mb-6">
                    Are you sure you want to delete admission with file number: 
                    <span className="font-semibold text-green-600 ml-1">
                        {deleteConfirmation.fileNumber}
                    </span>?
                    <br />
                    This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={() => setDeleteConfirmation({ show: false, id: null, fileNumber: null })}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            if (deleteConfirmation.id) {
                                handleDelete(deleteConfirmation.id);
                            }
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );

    const downloadFile = async (url: string, filename: string) => {
        try {
            const response = await fetch(url);
            const contentType = response.headers.get('content-type');
            const blob = await response.blob();
            
            // Determine correct file extension based on content type
            let extension = '';
            if (contentType) {
                const contentTypeLower = contentType.toLowerCase();
                if (contentTypeLower === 'image/jpeg' || contentTypeLower === 'image/jpg') {
                    extension = '.jpg';
                } else if (contentTypeLower === 'image/png') {
                    extension = '.png';
                } else if (contentTypeLower === 'image/gif') {
                    extension = '.gif';
                } else if (contentTypeLower === 'application/pdf') {
                    extension = '.pdf';
                } else {
                    const urlExtension = url.split('.').pop()?.toLowerCase();
                    if (urlExtension) {
                        extension = `.${urlExtension}`;
                    }
                }
            }

            // Create a new blob with the correct type
            const fileBlob = new Blob([blob], { type: contentType || 'application/octet-stream' });
            const downloadUrl = window.URL.createObjectURL(fileBlob);
            
            // Ensure filename has correct extension
            const finalFilename = filename.includes('.')
                ? filename
                : `${filename}${extension}`;

            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = finalFilename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error('Download failed:', error);
            // You might want to show an error message to the user
            alert('Failed to download file. Please try again.');
        }
    };

    const AdmissionDetails = ({ admission }: { admission: Admission }) => (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-green-600">File Number: {admission.fileNumber}</h3>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirmation({ 
                                show: true, 
                                id: admission._id,
                                fileNumber: admission.fileNumber
                            });
                        }}
                        className="p-1 text-red-600 hover:text-red-700"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                    <button 
                        onClick={() => setSelectedAdmission(null)}
                        className="text-gray-500 hover:text-green-600"
                    >
                        ×
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h4 className="font-semibold mb-2 text-green-600">Personal Information</h4>
                    <p className="text-green-600">Name: {`${admission.firstName} ${admission.middleName || ''} ${admission.lastName}`}</p>
                    <p className="text-green-600">Birth Date: {new Date(admission.birthDate).toLocaleDateString()}</p>
                    <p className="text-green-600">Age: {admission.age}</p>
                    <p className="text-green-600">Gender: {admission.gender}</p>
                    <p className="text-green-600">Sex: {admission.sex}</p>
                    <p className="text-green-600">Marital Status: {admission.maritalStatus}</p>
                </div>
                <div>
                    <h4 className="font-semibold mb-2 text-green-600">Contact Information</h4>
                    <p className="text-green-600">Address: {admission.address}</p>
                    <p className="text-green-600">City: {admission.city}</p>
                    <p className="text-green-600">State: {admission.state}</p>
                    <p className="text-green-600">Country: {admission.country}</p>
                    <p className="text-green-600">Phone: {admission.phoneNumber}</p>
                    <p className="text-green-600">Email: {admission.email || 'N/A'}</p>
                </div>
                <div>
                    <h4 className="font-semibold mb-2 text-green-600">Educational Information</h4>
                    <p className="text-green-600">Grade to Enroll: {admission.gradeToEnroll}</p>
                    <p className="text-green-600">Last School: {admission.lastSchoolAttended || 'N/A'}</p>
                </div>
                <div>
                    <h4 className="font-semibold mb-2 text-green-600">Parents Information</h4>
                    <p className="text-green-600">Mother's Name: {admission.motherName}</p>
                    <p className="text-green-600">Mother's Contact: {admission.motherPhoneNumber}</p>
                    <p className="text-green-600">Father's Name: {admission.fatherName}</p>
                    <p className="text-green-600">Father's Contact: {admission.fatherPhoneNumber}</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {admission.picture && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="font-semibold text-green-600">2x2 Picture</h4>
                            <button
                                onClick={() => downloadFile(
                                    admission.picture!.s3Url,
                                    `${admission.fileNumber}_picture`  // Remove extension, let function handle it
                                )}
                                className="inline-flex items-center px-3 py-1.5 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors duration-200"
                            >
                                <FaDownload className="w-4 h-4 mr-2" />
                                Download
                            </button>
                        </div>
                        <div className="relative group">
                            <img 
                                src={admission.picture.s3Url} 
                                alt="Student" 
                                className="w-full h-48 object-contain rounded-md border border-gray-200"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-md" />
                        </div>
                    </div>
                )}

                {admission.reportCard && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="font-semibold text-green-600">Report Card</h4>
                            <button
                                onClick={() => downloadFile(
                                    admission.reportCard!.s3Url,
                                    `${admission.fileNumber}_report_card`  // Remove extension, let function handle it
                                )}
                                className="inline-flex items-center px-3 py-1.5 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors duration-200"
                            >
                                <FaDownload className="w-4 h-4 mr-2" />
                                Download
                            </button>
                        </div>
                        <div className="relative group">
                            <div className="flex items-center justify-center h-48 bg-white rounded-md border border-gray-200">
                                <div className="text-center">
                                    <FaFileAlt className="w-12 h-12 mx-auto text-green-500 mb-2" />
                                    <p className="text-sm text-gray-600">Report Card PDF</p>
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 rounded-md" />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    <span className="text-green-600">Admission</span> Applications
                </h2>
                
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by File Number"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                if (!e.target.value) {
                                    fetchAdmissions();
                                } else {
                                    handleSearch(e.target.value);
                                }
                            }}
                            className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 
                                bg-white text-gray-900 placeholder-gray-400"
                        />
                    </div>
                    <div className="w-full md:w-96">
                        <Select
                            isMulti
                            options={gradeOptions}
                            value={gradeOptions.filter(option => selectedGrades.includes(option.value))}
                            onChange={(selected) => {
                                setSelectedGrades(selected ? selected.map(option => option.value) : []);
                                fetchAdmissions();
                            }}
                            placeholder="Filter by Grade Level"
                            className="text-sm"
                            classNamePrefix="select"
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    backgroundColor: '#F0FDF4', // Light green background
                                }),
                                option: (base, state) => ({
                                    ...base,
                                    color: '#059669', // Green text
                                    backgroundColor: state.isFocused ? '#D1FAE5' : 'white',
                                }),
                                multiValue: (base) => ({
                                    ...base,
                                    backgroundColor: '#D1FAE5', // Light green background for selected items
                                }),
                                multiValueLabel: (base) => ({
                                    ...base,
                                    color: '#059669', // Green text for selected items
                                }),
                                singleValue: (base) => ({
                                    ...base,
                                    color: '#059669', // Green text for single value
                                })
                            }}
                            theme={(theme) => ({
                                ...theme,
                                colors: {
                                    ...theme.colors,
                                    primary: '#10B981',
                                    primary25: '#D1FAE5',
                                    neutral80: '#059669', // Dropdown text color
                                }
                            })}
                        />
                    </div>
                </div>
            </div>

            {loading && (
                <div className="flex items-center justify-center py-12">
                    <FaSpinner className="w-8 h-8 text-green-500 animate-spin" />
                </div>
            )}
            
            {error && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-md bg-red-50 p-4 border-l-4 border-red-500"
                >
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <FaTimes className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </motion.div>
            )}

            <AnimatePresence>
                {!selectedAdmission && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filteredAdmissions.map((admission) => (
                            <motion.div
                                key={admission.fileNumber}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                whileHover={{ y: -4 }}
                                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
                            >
                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-medium text-green-600">File #{admission.fileNumber}</p>
                                            <h3 className="text-lg font-semibold text-gray-900 mt-1">
                                                {`${admission.firstName} ${admission.lastName}`}
                                            </h3>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setDeleteConfirmation({ 
                                                    show: true, 
                                                    id: admission._id,
                                                    fileNumber: admission.fileNumber
                                                });
                                            }}
                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                                        >
                                            <FaTrash className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center text-gray-600">
                                            <FaGraduationCap className="w-4 h-4 mr-2 text-green-500" />
                                            <span>{admission.gradeToEnroll}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <FaPhone className="w-4 h-4 mr-2 text-green-500" />
                                            <span>{admission.phoneNumber}</span>
                                        </div>
                                        
                                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                                            {admission.picture && (
                                                <div className="flex items-center">
                                                    <FaUser className="w-3 h-3 mr-1 text-green-500" />
                                                    <span>Picture</span>
                                                </div>
                                            )}
                                            {admission.reportCard && (
                                                <div className="flex items-center">
                                                    <FaFileAlt className="w-3 h-3 mr-1 text-green-500" />
                                                    <span>Report Card</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setSelectedAdmission(admission)}
                                        className="mt-4 w-full bg-green-50 text-green-600 py-2 px-4 rounded-md hover:bg-green-100 transition-colors duration-200 text-sm font-medium"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {selectedAdmission && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white rounded-lg shadow-lg overflow-hidden"
                    >
                        <AdmissionDetails admission={selectedAdmission} />
                    </motion.div>
                )}
            </AnimatePresence>

            {deleteConfirmation.show && <DeleteConfirmationModal />}
        </div>
    );
};

export default AdminAdmissions; 