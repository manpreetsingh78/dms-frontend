import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { getFiles, deleteFile, downloadFile } from "../services/api";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import FileViewerModal from "./FileViewerModal";
import "./FileList.css";
import FileIcon from "./FileIcon";

const FileList = ({ folderId, fileUpload, setFileUpload }) => {
  const { authTokens } = useContext(AuthContext);
  const [files, setFiles] = useState([]);
  const [fileToView, setFileToView] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      const response = await getFiles(authTokens, folderId);
      setFiles(response.data);
    };
    fetchFiles();
    if (fileUpload) {
      setFileUpload(false);
    }
  }, [authTokens, folderId, fileUpload,setFileUpload]);

  const handleDelete = async (fileId) => {
    try {
      await deleteFile(authTokens, fileId);
      setFiles(files.filter((file) => file.id !== fileId));
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Failed to delete file");
    }
  };

  const handleDownload = async (fileId, fileName) => {
    try {
      const response = await downloadFile(authTokens, fileId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handleViewFile = (file) => {
    setFileToView(file);
  };

  return (
    <div className="file-list-container">
      {files.map((file) => (
        <div key={file.id}>
          <div className="file-box">
            <div className="file">
              <div className="enter-area" onClick={() => handleViewFile(file)}>
                <div className="icon">
                  <FileIcon fileType={file.file_type} />
                </div>
                <div className="file-name" data-tooltip="{file.file_name}">
                  {file.file_name}
                  <br />
                  <small>{file.created_at_human_readable}</small>
                  <br />
                  <small>{file.file_size_human_readable}</small>
                </div>
              </div>
              <IconButton
                edge="end"
                aria-label="download"
                color="warning"
                onClick={() => handleDownload(file, file.file_name)}
              >
                <DownloadIcon />
              </IconButton>
              <IconButton
                edge="end"
                color="error"
                aria-label="delete"
                onClick={() => handleDelete(file.id)}
              >
                <DeleteIcon />
              </IconButton>
            </div>
          </div>
        </div>
      ))}
      {fileToView && (
        <FileViewerModal
          open={Boolean(fileToView)}
          file={fileToView}
          onClose={() => setFileToView(null)}
        />
      )}
    </div>
  );
};

export default FileList;
