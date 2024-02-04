import React, { useEffect, useState, useContext } from "react";
import DataTable from "datatables.net-dt";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import $ from "jquery";
import "datatables.net-responsive";
import "./Table.css";
import "datatables.net-buttons";
// @ts-ignore
import "datatables.net-buttons/js/buttons.html5.js";
import "datatables.net-buttons/js/buttons.print.js";
import jszip from "jszip";
import pdfMake from "pdfmake/build/pdfmake";
import vfsFonts from "pdfmake/build/vfs_fonts";
import { AppContext } from "../Contexto/AppContext";
import { TableAdmin } from "../TableAdmin/TableAdmin";
pdfMake.vfs = vfsFonts.pdfMake.vfs;

export const Table = () => {
  const [data, setData] = useState([]);
  const contexto = useContext(AppContext);
  const TablaMes = (mes) => {
    fetch(`http://localhost:8090/api/tabla/${mes}`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: contexto.usuario.Token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  };
  const Inactivos = () => {
    fetch("http://localhost:8090/api/tabla/deleted", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: contexto.usuario.Token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  };
  const Activos = () => {
    fetch("http://localhost:8090/api/tabla/active", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: contexto.usuario.Token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  };
  useEffect(() => {
    fetch("http://localhost:8090/api/tabla", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: contexto.usuario.Token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });

    // Limpiar DataTable al desmontar el componente
    return () => {
      if ($.fn.DataTable.isDataTable("#myTable")) {
        $("#myTable").DataTable().destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      new DataTable("#myTable", {
        paging: true,
        searching: true,
        responsive: true,
        pageLength: 5,
        dom: "Bfrtip", // Agrega 'B' para botones
        buttons: [
          "excelHtml5", // Botón para exportar a Excel
          "csvHtml5", // Botón para exportar a CSV
          "pdfHtml5", // Botón para exportar a PDF
          "print", // Botón para imprimir
        ],
      });
    }
  }, [data]);

  return (
    <div className="w-3/4 m-auto ">
      <div className="flex flex-wrap w-full justify-around">
        <select
          onChange={(e) => {
            TablaMes(e.target.value);
          }}
          className="select select-info w-full max-w-xs bg-white"
        >
          <option disabled selected>
            Selecciona un mes
          </option>
          <option value={1}>Enero</option>
          <option value={2}>Febrero</option>
          <option value={3}>Marzo</option>
          <option value={4}>Abril</option>
          <option value={5}>Mayo</option>
          <option value={6}>Junio</option>
          <option value={7}>Julio</option>
          <option value={8}>Agosto</option>
          <option value={9}>Septiembre</option>
          <option value={10}>Octubre</option>
          <option value={11}>Noviembre</option>
          <option value={12}>Diciembre</option>
        </select>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Inactivos</span>
            <input
              type="radio"
              name="radio-10"
              className="ml-2 radio checked:bg-red-500"
              onChange={() => Inactivos()}
            />
          </label>
        </div>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Activos</span>
            <input
              type="radio"
              name="radio-10"
              className="ml-2 radio checked:bg-blue-500"
              onChange={() => Activos()}
            />
          </label>
        </div>
      </div>
      <table id="myTable" className="display">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>RUT</th>
            <th>Nombre</th>
            <th>Alimentación</th>
            <th>Unidad</th>
            <th>Ley</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={`renglon-${item.RUT}`}>
              <td>{item.Fecha}</td>
              <td>{item.RUT}</td>
              <td>{item.NombreCompleto}</td>
              <td>{item.Alimentacion}</td>
              <td>{item.CC}</td>
              <td>{item.Ley}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Open the modal using document.getElementById('ID').showModal() method */}

      <dialog id="my_modal_1" className="modal">
        <div className="modal-box bg-white">
          <h3 className="font-bold text-lg">EDITAR</h3>
          <p className="py-4">
            Press ESC key or click the button below to close
          </p>
          <div className="modal-action block">
            <form method="dialog w-full">
              {/* if there is a button in form, it will close the modal */}

              <input
                type={"text"}
                placeholder={"RUT"}
                name={"rut"}
                id={"rut"}
                className="google-input"
              />
              <input
                type={"text"}
                placeholder={"Nombre"}
                name={"nombre"}
                id={"nombre"}
                className="google-input"
              />

              <button className="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};
