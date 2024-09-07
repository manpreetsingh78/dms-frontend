import React, { useState, useContext, useRef } from "react";
import { Button, Modal, Box, Typography, IconButton } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import AuthContext from "../context/AuthContext";
import FolderContext from "../context/FolderContext";
import { uploadFile, createFolder } from "../services/api";
import "./GlobalUploadButton.css";

const GlobalUploadButton = ({ setFileUpload, updateFolders }) => {
  const [openModal, setOpenModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const { authTokens } = useContext(AuthContext);
  const { selectedFolder: currentFolder } = useContext(FolderContext);
  const fileInputRef = useRef(null);

  // Open the modal
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedFiles([]);
    setSelectedFolder(null);
  };

  // Handle file and folder drop in drag-and-drop area
  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const items = e.dataTransfer.items;
    if (items) {
      let files = [];
      let folderData = null;

      for (let i = 0; i < items.length; i++) {
        const entry = items[i].webkitGetAsEntry();

        if (entry.isDirectory) {
          folderData = await handleDirectoryUpload(entry);
          setSelectedFolder(folderData);
        } else if (entry.isFile) {
          files.push(items[i].getAsFile());
        }
      }

      if (files.length > 0) {
        setSelectedFiles(files);
      }
    }
  };

  // Handle folder and file extraction
  const handleDirectoryUpload = async (directoryEntry) => {
    let folderName = directoryEntry.name;
    let files = await readDirectory(directoryEntry);
    return { folderName, files };
  };

  // Read files from a directory
  const readDirectory = (directoryEntry) => {
    return new Promise((resolve) => {
      const reader = directoryEntry.createReader();
      reader.readEntries((entries) => {
        const files = [];
        entries.forEach((entry) => {
          if (entry.isFile) {
            entry.file((file) => {
              files.push(file);
            });
          }
        });
        resolve(files);
      });
    });
  };

  // Handle drag over event for drag feedback
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  // Handle drag leave event to remove feedback
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  // Handle file selection through input (allow both files and folders)
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    console.log(files)

    // Check if folders were selected
    const folderDetected = files.some((file) => file.webkitRelativePath);

    if (folderDetected) {
      // Group files by folder name for folder upload
      const folderName = files[0].webkitRelativePath.split("/")[0];
      setSelectedFolder({
        folderName,
        files,
      });
    } else {
      // Handle multiple file selection
      setSelectedFiles(files);
    }
  };

  // Sequentially upload files one by one
  const uploadFilesSequentially = async (files, folderId) => {
    for (const file of files) {
        let file_type = file.type
        if (file.type == "" || file.type == null) {
            
            file_type="Unknown"
        }
      try {
        await uploadFile(
          authTokens,
          file,
          folderId,
          file.name,
          file_type,
          file.size
        );
        // console.log(`Uploaded: ${file.name}`);
      } catch (error) {
        console.error(`Failed to upload: ${file.name}`, error);
      }
    }
  };

  // Handle file or folder upload
  const handleUpload = async (e) => {
    e.preventDefault();

    // If a folder is selected
    if (selectedFolder && selectedFolder.files.length > 0) {
      try {
        // Create folder in backend
        const folderId = currentFolder ? currentFolder.id : null;
        const newFolder = await createFolder(
          authTokens,
          selectedFolder.folderName,
          folderId
        );

        // Upload all files in the folder one by one
        await uploadFilesSequentially(selectedFolder.files, newFolder.data.id);

        setSelectedFolder(null); // Reset after upload
        handleCloseModal(); // Close modal after upload
        setFileUpload(true);
        updateFolders();
      } catch (error) {
        console.error("Error uploading folder:", error);
        alert("Failed to upload folder");
      }
    }

    // If individual or multiple files are selected
    else if (selectedFiles.length > 0) {
      try {
        const folderId = currentFolder ? currentFolder.id : null;
        // Upload files one by one
        await uploadFilesSequentially(selectedFiles, folderId);

        setSelectedFiles([]); // Reset after upload
        handleCloseModal(); // Close modal after upload
        setFileUpload(true);
        updateFolders();
      } catch (error) {
        console.error("Error uploading files:", error);
        alert("Failed to upload files");
      }
    } else {
      alert("Please select files or a folder to upload");
    }
  };

  return (
    <div className="global-upload-container">
      {/* Button to open modal */}
      <Button variant="contained" color="secondary" onClick={handleOpenModal}>
        Upload
      </Button>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 400 },
            bgcolor: "background.paper",
            borderRadius: "8px",
            boxShadow: 24,
            p: { xs: 2, sm: 4 },
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">Upload Files/Folder</Typography>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Drag-and-drop area */}
          <div
            className={`drop-zone ${dragActive ? "drag-active" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()} // Programmatically trigger the hidden input
          >
            {selectedFolder ? (
              <p>Selected Folder: {selectedFolder.folderName}</p>
            ) : selectedFiles.length > 0 ? (
              <p>
                Selected Files:{" "}
                {selectedFiles.map((file) => file.name).join(", ")}
              </p>
            ) : (
              <p>Drag & Drop your files or folder here, or click to select</p>
            )}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }} // Hide the input
              onChange={handleFileChange}
            //   webkitdirectory="true"
              multiple // Allow multiple files/folder selection
            />
          </div>

          {/* Upload button */}
          <Button
            variant="contained"
            color="primary"
            startIcon={<CloudUploadIcon />}
            onClick={handleUpload}
            disabled={!(selectedFolder || selectedFiles.length > 0)} // Disable if no files or folder is selected
            fullWidth
            sx={{ mt: 2 }}
          >
            Upload to {currentFolder ? currentFolder.name : "Root"}
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default GlobalUploadButton;
