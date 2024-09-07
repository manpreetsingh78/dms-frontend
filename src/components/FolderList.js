import React, { useContext } from 'react';
import FolderContext from '../context/FolderContext';
import AuthContext from '../context/AuthContext'; // Import AuthContext
import {
    IconButton
  } from "@mui/material";
  import DeleteIcon from "@mui/icons-material/Delete";
import { deleteFolder } from '../services/api'; // Import createFolder API

import './FolderList.css'

const FolderList = ({ folders, updateFolders }) => {
  const { setSelectedFolder } = useContext(FolderContext); // Include selectedFolder
  const { authTokens } = useContext(AuthContext);
  const handleFolderClick = (folder) => {
    setSelectedFolder(folder);
  };


  const handleDeleteFolder = async (folderId) => {
    try {
      await deleteFolder(authTokens, folderId);
      updateFolders(); 
      setSelectedFolder(null)
    } catch (error) {
      console.error("Error deleting folder:", error);
    }
  };
  
//    const renderFolder = (folder, allFolders) => {
//     const subfolders = allFolders.filter(subfolder => subfolder.parent_folder === folder.id);

//     return (
//       <li key={folder.id} className="folder-item">
//         <div className="folder-name" onClick={() => handleFolderClick(folder)}>
//           <span className="folder-icon">📁</span> {folder.name}
//         </div>
//         {subfolders.length > 0 && (
//           <ul className="folder-subtree">
//             {subfolders.map((subfolder) => renderFolder(subfolder, allFolders))}
//           </ul>
//         )}
//       </li>
//     );
//   };

  return (
    <div className="folder-list-container">
      <br/>
      
      <div className="folder-card-wrap">
        {folders.map((folder) => (

          <div className="folder-card" onClick={() => handleFolderClick(folder)} key={folder.id}>
            <div className="folder-card__icon">
            </div>
            <span className="folder-card__title">{folder.name}</span>
            <div className='delete-folder'>

            <IconButton
                color="gray"
                aria-label="delete"
                onClick={() => handleDeleteFolder(folder.id)}
                >
                <DeleteIcon />
              </IconButton>
                  </div>
          </div>

        ))}
        </div>
      

      
    </div>
  );
};

export default FolderList;
