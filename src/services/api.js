import axios from 'axios';

// Set the base URL for the Django API
const API_URL = 'http://127.0.0.1:8000/api/';

// Helper function to get auth headers
const getAuthHeaders = (authTokens) => {
  return {
    headers: {
      Authorization: `Bearer ${authTokens.access}`
    }
  };
};

// API to login
export const loginUser = async (email, password) => {
  return axios.post(`${API_URL}login/`, { email, password });
};

// API to signup
export const signupUser = async (email, password, firstName, lastName) => {
  return axios.post(`${API_URL}signup/`, { email, password, first_name: firstName, last_name: lastName });
};

// API to get list of folders
export const getFolders = async (authTokens) => {
  return axios.get(`${API_URL}folders/`, getAuthHeaders(authTokens));
};

// API to create a new folder
export const createFolder = async (authTokens, folderName,parentFolderId) => {
  if(parentFolderId){
    return axios.post(`${API_URL}folders/`, { name: folderName,parent_folder:parentFolderId }, getAuthHeaders(authTokens));
  }
  return axios.post(`${API_URL}folders/`, { name: folderName }, getAuthHeaders(authTokens));
};

// API to delete a folder
export const deleteFolder = async (authTokens, folderId) => {
  return axios.delete(`${API_URL}folders/${folderId}/`, getAuthHeaders(authTokens));
};

// Upload file API function with file metadata
export const uploadFile = async (authTokens, file, folderId, fileName, fileType, fileSize) => {
  const formData = new FormData();
  formData.append('file', file); // Append the file itself
  formData.append('file_name', fileName); // Append file name
  formData.append('file_type', fileType); // Append file type (MIME type)
  formData.append('file_size', fileSize); // Append file size

  if (folderId) {
    formData.append('folder', folderId);
  }

  return axios.post(`${API_URL}files/`, formData, {
    headers: {
      Authorization: `Bearer ${authTokens.access}`,
      'Content-Type': 'multipart/form-data',
    },
  });
};

// API to get list of files in a folder
export const getFiles = async (authTokens, folderId) => {
  if (folderId) {
    return axios.get(`${API_URL}files/?folder=${folderId}`, getAuthHeaders(authTokens));
  }
  return axios.get(`${API_URL}files/`, getAuthHeaders(authTokens));
};

// API to delete a file
export const deleteFile = async (authTokens, fileId) => {
  return axios.delete(`${API_URL}files/${fileId}/`, getAuthHeaders(authTokens));
};

// API to download a file
export const downloadFile = async (authTokens, fileData) => {
  return await axios.get(`${fileData.file}`, {
    headers: {
      Authorization: `Bearer ${authTokens.access}`
    },
    responseType: 'blob',
  });
};

export const getFileInfo = async (authTokens, fileId) => {
  return axios.get(`${API_URL}files/${fileId}`, getAuthHeaders(authTokens));
};