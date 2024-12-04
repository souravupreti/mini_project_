import React, { useState, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Camera, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';

const ChallengePhotoUpload = () => {
  const params = useParams();
  const challengeId = params?.challengeId;
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isLoadingGifVisible, setIsLoadingGifVisible] = useState(false); // New state for GIF
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB file size limit
        setError('File is too large. Please upload a file smaller than 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!previewUrl) {
      setError('Please select a photo first');
      return;
    }

    setUploading(true);
    setError(null);
    setIsLoadingGifVisible(true); // Show the loading GIF

    try {
      const response = await axios.post(
        `http://localhost:4000/api/v1/challenge/${challengeId}/upload`,
        { photo: previewUrl },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      setUploadSuccess(true);
      setPreviewUrl(null);
      setIsLoadingGifVisible(false); // Hide the GIF after upload success

      // Show coins awarded if any
      if (response.data.coinsAwarded > 0) {
        alert(`Congratulations! You earned ${response.data.coinsAwarded} coins!`);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to upload photo');
      setIsLoadingGifVisible(false); // Hide the GIF on error
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg">
      {/* Fullscreen Loading GIF */}
      {isLoadingGifVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <img
            src="https://cdn.pixabay.com/animation/2023/08/17/08/51/08-51-41-992_512.gif"
            alt="Uploading..."
            className="max-h-full max-w-full "
          />
        </div>
      )}

      <div className="flex items-center space-x-2 mb-4">
        <Camera className="w-6 h-6 text-gray-600" />
        <span className="font-semibold text-lg">Daily Challenge Photo</span>
      </div>

      <div className="space-y-4">
        {/* File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          className="hidden"
        />

        {/* Preview Area */}
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer"
          onClick={triggerFileInput}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-64 mx-auto rounded-lg"
            />
          ) : (
            <div className="py-8">
              <Upload className="w-12 h-12 mx-auto text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">Click to select a photo</p>
            </div>
          )}
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={uploading || !previewUrl}
          className={`w-full py-2 px-4 rounded-lg text-white font-medium ${
            uploading || !previewUrl
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {uploading ? 'Uploading...' : 'Upload Photo'}
        </button>

        {/* Success Message */}
        {uploadSuccess && (
          <div className="p-4 bg-green-50 border-l-4 border-green-400 text-green-800 rounded-md flex items-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span>Photo uploaded successfully!</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-400 text-red-800 rounded-md flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengePhotoUpload;
