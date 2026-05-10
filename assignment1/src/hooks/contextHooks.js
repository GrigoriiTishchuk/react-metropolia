import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';

export const useUserContext = () => {
  const context = useContext(UserContext);
  
  if (!context) {
    throw new Error(
      'useUserContext must be used within a UserProvider. ' +
      'Wrap your component tree with <UserProvider> in App.jsx'
    );
  }
  
  return context;
};