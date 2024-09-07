import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import mammoth from "mammoth";
import JSZip from "jszip";

const supportedFileTypes = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "audio/mpeg",
  "video/mp4",
  "video/webm",
  "video/ogg",
  "application/zip",
  "text/plain",
];

const FileViewerModal = ({ open, file, onClose }) => {
  const [docHtml, setDocHtml] = useState(""); // State for storing the converted .docx HTML
  const [zipContents, setZipContents] = useState([]); // State for storing ZIP contents
  const [textContent, setTextContent] = useState(""); // Initialize state for text content
  const [unsupported, setUnsupported] = useState(false); // To track if file can be previewed
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    // handle text documents
    if (file && isTextFile(file.file_type)) {
      fetch(file.file)
        .then((response) => response.text()) // Read the text content
        .then((text) => setTextContent(text)) // Set text content to state
        .catch((err) => console.error("Error loading text file:", err));
    }
    if (!supportedFileTypes.includes(file.file_type)) {
      // Try to load the file as text if it's unsupported
      fetch(file.file)
        .then((response) => response.text())
        .then((text) => {
          if (text.length > 0) {
            setTextContent(text); // If text is found, display it in the text editor
            setUnsupported(true);
          } else {
            setUnsupported(false);
            setTextContent("Cannot preview this file type."); // If text cannot be loaded
          }
        })
        .catch(() => {
          setTextContent("Cannot preview this file type."); // On error, display the message
        });
    }
    // Handle .docx conversion
    if (
      file &&
      file.file_type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      fetch(file.file)
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => {
          return mammoth.convertToHtml({ arrayBuffer });
        })
        .then((result) => {
          setDocHtml(result.value);
        })
        .catch((err) => console.error("Error converting .docx file:", err));
    }

    // Handle ZIP file content extraction
    if (file && file.file_type.includes("zip")) {
      fetch(file.file)
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => {
          const zip = new JSZip();
          return zip.loadAsync(arrayBuffer);
        })
        .then((zip) => {
          const files = [];
          zip.forEach((relativePath, zipEntry) => {
            files.push({
              name: zipEntry.name,
              isDir: zipEntry.dir,
            });
          });
          setZipContents(files); // Set the list of files from the ZIP archive
        })
        .catch((err) => console.error("Error reading ZIP file:", err));
    }
  }, [file]);

  // Helper function to determine if the file is an image
  const isImageFile = (fileType) =>
    ["image/jpeg", "image/png", "image/gif"].includes(fileType);

  const isWordFile = (fileType) =>
    [
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ].includes(fileType);

  const isAudioFile = (fileType) => fileType === "audio/mpeg";

  const isVideoFile = (fileType) =>
    ["video/mp4", "video/webm", "video/ogg"].includes(fileType);

  const isZipFile = (fileType) => fileType.includes("zip");

  const isTextFile = (fileType) => {
    return ["text/plain", "application/rtf", "text/markdown"].includes(fileType);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "95%", sm: 800 }, // Responsive width
          maxHeight: "80vh", // Max height of the modal
          bgcolor: "background.paper",
          boxShadow: 24,
          p: { xs: 2, sm: 4 }, // Responsive padding
          overflow: "hidden", // Ensure content doesn't overflow out of the modal box
        }}
      >
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" noWrap>
            {file.file_name}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Scrollable content container */}
        <Box
          sx={{
            maxHeight: "65vh", // Ensure the content doesn't exceed the modal height
            overflowY: "auto", // Enable vertical scrolling
            mt: 2, // Add some margin to the top
          }}
        >
          {/* Render the ZIP contents, PDF, Image, Word document, MP3 audio, or video */}
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
                style={{ width: "100%", height: "auto", borderRadius: "4px" }} // Style the image
              />
            </div>
          ) : isWordFile(file.file_type) ? (
            <div className="word-container">
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
              <video controls style={{ width: "100%", borderRadius: "4px" }}>
                <source src={file.file} type={file.file_type} />
                Your browser does not support the video element.
              </video>
            </div>
          ) : isZipFile(file.file_type) ? (
            <div className="zip-container">
              <Typography variant="body2" color="textSecondary">
                ZIP File Contents:
              </Typography>
              <List>
                {zipContents.map((entry, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={entry.name} />
                  </ListItem>
                ))}
              </List>
            </div>
          ) : isTextFile(file.file_type) || unsupported ? (
            <div className="text-container">
              <pre
                style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
              >
                {textContent}
              </pre>
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
