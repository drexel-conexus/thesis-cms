// src/component/Home.tsx
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../constant/data';
// Import icon from react-icons
import { IoAddCircleOutline, IoCloseCircleOutline, IoTrashOutline } from "react-icons/io5";

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
      // First upload the file
      const formData = new FormData();
      formData.append('image', selectedFile);
      
      const uploadResponse = await axios.post(`${API_BASE_URL}/upload`, formData);
      
      // Create the new image object
      const newImage = {
        s3Key: uploadResponse.data.s3Key,
        s3Url: uploadResponse.data.s3Url,
        title: imageTitle || undefined,
      };

      // Update the home assets with the new image
      const response = await axios.patch(`${API_BASE_URL}/asset/${data?._id}`, {
        images: [newImage, ...data?.images || []]
      });

      // Update local state with the new data
      if (response.data) {
        await fetchImages(); // Refresh the data from server
      }
      
      // Reset form and close modal
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

  // Add function to handle form visibility
  const toggleUploadForm = () => {
    setShowUploadForm(!showUploadForm);
    // Reset form when closing
    if (showUploadForm) {
      setSelectedFile(null);
      setImageTitle('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Modify the delete handler to show confirmation first
  const handleDeleteClick = (s3Key: string) => {
    setDeleteConfirmation({ show: true, s3Key });
  };

  // Add confirmation handler
  const handleConfirmDelete = async () => {
    const s3Key = deleteConfirmation.s3Key;
    if (!s3Key || !data?._id) return;
    
    try {
      setIsLoading(true);
      
      // Delete from S3
      try {
        await axios.delete(`${API_BASE_URL}/upload/delete?s3Key=${s3Key}`);
      } catch (err) {
        console.log(err);
      }
      
      // Update the assets by removing the deleted image
      const updatedImages = data.images.filter(img => img.s3Key !== s3Key);
      await axios.patch(`${API_BASE_URL}/asset/${data._id}`, {
        images: updatedImages
      });

      // Refresh the images
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
    <div className="space-y-6">
      {/* Add Title */}
      <h1 className="text-2xl font-bold text-green-600">Home Assets</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Upload Icon Button */}
      <div className="flex justify-end">
        <button
          onClick={toggleUploadForm}
          className="flex items-center gap-2 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
        >
          <IoAddCircleOutline />
          Upload Image
        </button>
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

      {/* Image Gallery */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Image Gallery</h2>
        {isLoading && images.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Loading images...</p>
        ) : images.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No images uploaded yet</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <div 
                key={image.s3Key} 
                className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 relative"
              >
                <button
                  onClick={() => handleDeleteClick(image.s3Key)}
                  className="absolute top-2 right-2 z-10 bg-red-500 text-white p-2 rounded-full transition-colors duration-200 hover:bg-red-600 shadow-md"
                  title="Delete image"
                >
                  <IoTrashOutline size={18} />
                </button>

                <div className="aspect-w-16 aspect-h-9 w-full h-64 relative">
                  <img
                    src={image.s3Url}
                    alt={image.title || 'Uploaded image'}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                {image.title && (
                  <div className="p-4 bg-white">
                    <h3 className="font-semibold text-lg text-gray-800 truncate">
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
  );
};

export default Home;