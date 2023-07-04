// AppContext.tsx

import React, { ReactNode, useEffect, useState } from 'react';
import { getToken } from '../utils/storage';

interface AppContextValue {
  isSignedIn: boolean;
  setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultAppContextValue: AppContextValue = {
  isSignedIn: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setIsSignedIn: () => {},
};

export const AppContext = React.createContext<AppContextValue>(
  defaultAppContextValue
);

interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
  children,
}) => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const token = await getToken();
      setIsSignedIn(!!token);
    };
    checkToken();
  }, []);

  return (
    <AppContext.Provider value={{ isSignedIn, setIsSignedIn }}>
      {children}
    </AppContext.Provider>
  );
};
