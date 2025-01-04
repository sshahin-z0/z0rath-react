import {createContext, useContext} from "react";

type Z0rathContextType = {
    apiKey: string;
    user: string | null;
    setUser: (user: Z0rathContextType["user"]) => void;
};

export const Z0rathContext = createContext<Z0rathContextType>({} as any);

export const useZ0rath = () => useContext(Z0rathContext);

