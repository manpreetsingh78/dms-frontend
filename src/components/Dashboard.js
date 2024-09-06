import React, { useContext, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';
import FolderContext from '../context/FolderContext';
import { getFolders } from '../services/api';
import FolderList from './FolderList';
import FileList from './FileList';
import GlobalUploadButton from './GlobalUploadButton';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const Dashboard = () => {
  const { authTokens, logoutUser, user } = useContext(AuthContext);
  const { selectedFolder, setSelectedFolder } = useContext(FolderContext);
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    const fetchFolders = async () => {
      const response = await getFolders(authTokens);
      setFolders(response.data);
    };
    fetchFolders();
  }, [authTokens]);

  // Function to go to root folder (i.e., deselect folder)
//   const navigateToRootFolder = () => {
//     setSelectedFolder(null); // Set folder to null, meaning root folder
//   };

  return (
    <div>
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

          <GlobalUploadButton />
          <Button color="inherit" onClick={logoutUser}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main content */}
      <Box display="flex" padding={3}>
        <Box width="25%">
          <FolderList folders={folders} />
        </Box>
        <Box width="75%">
          {selectedFolder ? (
            <>
              <h2>Files in {selectedFolder.name}</h2>
              <FileList folderId={selectedFolder.id} />
            </>
          ) : (
              <>
            <h2>Files in Root Folder</h2>
              <FileList folderId={null} />
            </>
          )}
        </Box>
      </Box>
    </div>
  );
};

export default Dashboard;
