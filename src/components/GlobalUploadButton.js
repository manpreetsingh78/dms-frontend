import React, { useState, useContext } from 'react';
import { Button, Input } from '@mui/material'; // Import MUI components
import AuthContext from '../context/AuthContext';
import FolderContext from '../context/FolderContext';
import { uploadFile } from '../services/api';
import CloudUploadIcon from '@mui/icons-material/CloudUpload'; // MUI icon for upload

const GlobalUploadButton = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const { authTokens } = useContext(AuthContext);
  const { selectedFolder } = useContext(FolderContext);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (selectedFile) {
      const fileName = selectedFile.name;
      const fileType = selectedFile.type;
      const fileSize = selectedFile.size;
      const folderId = selectedFolder ? selectedFolder.id : 0;

      try {
        await uploadFile(authTokens, selectedFile, folderId, fileName, fileType, fileSize);
        alert(`File uploaded to folder: ${selectedFolder ? selectedFolder.name : 'Root'}`);
        setSelectedFile(null);
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Failed to upload file');
      }
    } else {
      alert('Please select a file to upload');
    }
    window.location.reload();
  };

  return (
    <div className="global-upload-container">
      <form onSubmit={handleFileUpload}>
        <Input
          type="file"
          onChange={handleFileChange}
          inputProps={{ accept: '*' }} // Accept all file types
          style={{ marginRight: '10px' }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          startIcon={<CloudUploadIcon />} // Upload icon
        >
          Upload to {selectedFolder ? selectedFolder.name : 'Root'}
        </Button>
      </form>
    </div>
  );
};

export default GlobalUploadButton;
