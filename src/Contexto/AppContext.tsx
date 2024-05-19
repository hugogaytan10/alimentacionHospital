import React, { useState, useMemo, createContext } from "react";

import { AppContextState } from "./EstadoContexto";
type Props = {
    children: React.ReactNode
}
export const AppContext = createContext({} as AppContextState);


const AppProvider: React.FC<Props> = ({ children }) => {
    const [usuario, setUsuario] = useState({
        Id: '', User: '', Contrasenia: '', Tipo: 0, Token: ''
    });

    const memoizedValue = useMemo(() => ({
        usuario: usuario,
        setUsuario: setUsuario
    }), [usuario]);

    return (
        <AppContext.Provider value={memoizedValue}>
            {children}
        </AppContext.Provider>
    );
};

export default AppProvider;