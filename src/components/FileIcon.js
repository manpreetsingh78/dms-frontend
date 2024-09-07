import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faFilePdf, faFileWord, faFileExcel, faFileImage, faFileVideo, faFileArchive, faFileAudio, faFileCode, faFileAlt, faFile 
} from '@fortawesome/free-solid-svg-icons';

const FileIcon = ({ fileType }) => {
  // Determine the icon based on the file type
  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'application/pdf':
        return faFilePdf;
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      case 'application/msword':
        return faFileWord;
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      case 'application/vnd.ms-excel':
        return faFileExcel;
      case 'image/jpeg':
      case 'image/png':
      case 'image/gif':
        return faFileImage;
      case 'video/mp4':
      case 'video/webm':
      case 'video/ogg':
        return faFileVideo;
      case 'application/zip':
      case 'application/x-7z-compressed':
      case 'application/x-rar-compressed':
        return faFileArchive;
      case 'audio/mpeg':
      case 'audio/mp3':
        return faFileAudio;
      case 'application/json':
      case 'text/plain':
        return faFileCode;
      case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
        return faFileAlt; // For PowerPoint presentations, etc.
      default:
        return faFile; // Default file icon for unknown types
    }
  };

  return (
    <FontAwesomeIcon color='gray' icon={getFileIcon(fileType)} size="5x" />
  );
};

export default FileIcon;
