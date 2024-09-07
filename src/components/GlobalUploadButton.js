import React, { useState, useContext, useRef } from 'react'; // Add useRef for file input
import { Button, Modal, Box, Typography, IconButton } from '@mui/material'; // Material UI components
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close'; // Close icon for modal
import AuthContext from '../context/AuthContext';
import FolderContext from '../context/FolderContext';
import { uploadFile } from '../services/api';
import './GlobalUploadButton.css';

const GlobalUploadButton = ({ setFileUpload }) => {
  const [openModal, setOpenModal] = useState(false); // State to control modal open/close
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false); // Drag and drop feedback
  const { authTokens } = useContext(AuthContext);
  const { selectedFolder } = useContext(FolderContext);
  const fileInputRef = useRef(null); // Create ref for the hidden file input

  // Open the modal
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedFile(null); // Reset file when modal closes
  };

  // Handle file drop in drag-and-drop area
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false); // Remove drag feedback
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]); // Set the dropped file
    }
  };

  // Handle drag over event for drag feedback
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true); // Add drag feedback
  };

  // Handle drag leave event to remove feedback
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false); // Remove drag feedback
  };

  // Handle click on drag-and-drop area to open file dialog
  const handleClick = () => {
    fileInputRef.current.click(); // Programmatically click the hidden file input
  };

  // Handle file selection through input
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (selectedFile) {
      const fileName = selectedFile.name;
      const fileType = selectedFile.type;
      const fileSize = selectedFile.size;
      const folderId = selectedFolder ? selectedFolder.id : 0;

      try {
        await uploadFile(authTokens, selectedFile, folderId, fileName, fileType, fileSize);
        setSelectedFile(null); // Reset after upload
        handleCloseModal(); // Close modal after upload
        setFileUpload(true);
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Failed to upload file');
      }
    } else {
      alert('Please select a file to upload');
    }
  };

  return (
    <div className="global-upload-container">
      {/* Button to open modal */}
      <Button variant="contained" color="secondary" onClick={handleOpenModal}>
        Upload
      </Button>

      {/* Modal for file upload */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 400 }, // Responsive width
            bgcolor: 'background.paper',
            borderRadius: '8px',
            boxShadow: 24,
            p: { xs: 2, sm: 4 }, // Responsive padding
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Upload File</Typography>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Drag-and-drop area */}
          <div
            className={`drop-zone ${dragActive ? 'drag-active' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick} // Add onClick handler to trigger file input
          >
            {selectedFile ? (
              <p>{selectedFile.name}</p> // Show selected file name
            ) : (
              <p>Drag & Drop your file here or click to select</p>
            )}
            <input
              type="file"
              ref={fileInputRef} // Reference for hidden file input
              onChange={handleFileChange}
              style={{ display: 'none' }} // Hide default file input
              id="fileInput"
            />
          </div>

          {/* File upload button */}
          <Button
            variant="contained"
            color="primary"
            startIcon={<CloudUploadIcon />}
            onClick={handleFileUpload}
            disabled={!selectedFile} // Disable upload button if no file is selected
            fullWidth
            sx={{ mt: 2 }}
          >
            Upload to {selectedFolder ? selectedFolder.name : 'Root'}
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default GlobalUploadButton;
