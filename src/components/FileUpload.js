import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { uploadFile } from '../services/api';

const FileUpload = ({ folderId, onFileUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const { authTokens } = useContext(AuthContext);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (selectedFile) {
      try {
        await uploadFile(authTokens, selectedFile, folderId);
        alert('File uploaded successfully!');
        setSelectedFile(null);
        onFileUpload(); // Trigger file list update after upload
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Failed to upload file');
      }
    } else {
      alert('Please select a file first');
    }
  };

  return (
    <div className="file-upload-container">
      <form onSubmit={handleFileUpload}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit" className="upload-button">Upload File</button>
      </form>
    </div>
  );
};

export default FileUpload;
