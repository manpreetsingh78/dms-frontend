import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Viewer, Worker } from "@react-pdf-viewer/core"; // react-pdf-viewer for PDF rendering
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout"; // Plugin for layout
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import mammoth from 'mammoth'; // Import mammoth.js for .docx conversion

const FileViewerModal = ({ open, file, onClose }) => {
  const [pdfData, setPdfData] = useState(null); // State for storing PDF data (ArrayBuffer)
  const [docHtml, setDocHtml] = useState(''); // State for storing the converted .docx HTML
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    if (file && file.file_type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // Fetch and convert the .docx file using mammoth.js
      fetch(file.file)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => {
          return mammoth.convertToHtml({ arrayBuffer });
        })
        .then(result => {
          setDocHtml(result.value); // Set the converted HTML to state
        })
        .catch(err => console.error('Error converting .docx file:', err));
    }
  }, [file]);

  // Helper function to determine if the file is an image
  const isImageFile = (fileType) => {
    return ['image/jpeg', 'image/png', 'image/gif'].includes(fileType);
  };

  // Helper function to determine if the file is a Word document
  const isWordFile = (fileType) => {
    return ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(fileType);
  };

  // Helper function to determine if the file is an MP3
  const isAudioFile = (fileType) => {
    return fileType === 'audio/mpeg'; // MP3 files
  };

  // Helper function to determine if the file is a video
  const isVideoFile = (fileType) => {
    return ['video/mp4', 'video/webm', 'video/ogg'].includes(fileType);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 800,
          maxHeight: '80vh', // Max height of the modal (viewport height)
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          overflow: 'hidden', // Ensure content doesn't overflow out of the modal box
        }}
      >
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{file.file_name}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Scrollable content container */}
        <Box
          sx={{
            maxHeight: '65vh', // Ensure the content doesn't exceed the modal height
            overflowY: 'auto', // Enable vertical scrolling
            mt: 2, // Add some margin to the top
          }}
        >
          {/* Render the PDF, Image, Word document, MP3 audio, or video */}
          {file.file_type === "application/pdf" ? (
            <div className="pdf-container">
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer
                  fileUrl={file.file} // Pass the PDF file URL
                  plugins={[defaultLayoutPluginInstance]}
                />
              </Worker>
            </div>
          ) : isImageFile(file.file_type) ? (
            <div className="image-container">
              <img
                src={file.file} // Pass the image file URL
                alt={file.file_name}
                style={{ width: '100%', height: 'auto', borderRadius: '4px' }} // Style the image
              />
            </div>
          ) : isWordFile(file.file_type) ? (
            <div className="word-container">
              {/* Render the converted .docx HTML */}
              {docHtml ? (
                <div
                  className="docx-content"
                  dangerouslySetInnerHTML={{ __html: docHtml }} // Render the HTML from mammoth.js
                />
              ) : (
                <Typography variant="body2" color="textSecondary">
                  Loading Word document...
                </Typography>
              )}
            </div>
          ) : isAudioFile(file.file_type) ? (
            <div className="audio-container">
              <audio controls>
                <source src={file.file} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          ) : isVideoFile(file.file_type) ? (
            <div className="video-container">
              <video controls style={{ width: '100%', borderRadius: '4px' }}>
                <source src={file.file} type={file.file_type} />
                Your browser does not support the video element.
              </video>
            </div>
          ) : (
            <Typography variant="body2" color="textSecondary">
              Cannot preview this file type.
            </Typography>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default FileViewerModal;
