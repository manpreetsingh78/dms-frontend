import React, { useContext, useState } from 'react';
import FolderContext from '../context/FolderContext';
import AuthContext from '../context/AuthContext'; // Import AuthContext
import { List, ListItem, ListItemText, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import HomeIcon from '@mui/icons-material/Home'; // Import Home Icon for Home Button
import { createFolder } from '../services/api'; // Import createFolder API
// import './FolderList.css'

const FolderList = ({ folders, updateFolders }) => {
  const { selectedFolder,setSelectedFolder } = useContext(FolderContext); // Include selectedFolder
  const { authTokens } = useContext(AuthContext); // Get authTokens from AuthContext
  const [openDialog, setOpenDialog] = useState(false); // State to control the dialog
  const [newFolderName, setNewFolderName] = useState(''); // State for new folder name

  const handleFolderClick = (folder) => {
    setSelectedFolder(folder);
  };

  const navigateToRootFolder = () => {
    setSelectedFolder(null); // Set folder to null, meaning root folder
  };

  // Handle opening and closing the dialog
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewFolderName(''); // Clear the folder name after closing
  };

  // Handle folder creation
  const handleCreateFolder = async () => {
    if (newFolderName.trim()) {
      try {
        // Call API to create folder, passing authTokens for authentication
        const parentFolderId = selectedFolder ? selectedFolder.id : null;
        await createFolder(authTokens, newFolderName, parentFolderId);
        setNewFolderName(''); // Clear input field
        handleCloseDialog(); // Close the dialog
        updateFolders(); // Refresh the folder list after creation
      } catch (error) {
        console.error('Error creating folder:', error);
      }
    }
  };
   // Recursive function to render folders
   const renderFolder = (folder, allFolders) => {
    const subfolders = allFolders.filter(subfolder => subfolder.parent_folder === folder.id);

    return (
      <li key={folder.id} className="folder-item">
        <div className="folder-name" onClick={() => handleFolderClick(folder)}>
          <span className="folder-icon">📁</span> {folder.name}
        </div>
        {subfolders.length > 0 && (
          <ul className="folder-subtree">
            {subfolders.map((subfolder) => renderFolder(subfolder, allFolders))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div className="folder-list-container">
      <h2></h2>
      <Button variant="contained" color="primary" onClick={handleOpenDialog}>
        Create Folder
      </Button>

      {/* Folder List */}
      <List>
        <Button color="inherit" onClick={navigateToRootFolder} startIcon={<HomeIcon />}>
          Home
        </Button>
        {folders.map((folder) => (
          <ListItem
            button
            key={folder.id}
            onClick={() => handleFolderClick(folder)}
            style={{ cursor: 'pointer' }} // Set cursor style to pointer on hover
          >
            <FolderIcon style={{ marginRight: '10px' }} />
            <ListItemText primary={folder.name} />
          </ListItem>
        ))}
      </List>
      

      {/* Dialog for creating new folder */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Create New Folder</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Folder Name"
            type="text"
            fullWidth
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreateFolder} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FolderList;
