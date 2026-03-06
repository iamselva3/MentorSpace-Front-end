import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt, FaFile, FaTimes, FaCheckCircle, FaSpinner } from 'react-icons/fa';

const FileUpload = ({ onFileSelect, accept, maxSize = 5242880 }) => { // 5MB default
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.errors[0]?.code === 'file-too-large') {
        setError(`File too large. Max size: ${maxSize / 1048576}MB`);
      } else if (rejection.errors[0]?.code === 'file-invalid-type') {
        setError('Invalid file type');
      }
      return;
    }

    // Handle accepted file
    const selectedFile = acceptedFiles[0];
    setFile(selectedFile);
    setError('');
    
    // Simulate upload progress (you can replace with actual upload logic)
    setUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setUploading(false);
        onFileSelect(selectedFile);
      }
    }, 200);
  }, [maxSize, onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept ? { [accept]: [] } : undefined,
    maxSize,
    multiple: false
  });

  const removeFile = () => {
    setFile(null);
    setUploadProgress(0);
    setUploading(false);
    setError('');
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="file-upload-container">
      {!file ? (
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'active' : ''} ${error ? 'error' : ''}`}
        >
          <input {...getInputProps()} />
          <FaCloudUploadAlt className="upload-icon" />
          {isDragActive ? (
            <p>Drop the file here...</p>
          ) : (
            <>
              <p>Drag & drop a file here, or click to select</p>
              <span className="file-hint">
                {accept ? `Accepted: ${accept}` : 'All files accepted'} • Max size: {maxSize / 1048576}MB
              </span>
            </>
          )}
        </div>
      ) : (
        <div className="file-preview">
          <div className="file-info">
            <FaFile className="file-icon" />
            <div className="file-details">
              <span className="file-name">{file.name}</span>
              <span className="file-size">{formatFileSize(file.size)}</span>
            </div>
          </div>
          
          {uploading ? (
            <div className="upload-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <span className="progress-text">{uploadProgress}%</span>
              <FaSpinner className="spinner" />
            </div>
          ) : (
            <div className="upload-complete">
              <FaCheckCircle className="success-icon" />
              <span>Upload complete!</span>
            </div>
          )}
          
          <button onClick={removeFile} className="remove-btn" type="button">
            <FaTimes />
          </button>
        </div>
      )}
      
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default FileUpload;