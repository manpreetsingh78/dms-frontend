import React, { createContext, useState } from 'react';

// Create a context to manage folder state
const FolderContext = createContext();

export const FolderProvider = ({ children }) => {
  const [selectedFolder, setSelectedFolder] = useState(null);

  return (
    <FolderContext.Provider value={{ selectedFolder, setSelectedFolder }}>
      {children}
    </FolderContext.Provider>
  );
};

export default FolderContext;
