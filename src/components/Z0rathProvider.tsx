import React, {FC, PropsWithChildren} from "react";
import SocketListener from "./SocketListener";
import {Z0rathContext} from "./Z0rathContext";


const Z0rathProvider: FC<
    PropsWithChildren<{ apiKey: string; user?: string }>
> = ({children, apiKey: key, user: initUser}) => {
    const [user, setUser] = React.useState<string | null>(initUser ?? null);
    return (
        <Z0rathContext.Provider value={{user, apiKey: key, setUser}}>
            <SocketListener/>
            {children}
        </Z0rathContext.Provider>
    );
};

export default Z0rathProvider;
