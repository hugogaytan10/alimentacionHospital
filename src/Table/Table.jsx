import React, { useEffect, useState, useContext, useRef } from "react";
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
  const [persona, setPersona] = useState("");
  const [alimento, setAlimento] = useState("");
  const contexto = useContext(AppContext);
  const [info, setInfo] = useState("");
  const [dataActivos, setDataActivos] = useState([]);
  const [dataInactivos, setDataInactivos] = useState([]);
  const [activeTable, setActiveTable] = useState("data");

  const tableRef = useRef(null);
  const tableRefActivos = useRef(null);
  const tableRefInactivos = useRef(null);

  const BuscarRUT = async (rut) => {
    fetch(`http://localhost:8090/api/persona/${rut}`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: contexto.usuario.Token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data != null) {
          setPersona(data);
          document.getElementById("BuscarRUT").close();
          document.getElementById("InsertarAlimento").showModal();
        } else {
          setInfo("No se encontro el RUT");
        }
      });
  };

  const InsertarAlimento = async (alimento) => {
    fetch("http://localhost:8090/api/alimento", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: contexto.usuario.Token,
      },
      body: JSON.stringify(alimento),
    })
      .then((response) => response.json())
      .then((data) => {
        setAlimento(data);
      });
  };
  const fetchAndSetData = async (url, setDataFunction) => {
    const response = await fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: contexto.usuario.Token,
      },
    });
    const result = await response.json();
    setDataFunction(result);
  };

  const TablaMes = (mes) => {
    setActiveTable("data");
    fetchAndSetData(`http://localhost:8090/api/tabla/${mes}`, setData);
  };

  const Inactivos = () => {
    setActiveTable("dataInactivos");
    fetchAndSetData("http://localhost:8090/api/tabla/deleted", setDataInactivos);
  };

  const Activos = () => {
    setActiveTable("dataActivos");
    fetchAndSetData("http://localhost:8090/api/tabla/active", setDataActivos);
  };

  const destroyTable = (tableId) => {
    if ($.fn.DataTable.isDataTable(`#${tableId}`)) {
      $(`#${tableId}`).DataTable().clear().destroy();
    }
  };

  const initializeDataTable = (tableId, data) => {
    $(`#${tableId}`).DataTable({
      data: data,
      columns: [
        { title: "Fecha", data: "Fecha" },
        { title: "RUT", data: "RUT" },
        { title: "Nombre", data: "NombreCompleto" },
        { title: "Alimentación", data: "Alimentacion" },
        { title: "Unidad", data: "CC" },
        { title: "Ley", data: "Ley" },
      ],
      paging: true,
      searching: true,
      responsive: true,
      pageLength: 5,
      dom: "Bfrtip", // Agrega 'B' para botones
      buttons: [
        {
          extend: "excelHtml5",
          className: "btn bg-green-600 text-gray-200 border-none",
        },
        {
          extend: "csvHtml5",
          className: "btn bg-green-600 text-gray-200 border-none",
        },
        {
          extend: "pdfHtml5",
          className: "btn bg-red-600 text-gray-200 border-none",
        },
        {
          extend: "print",
          className: "btn bg-black text-gray-200 border-none",
        },
      ],
    });
  };

  useEffect(() => {
    fetchAndSetData("http://localhost:8090/api/tabla", setData);
    document.getElementById("BuscarRUT").showModal();
  }, []);

  useEffect(() => {
    destroyTable("dataTable");
    if (activeTable === "data") {
      initializeDataTable("dataTable", data);
    }
  }, [data, activeTable]);

  useEffect(() => {
    destroyTable("dataActivosTable");
    if (activeTable === "dataActivos") {
      initializeDataTable("dataActivosTable", dataActivos);
    }
  }, [dataActivos, activeTable]);

  useEffect(() => {
    destroyTable("dataInactivosTable");
    if (activeTable === "dataInactivos") {
      initializeDataTable("dataInactivosTable", dataInactivos);
    }
  }, [dataInactivos, activeTable]);

  return (
    <div className="w-3/4 m-auto">
      <div className="flex flex-wrap w-full justify-around">
        <select
          onChange={(e) => {
            TablaMes(e.target.value);
          }}
          className="select select-info w-full max-w-xs bg-white border-black mb-20"
        >
          <option disabled selected defaultValue={1}>
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
        <div className="form-control border-2 h-12 rounded-lg">
          <label className="label cursor-pointer">
            <span className="label-text text-gray-800">Inactivos</span>
            <input
              type="radio"
              name="radio-10"
              className="ml-2 radio checked:bg-blue-500"
              onChange={Inactivos}
            />
          </label>
        </div>
        <div className="form-control border-2 h-12 rounded-lg">
          <label className="label cursor-pointer">
            <span className="label-text text-gray-800">Activos</span>
            <input
              type="radio"
              name="radio-10"
              className="ml-2 radio checked:bg-blue-500"
              onChange={Activos}
            />
          </label>
        </div>
        <button
          onClick={() => {
            document.getElementById("BuscarRUT").showModal();
          }}
          className="btn bg-blue-700 text-gray-100 border-2 border-blue-700"
        >
          INSERTAR
        </button>
      </div>
      {activeTable === "data" && data.length > 0 && (
        <div className={activeTable === "data" ? "block" : "hidden"}>
          <table id="dataTable" className="display">
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
                <tr key={`renglon-${item.RUT}-${index}`}>
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
        </div>
      )}

      {activeTable === "dataActivos" && dataActivos.length > 0 && (
        <div className={activeTable === "dataActivos" ? "block" : "hidden"}>

          <table id="dataActivosTable" className="display">
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
                <tr key={`renglon-${item.RUT}-${index * 17}`}>
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
        </div>
      )}

      {activeTable === "dataInactivos" && dataInactivos.length > 0 && (
        <div className={activeTable === "dataInactivos" ? "block" : "hidden"}>
          <table id="dataInactivosTable" className="display">
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
                <tr key={`renglon-${item.RUT}-${index * 13}`}>
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
        </div>
      )}
      {data.length === 0 &&
        dataActivos.length === 0 &&
        dataInactivos.length === 0 && (
          <div className="flex justify-center items-center h-96">
            <h1 className="text-3xl text-gray-600">No hay datos</h1>
          </div>
        )}

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

      <dialog id="BuscarRUT" className="modal">
        <div className="modal-box bg-white">
          <h3 className="font-bold text-lg">BUSCAR PERSONA POR RUT</h3>
          <p className="py-4">
            Presiona ESC para cerrar
          </p>
          <div className="modal-action block">
            <form
              method="dialog w-full"
              onSubmit={(e) => {
                if (e.target.rut.value === "") {
                  e.preventDefault();
                  setInfo("Ingrese un RUT");                  
                } else {
                  e.preventDefault();
                  BuscarRUT(e.target.rut.value);
                }
              }}
            >
              <input
                type={"text"}
                placeholder={"RUT"}
                name={"rut"}
                id={"rut"}
                className="google-input"
              />
              <p className="text-center block w-full text-red-600">{info}</p>
              <button className="btn w-1/2 m-auto block">Buscar</button>
            </form>
          </div>
        </div>
      </dialog>

      <dialog id="InsertarAlimento" className="modal">
        <div className="modal-box bg-white">
          <h3 className="font-bold text-lg">INSERTAR ALIMENTO</h3>
          <div className="modal-action block">
            <form
              method="dialog w-full"
              onSubmit={(e) => {
                e.preventDefault();
                const alimento = {
                  Persona_RUT: e.target.rut.value,
                  Alimentacion: e.target.alimentacion.value,
                  Usuario_Id: contexto.usuario.Id,
                };
                InsertarAlimento(alimento);
                document.getElementById("InsertarAlimento").close();
              }}
            >
              <label className="label">
                <span className="label-text text-gray-600">Nombre</span>
              </label>
              <input
                type="text"
                placeholder="Hugo Gaytan"
                name="nombre"
                id="nombre"
                className="google-input"
                value={persona.Nombre}
              />
              <label className="label">
                <span className="label-text text-gray-600">RUT</span>
              </label>
              <input
                type="text"
                placeholder="RUT"
                name="1060504-K"
                id="rut"
                className="google-input"
                value={persona.RUT}
              />
              <label className="label">
                <span className="label-text text-gray-600">Alimentación</span>
              </label>
              <select
                name="alimentacion"
                id="alimentacion"
                className="select select-info w-full max-w-xs bg-white"
              >
                <option value="DESAYUNO">DESAYUNO</option>
                <option value="ALMUERZO">ALMUERZO</option>
                <option value="CENA">CENA</option>
              </select>
              <div className="w-full flex flex-wrap justify-around">
                <button className="btn block mt-4 bg-blue-500 text-gray-200 border-blue-500 w-1/4 m-auto">
                  Insertar
                </button>
                <button
                  className="btn block mt-4 bg-white text-blue-700 border-blue-500 w-1/4 m-auto"
                  onClick={() =>
                    document.getElementById("InsertarAlimento").close()
                  }
                >
                  Cerrar
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};
