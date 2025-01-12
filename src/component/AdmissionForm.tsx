import React, { useState, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../constant/data';
import { GradeLevel } from '../constant/type';

interface AdmissionFormProps {
    onClose: () => void;
}

interface FormData {
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
    image?: {
        s3Key: string;
        s3Url: string;
    };
    reportCard?: {
        s3Key: string;
        s3Url: string;
    };
    studentType: 'new' | 'returnee';
    previousStudentId?: string;
    schoolYear: string;
}

interface AdmissionResponse {
    fileNumber: string;
    // ... other response fields
}

const SectionDivider: React.FC<{ title: string }> = ({ title }) => (
    <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-green-300"></div>
        </div>
        <div className="relative flex justify-start">
            <span className="bg-white pr-4 text-lg font-semibold text-green-600">
                {title}
            </span>
        </div>
    </div>
);

const AdmissionForm: React.FC<AdmissionFormProps> = ({ onClose }) => {
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        middleName: '',
        birthDate: '',
        age: 0,
        gender: 'male',
        sex: 'male',
        maritalStatus: 'single',
        birthPlace: '',
        address: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
        phoneNumber: '',
        email: '',
        lastSchoolAttended: '',
        gradeToEnroll: GradeLevel.NURSERY,
        motherName: '',
        motherPhoneNumber: '',
        motherOccupation: '',
        fatherName: '',
        fatherPhoneNumber: '',
        fatherOccupation: '',
        studentType: 'new',
        schoolYear: '2025-2026',
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [successData, setSuccessData] = useState<{fileNumber: string; show: boolean}>({
        fileNumber: '',
        show: false
    });
    const [reportCardFile, setReportCardFile] = useState<File | null>(null);
    const reportCardInputRef = useRef<HTMLInputElement>(null);

    const inputClassName = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-600 bg-green-600";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        if (name === 'studentType') {
            const studentType = value as 'new' | 'returnee';
            setFormData({
                ...formData,
                studentType,
                schoolYear: studentType === 'new' ? '2025-2026' : '2024-2025'
            });
        } else if (name === 'birthDate') {
            const birthDate = new Date(value);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            setFormData({
                ...formData,
                birthDate: value,
                age: age
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleReportCardSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setReportCardFile(event.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            let imageData, reportCardData;
            
            if (selectedFile) {
                const pictureForm = new FormData();
                pictureForm.append('image', selectedFile);
                pictureForm.append('fileType', 'image');
                const uploadResponse = await axios.post(`${API_BASE_URL}/upload`, pictureForm);
                imageData = {
                    s3Key: uploadResponse.data.s3Key,
                    s3Url: uploadResponse.data.s3Url
                };
            }

            if (reportCardFile) {
                const reportCardForm = new FormData();
                reportCardForm.append('file', reportCardFile);
                reportCardForm.append('fileType', 'file');
                const uploadResponse = await axios.post(`${API_BASE_URL}/upload`, reportCardForm);
                reportCardData = {
                    s3Key: uploadResponse.data.s3Key,
                    s3Url: uploadResponse.data.s3Url
                };
            }

            const admissionData = {
                ...formData,
                picture: imageData,
                reportCard: reportCardData
            };

            const response = await axios.post<AdmissionResponse>(`${API_BASE_URL}/registration`, admissionData);
            setSuccessData({
                fileNumber: response.data.fileNumber,
                show: true
            });
            onClose();
        } catch (err) {
            console.error('Error submitting admission:', err);
            setError('Failed to submit admission. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const SuccessModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
                <div className="mb-4">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                        <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Application Submitted Successfully!</h3>
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <p className="text-sm text-gray-600 mb-2">Your File Number is:</p>
                    <p className="text-2xl font-bold text-green-600">{successData.fileNumber}</p>
                    <p className="text-xs text-gray-500 mt-2">Please save this number for future reference</p>
                </div>
                <div className="space-y-3">
                    <button
                        onClick={() => {
                            // Copy to clipboard
                            navigator.clipboard.writeText(successData.fileNumber);
                            alert('File number copied to clipboard!');
                        }}
                        className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                        <svg className="mr-2 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        Copy File Number
                    </button>
                    <button
                        onClick={() => {
                            // Screenshot functionality
                            window.print();
                        }}
                        className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                        <svg className="mr-2 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Take Screenshot
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-green-600">Pre-Registration Form 2025-2026</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="mb-6">
                            <SectionDivider title="Student Type" />
                            <div className="flex gap-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="studentType"
                                        value="new"
                                        checked={formData.studentType === 'new'}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                                    />
                                    <span className="ml-2 text-gray-700">New Student</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="studentType"
                                        value="returnee"
                                        checked={formData.studentType === 'returnee'}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                                    />
                                    <span className="ml-2 text-gray-700">Returnee</span>
                                </label>
                            </div>
                        </div>

                        <SectionDivider title="Personal Information" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">First Name *</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    required
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className={inputClassName}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Last Name *</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    required
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className={inputClassName}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                                <input
                                    type="text"
                                    name="middleName"
                                    value={formData.middleName || ''}
                                    onChange={handleChange}
                                    className={inputClassName}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date of Birth *</label>
                                <input
                                    type="date"
                                    name="birthDate"
                                    required
                                    value={formData.birthDate}
                                    onChange={handleChange}
                                    className={inputClassName}
                                />
                            </div>
                        </div>

                        <SectionDivider title="Contact Information" />
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">City *</label>
                                    <input
                                        type="text"
                                        name="city"
                                        required
                                        value={formData.city}
                                        onChange={handleChange}
                                        className={inputClassName}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">State/Province *</label>
                                    <input
                                        type="text"
                                        name="state"
                                        required
                                        value={formData.state}
                                        onChange={handleChange}
                                        className={inputClassName}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Country *</label>
                                    <input
                                        type="text"
                                        name="country"
                                        required
                                        value={formData.country}
                                        onChange={handleChange}
                                        className={inputClassName}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Zip Code *</label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        required
                                        value={formData.zipCode}
                                        onChange={handleChange}
                                        className={inputClassName}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Address *</label>
                                <textarea
                                    name="address"
                                    required
                                    value={formData.address}
                                    onChange={handleChange}
                                    rows={2}
                                    className={inputClassName}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Contact Number *</label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        required
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        className={inputClassName}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email || ''}
                                        onChange={handleChange}
                                        className={inputClassName}
                                    />
                                </div>
                            </div>
                        </div>

                        <SectionDivider title="Educational Information" />
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">School Year *</label>
                                    <input
                                        type="text"
                                        name="schoolYear"
                                        value={formData.schoolYear}
                                        readOnly
                                        className={`${inputClassName} bg-gray-50`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Grade Level to Enroll *</label>
                                    <select
                                        name="gradeToEnroll"
                                        required
                                        value={formData.gradeToEnroll}
                                        onChange={handleChange}
                                        className={inputClassName}
                                    >
                                        {Object.values(GradeLevel).map((grade) => (
                                            <option key={grade} value={grade}>
                                                {grade.charAt(0).toUpperCase() + grade.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <SectionDivider title="Parent Information" />
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-900">Mother's Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Mother's Name *</label>
                                    <input
                                        type="text"
                                        name="motherName"
                                        required
                                        value={formData.motherName}
                                        onChange={handleChange}
                                        className={inputClassName}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Mother's Contact *</label>
                                    <input
                                        type="tel"
                                        name="motherPhoneNumber"
                                        required
                                        value={formData.motherPhoneNumber}
                                        onChange={handleChange}
                                        className={inputClassName}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Mother's Occupation</label>
                                    <input
                                        type="text"
                                        name="motherOccupation"
                                        value={formData.motherOccupation || ''}
                                        onChange={handleChange}
                                        className={inputClassName}
                                    />
                                </div>
                            </div>

                            <h3 className="text-lg font-medium text-gray-900">Father's Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Father's Name *</label>
                                    <input
                                        type="text"
                                        name="fatherName"
                                        required
                                        value={formData.fatherName}
                                        onChange={handleChange}
                                        className={inputClassName}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Father's Contact *</label>
                                    <input
                                        type="tel"
                                        name="fatherPhoneNumber"
                                        required
                                        value={formData.fatherPhoneNumber}
                                        onChange={handleChange}
                                        className={inputClassName}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Father's Occupation</label>
                                    <input
                                        type="text"
                                        name="fatherOccupation"
                                        value={formData.fatherOccupation || ''}
                                        onChange={handleChange}
                                        className={inputClassName}
                                    />
                                </div>
                            </div>
                        </div>

                        <SectionDivider title="Requirements" />
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Requirements (2x2 Picture) *</label>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                    accept="image/*"
                                    required
                                    className="mt-1 block w-full text-sm text-gray-500 bg-green-50
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-green-100 file:text-green-700
                                        hover:file:bg-green-200"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Report Card (PDF) *</label>
                                <input
                                    type="file"
                                    ref={reportCardInputRef}
                                    onChange={handleReportCardSelect}
                                    accept=".pdf"
                                    required
                                    className="mt-1 block w-full text-sm text-gray-500 bg-green-50
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-green-100 file:text-green-700
                                        hover:file:bg-green-200"
                                />
                                {reportCardFile && (
                                    <p className="mt-2 text-sm text-green-600">
                                        Selected file: {reportCardFile.name}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {isLoading ? 'Submitting...' : 'Submit Application'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {successData.show && <SuccessModal />}
        </>
    );
};

export default AdmissionForm; 