// AppContext.js
import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [userUid, setUserUid] = useState(null);
  const [username, setUsername] = useState('');
    
  const updateUserUid = (newUserUid) => {
    setUserUid(newUserUid);
  };

  const updateUsername = (newUsername) => {
    setUsername(newUsername);
  };

  return (
    <AppContext.Provider value={{ userUid, updateUserUid, username, updateUsername }}>
      {children}
    </AppContext.Provider>
  );
};
