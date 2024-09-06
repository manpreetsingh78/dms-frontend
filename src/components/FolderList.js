import React, { useContext } from 'react';
import FolderContext from '../context/FolderContext';
import { List, ListItem, ListItemText } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import { Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home'; // Import Home Icon for Home Button

const FolderList = ({ folders }) => {
  const { setSelectedFolder } = useContext(FolderContext);

  const handleFolderClick = (folder) => {
    setSelectedFolder(folder);
  };

  const navigateToRootFolder = () => {
    setSelectedFolder(null); // Set folder to null, meaning root folder
  };

  return (
    <div className="folder-list-container">
      <h2>Folders</h2>
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
    </div>
  );
};

export default FolderList;
