import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { Modal, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Viewer, Worker } from "@react-pdf-viewer/core"; // react-pdf-viewer for PDF rendering
import { downloadFile } from "../services/api"; // Ensure downloadFile fetches the file as ArrayBuffer

// Plugins for PDF viewer
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
// Import styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const FileViewerModal = ({ open, file, onClose }) => {
  const [pdfData, setPdfData] = useState(null); // State for storing PDF data (ArrayBuffer)
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const { authTokens } = useContext(AuthContext);

  useEffect(() => {
    if (file && open) {
      const fetchPdfContent = async () => {
        try {
          const response = await downloadFile(authTokens,file.id, {
            responseType: "arraybuffer", // Fetch the file as ArrayBuffer
          });
          console.log(response.data)
          const byteArray = new Uint8Array(response.data);
          console.log(byteArray)
          setPdfData(byteArray); // Set the byte array to state
        //   setPdfData(response.data); // Directly pass the data (ArrayBuffer)
        } catch (error) {
          console.error("Error fetching file content:", error);
        }
      };
      fetchPdfContent();
    }
  }, [file, open]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 800,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{file.file_name}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Render the PDF */}
        {file.file_type === "application/pdf" && pdfData ? (
          <div className="pdf-container">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <Viewer
                fileUrl={{ data: pdfData }} // Pass the ArrayBuffer directly
                plugins={[defaultLayoutPluginInstance]}
              />
            </Worker>
          </div>
        ) : (
          <Typography variant="body2" color="textSecondary">
            Cannot preview this file type.
          </Typography>
        )}
      </Box>
    </Modal>
  );
};

export default FileViewerModal;
