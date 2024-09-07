import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import FolderContext from "../context/FolderContext";
import { getFolders } from "../services/api";
import FolderList from "./FolderList";
import FileList from "./FileList";
import GlobalUploadButton from "./GlobalUploadButton";
import { AppBar, Toolbar, Typography, Button, Box, Divider } from "@mui/material";
// import "./Dashboard.css"; // Import the CSS file for custom styling

const Dashboard = () => {
  const { authTokens, logoutUser, user } = useContext(AuthContext);
  const { selectedFolder } = useContext(FolderContext);
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

  return (
    <div className="dashboard-container">
      {/* AppBar for navigation */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Welcome, {user.first_name}
          </Typography>

          {/* Home Button to go to root folder */}
          {/* <Button color="inherit" onClick={navigateToRootFolder} startIcon={<HomeIcon />}>
            Home
          </Button> */}

          <GlobalUploadButton setFileUpload={handleFileUpload}  />
          <Button color="inherit" onClick={logoutUser}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main content with dividers for distinction */}
      <Box className="main-content">
        <Box className="sidebar">
          <h3>Folders</h3>
          <Divider />
          <FolderList folders={folders} updateFolders={updateFolders} />
        </Box>

        <Divider orientation="vertical" flexItem className="vertical-divider" />

        <Box className="file-area">
          {selectedFolder ? (
            <>
              <h2>Files in {selectedFolder.name}</h2>
              <FileList folderId={selectedFolder.id} fileUpload={fileUploaded} setFileUpload={handleFileUpload} />
            </>
          ) : (
            <>
              <h2>Files in Root Folder</h2>
              <FileList folderId={null} fileUpload={fileUploaded} setFileUpload={handleFileUpload} />
            </>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default Dashboard;
