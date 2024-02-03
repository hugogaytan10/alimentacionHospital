import React, { useContext, useEffect } from "react";
import { BrowserRouter, Route, Routes, NavLink } from "react-router-dom";
import { AppContext } from "../Contexto/AppContext";
import { Table } from "../Table/Table";
import { TableAdmin } from "../TableAdmin/TableAdmin";

export const Rutas = () => {
  const contexto = useContext(AppContext);

  return (
    <div className="h-screen">
      <BrowserRouter>
        {contexto.usuario.Tipo == 1 && (
          <nav className="h-10 ">
            <ul className="h-full w-full flex items-center justify-around bg-white">
              <NavLink
                className="font-bold text-gray-50 w-1/2 text-center bg-gray-500"
                to="/listado"
              >
                LISTADO
              </NavLink>
              <NavLink
                className="font-bold text-gray-50 w-1/2 text-center bg-gray-500"
                to="/admin"
              >
                ABD
              </NavLink>
            </ul>
          </nav>
        )}
        <div className="h-5/6">
            <Routes>
                <Route path="/listado" element={<Table />} />
                <Route path="/admin" element={<TableAdmin />} />
            </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};
