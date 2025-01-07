import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../constant/data';
import { useNavigate } from 'react-router-dom';

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
    gradeToEnroll: string;
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

    const navigate = useNavigate();

    const fetchAdmissions = useCallback(async () => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            const response = await axios.get(`${API_BASE_URL}/registration`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
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
    }, [navigate]);

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
            {admission.picture && (
                <div className="mt-4">
                    <h4 className="font-semibold mb-2 text-green-600">2x2 Picture</h4>
                    <img 
                        src={admission.picture.s3Url} 
                        alt="Student" 
                        className="w-32 h-32 object-cover rounded"
                    />
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex gap-4">
                <input
                    type="text"
                    placeholder="Search by File Number"
                    value={searchQuery}
                    onChange={(e) => {
                        if (!e.target.value) {
                            setSearchQuery("")
                            handleSearch("")
                            fetchAdmissions()
                        }
                        setSearchQuery(e.target.value)
                        handleSearch(e.target.value)
                    }}
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:border-green-500 focus:ring-1 focus:ring-green-500"
                />
            </div>

            {loading && <div className="text-center">Loading...</div>}
            {error && <div className="text-red-500">{error}</div>}

            {selectedAdmission ? (
                <AdmissionDetails admission={selectedAdmission} />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {admissions.map((admission) => (
                        <div 
                            key={admission.fileNumber}
                            className="bg-white p-4 rounded-lg shadow hover:shadow-md cursor-pointer relative"
                            onClick={() => setSelectedAdmission(admission)}
                        >
                            <div className="absolute top-2 right-2">
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
                            </div>
                            <div onClick={() => setSelectedAdmission(admission)}>
                                <p className="font-bold text-green-600">File #: {admission.fileNumber}</p>
                                <p className="text-green-600">{`${admission.firstName} ${admission.lastName}`}</p>
                                <p className="text-green-600">{admission.gradeToEnroll}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {deleteConfirmation.show && <DeleteConfirmationModal />}
        </div>
    );
};

export default AdminAdmissions; 