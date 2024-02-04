import React, { useContext, useEffect } from "react";
import { BrowserRouter, Route, Routes, NavLink } from "react-router-dom";
import { AppContext } from "../Contexto/AppContext";
import { Table } from "../Table/Table";
import { TableAdmin } from "../TableAdmin/TableAdmin";
import { Login } from "../Login/Login";

export const Rutas = () => {
  const contexto = useContext(AppContext);

  return (
    <div className="h-screen">
      <BrowserRouter>
        {contexto.usuario.Tipo == 1 && (
          <nav className="h-10 ">
            <ul className="h-full w-full flex items-center justify-end gap-1 bg-white">
              <NavLink
                className="font-bold text-gray-50 w-20 text-center bg-blue-800 rounded-md"
                to="/listado"
              >
                LISTADO
              </NavLink>
              <NavLink
                className="font-bold text-gray-50 w-20 text-center bg-blue-800 rounded-md"
                to="/admin"
              >
                ABD
              </NavLink>
            </ul>
          </nav>
        )}
        <div className="h-5/6">
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/listado" element={<Table />} />
                <Route path="/admin" element={<TableAdmin />} />
            </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};
