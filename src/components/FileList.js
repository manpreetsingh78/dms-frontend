import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { getFiles, deleteFile, downloadFile } from '../services/api';
import { List, ListItem, ListItemText, IconButton, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility'; // Icon for "View File" button
import FileViewerModal from './FileViewerModal';

const FileList = ({ folderId, fileUpload, setFileUpload }) => {
  const { authTokens } = useContext(AuthContext);
  const [files, setFiles] = useState([]);
  const [fileToView, setFileToView] = useState(null); // State to store file to view

  useEffect(() => {
    const fetchFiles = async () => {
      const response = await getFiles(authTokens, folderId);
      setFiles(response.data);
      console.log(files)
    };
    fetchFiles();
    console.log(files)
    if(fileUpload){
        setFileUpload(false)
    }
  }, [authTokens, folderId, fileUpload]);

  const handleDelete = async (fileId) => {
    try {
      await deleteFile(authTokens, fileId);
      setFiles(files.filter(file => file.id !== fileId));
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Failed to delete file');
    }
  };

  const handleDownload = async (fileId, fileName) => {
    try {
      const response = await downloadFile(authTokens, fileId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  // Function to view file content (for PDFs, TXT, etc.)
  const handleViewFile = (file) => {
    setFileToView(file); // Set file to be viewed in modal
  };

  return (
    <div className="file-list-container">
      <List>
        {files.map((file) => (
          <ListItem
            key={file.id}
            secondaryAction={
              <>
                <IconButton
                  edge="end"
                  aria-label="view"
                  color='primary'
                  onClick={() => handleViewFile(file)} // Handle view button
                >
                  <VisibilityIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="download"
                  color='warning'
                  onClick={() => handleDownload(file, file.file_name)}
                >
                  <DownloadIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  color='error'
                  aria-label="delete"
                  onClick={() => handleDelete(file.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </>
            }
          >
            <ListItemText primary={file.file_name} />
          </ListItem>
        ))}
      </List>
       {/* File Viewer Modal */}
       {fileToView && (
        <FileViewerModal
          open={Boolean(fileToView)}
          file={fileToView}
          onClose={() => setFileToView(null)} // Close the modal
        />
      )}
    </div>
  );
};

export default FileList;
