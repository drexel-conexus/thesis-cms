// src/component/Home.tsx
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../constant/data';
// Import icon from react-icons
import { IoAddCircleOutline, IoCloseCircleOutline, IoTrashOutline } from "react-icons/io5";
import { FaSpinner } from 'react-icons/fa';

interface Image {
  _id: string;
  s3Key: string;
  s3Url: string;
  title?: string;
}

const Home: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [data, setData] = useState<{images: Image[], _id: string, title: string} | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageTitle, setImageTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Add new state for controlling form visibility
  const [showUploadForm, setShowUploadForm] = useState(false);
  // Add new state for delete confirmation modal
  const [deleteConfirmation, setDeleteConfirmation] = useState<{show: boolean, s3Key: string | null}>({
    show: false,
    s3Key: null
  });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get<{ images: Image[], _id: string, title: string }>(`${API_BASE_URL}/asset/home`);
      const res = response.data;
      if (res) {
        setImages(res.images);
        setData(res);
      }
    } catch (err) {
      console.error('Error fetching images:', err);
      setError('Failed to fetch images. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('fileType', 'image');
      const uploadResponse = await axios.post(`${API_BASE_URL}/upload`, formData);
      
      const newImage = {
        s3Key: uploadResponse.data.s3Key,
        s3Url: uploadResponse.data.s3Url,
        title: imageTitle || undefined,
      };

      const response = await axios.patch(`${API_BASE_URL}/asset/${data?._id}`, {
        images: [newImage, ...data?.images || []]
      });

      if (response.data) {
        await fetchImages(); // Refresh the data from server
      }
      
      setSelectedFile(null);
      setImageTitle('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setShowUploadForm(false);

    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleUploadForm = () => {
    setShowUploadForm(!showUploadForm);
    if (showUploadForm) {
      setSelectedFile(null);
      setImageTitle('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteClick = (s3Key: string) => {
    setDeleteConfirmation({ show: true, s3Key });
  };

  const handleConfirmDelete = async () => {
    const s3Key = deleteConfirmation.s3Key;
    if (!s3Key || !data?._id) return;
    
    try {
      setIsLoading(true);
      
      try {
        await axios.delete(`${API_BASE_URL}/upload/delete?s3Key=${s3Key}`);
      } catch (err) {
        console.log(err);
      }
      
      const updatedImages = data.images.filter(img => img.s3Key !== s3Key);
      await axios.patch(`${API_BASE_URL}/asset/${data._id}`, {
        images: updatedImages
      });

      await fetchImages();
      
    } catch (err) {
      console.error('Error deleting image:', err);
      setError('Failed to delete image. Please try again.');
    } finally {
      setIsLoading(false);
      setDeleteConfirmation({ show: false, s3Key: null });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          <span className="text-green-600">Home</span> Assets
        </h1>
        <button
          onClick={toggleUploadForm}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
        >
          <IoAddCircleOutline className="-ml-1 mr-2 h-5 w-5" />
          Upload Image
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="rounded-md bg-red-50 p-4 border-l-4 border-red-500">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Image Gallery Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Image Gallery</h2>
        </div>
        
        <div className="p-6">
          {isLoading && images.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <FaSpinner className="w-8 h-8 text-green-500 animate-spin mb-4" />
              <p className="text-sm text-gray-500">Loading images...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-gray-100 p-3 mb-4">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">No images uploaded yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <div 
                  key={image.s3Key} 
                  className="group bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                >
                  <div className="relative">
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src={image.s3Url}
                        alt={image.title || 'Uploaded image'}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <button
                      onClick={() => handleDeleteClick(image.s3Key)}
                      className="absolute top-2 right-2 p-2 bg-white bg-opacity-90 rounded-full shadow-md hover:bg-red-50 transition-colors duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title="Delete image"
                    >
                      <IoTrashOutline className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                  
                  {image.title && (
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 truncate group-hover:text-green-600 transition-colors duration-200">
                        {image.title}
                      </h3>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Section */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            {/* Close button */}
            <button 
              onClick={toggleUploadForm}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <IoCloseCircleOutline size={24} />
            </button>

            <h2 className="text-xl font-semibold mb-4">Upload New Image</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Image Title (Optional)</label>
                <input
                  type="text"
                  value={imageTitle}
                  onChange={(e) => setImageTitle(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  placeholder="Enter image title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Select Image</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  className="mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-green-50 file:text-green-700
                    hover:file:bg-green-100"
                />
              </div>
              <button
                onClick={handleUpload}
                disabled={isLoading}
                className={`w-full bg-green-600 text-white py-2 px-4 rounded-md transition duration-200 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
                }`}
              >
                {isLoading ? 'Uploading...' : 'Upload Image'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this image? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirmation({ show: false, s3Key: null })}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;