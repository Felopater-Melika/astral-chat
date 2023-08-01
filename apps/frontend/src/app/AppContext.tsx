import React, { ReactNode, useEffect, useState } from 'react';
import { getToken } from '../utils/storage';

import { Socket, io } from 'socket.io-client';

interface AppContextValue {
  isSignedIn: boolean;
  setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>;
  socket: Socket | null;
}

const defaultAppContextValue: AppContextValue = {
  isSignedIn: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setIsSignedIn: () => {},
  socket: null,
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
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const checkTokenAndEstablishSocket = async () => {
      const token = await getToken();
      setIsSignedIn(!!token);

      if (token) {
        const newSocket = io(`ws://192.168.0.82:3000`, {
          query: {
            authorization: `bearer ${token}`,
          },
        });

        setSocket(newSocket);
      }
    };
    checkTokenAndEstablishSocket();
  }, []);

  return (
    <AppContext.Provider value={{ isSignedIn, setIsSignedIn, socket }}>
      {children}
    </AppContext.Provider>
  );
};
