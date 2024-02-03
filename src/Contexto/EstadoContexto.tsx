import { Dispatch } from "react";

export type AppContextState = {
    usuario: any;
    setUsuario: Dispatch<React.SetStateAction<any>>;
}