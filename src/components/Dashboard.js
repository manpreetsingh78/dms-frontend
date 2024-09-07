import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import FolderContext from "../context/FolderContext";
import { getFolders } from "../services/api";
import FolderList from "./FolderList";
import FileList from "./FileList";
import GlobalUploadButton from "./GlobalUploadButton";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Divider,
} from "@mui/material";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import FolderIcon from '@mui/icons-material/Folder';
import { createFolder } from "../services/api"; // Import createFolder API
import "./Dashboard.css"; // Import the CSS file for custom styling

const Dashboard = () => {
  const { authTokens, logoutUser, user } = useContext(AuthContext); // Get authTokens from AuthContext
  const [openDialog, setOpenDialog] = useState(false); // State to control the dialog
  const [newFolderName, setNewFolderName] = useState(""); // State for new folder name
  const { selectedFolder, setSelectedFolder } = useContext(FolderContext);
  const [fileUploaded, setFileUploaded] = useState(false);

  const [folders, setFolders] = useState([]);

  useEffect(() => {
    const fetchFolders = async () => {
      const response = await getFolders(authTokens);
      setFolders(response.data);
    };
    fetchFolders();
  }, [authTokens]);

  const updateFolders = () => {
    const fetchFolders = async () => {
      const response = await getFolders(authTokens);
      setFolders(response.data);
    };
    fetchFolders();
  };

  const handleFileUpload = (status) => {
    setFileUploaded(status); // This will update the state when a file is uploaded
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
    setNewFolderName(""); // Clear the folder name after closing
  };

  // Handle folder creation
  const handleCreateFolder = async () => {
    if (newFolderName.trim()) {
      try {
        // Call API to create folder, passing authTokens for authentication
        const parentFolderId = selectedFolder ? selectedFolder.id : null;
        await createFolder(authTokens, newFolderName, parentFolderId);
        setNewFolderName(""); // Clear input field
        handleCloseDialog(); // Close the dialog
        updateFolders(); // Refresh the folder list after creation
      } catch (error) {
        console.error("Error creating folder:", error);
      }
    }
  };

  return (
    <div className="dashboard-container">
      {/* AppBar for navigation */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Welcome, {user.first_name}
          </Typography>
          <Button
            style={{ marginRight: "8px" }}
            variant="outlined"
            color="inherit"
            onClick={navigateToRootFolder}
          >
            Home
          </Button>

          <Button variant="contained" color="error" onClick={logoutUser}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Divider orientation="vertical" flexItem className="vertical-divider" />
      <Box width="100%" height="100%" className="file-area">
        <Box display="flex">
        <Button variant="outlined" style={{marginRight:"8px"}} startIcon={<FolderIcon />} color="inherit" onClick={navigateToRootFolder}>Root
        </Button>
          <GlobalUploadButton
            setFileUpload={handleFileUpload}
            updateFolders={updateFolders}
          />
          <Button
            style={{ margin: "0px 10px" }}
            variant="contained"
            color="primary"
            onClick={handleOpenDialog}
          >
            Create Folder
          </Button>
        </Box>
        <FolderList folders={folders} updateFolders={updateFolders} />
        {selectedFolder ? (
          <>
            <h2>Files in {selectedFolder.name}</h2>
            <FileList
              folderId={selectedFolder.id}
              fileUpload={fileUploaded}
              setFileUpload={handleFileUpload}
            />
          </>
        ) : (
          <>
            <h2>Files in Root Folder</h2>
            <FileList
              folderId={null}
              fileUpload={fileUploaded}
              setFileUpload={handleFileUpload}
            />
          </>
        )}
      </Box>
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

export default Dashboard;
