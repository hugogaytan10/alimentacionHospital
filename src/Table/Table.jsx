import React, { useEffect, useState, useContext, useMemo } from "react";
import { useTable, usePagination, useFilters } from "react-table";
import { AppContext } from "../Contexto/AppContext";
import { unparse } from "papaparse";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./Table.css";
import logoPath from "../assets/logoHospital.jpg";
import { filter } from "jszip";
export const Table = () => {
  const contexto = useContext(AppContext);
  const [persona, setPersona] = useState("");
  const [alimento, setAlimento] = useState("");
  const [info, setInfo] = useState("");
  const [filterInput, setFilterInput] = useState("");
  const [rutFilter, setRutFilter] = useState("");
  const [dataMonth, setDataMonth] = useState([]);

  const [data, setData] = useState([]);
  const [activeTable, setActiveTable] = useState(1);
  const [indexPage, setIndexPage] = useState(1);

  const filterData = () => {
    let filteredData = [...dataMonth];

    if (filterInput) {
      filteredData = filteredData.filter(item =>
        item.NombreCompleto.toLowerCase().includes(filterInput.toLowerCase())
      );
    }

    if (rutFilter) {
      filteredData = filteredData.filter(item =>
        item.RUT.startsWith(rutFilter)
      );
    }

    setData(filteredData);
  };


  const BuscarRUT = async (rut) => {
    fetch(
      `https://becontrolvale-production.up.railway.app/api/persona/${rut}`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          token: contexto.usuario.Token,
        },
      }
    )
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
    fetch("https://becontrolvale-production.up.railway.app/api/alimento", {
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
  const fetchDataMonth = async (month) => {
    const url = `https://becontrolvale-production.up.railway.app/api/tabla/all/${month}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: contexto.usuario.Token,
        },
      });
      const jsonData = await response.json();
      setDataMonth(jsonData);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setDataMonth([]);
    }
  };
  const fetchData = async (tableType, pageIndex) => {
    const url = `https://becontrolvale-production.up.railway.app/api/tabla/month/${tableType}/${pageIndex}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: contexto.usuario.Token,
        },
      });
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setData([]);
    }
  };
  useEffect(() => {
    document.getElementById("BuscarRUT").showModal();
  }, []);
  useEffect(() => {
    if (indexPage !== 0) {
      fetchData(activeTable, indexPage);
      fetchDataMonth(activeTable);
    }
  }, [activeTable, indexPage]);

  useEffect(() => {
    filterData();
  }, [filterInput, rutFilter]);

  const columns = useMemo(
    () => [
      { Header: "Fecha", accessor: "Fecha" },
      { Header: "RUT", accessor: "RUT", filter: customRutFilter },
      {
        Header: "Nombre",
        accessor: "NombreCompleto",
        filter: "text",
      },
      { Header: "Alimentación", accessor: "Alimentacion" },
      { Header: "Unidad", accessor: "CC" },
      { Header: "Ley", accessor: "Ley" },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Array de filas para la página actual
    canPreviousPage, // Booleano que indica si hay una página anterior
    canNextPage, // Booleano que indica si hay una página siguiente
    setFilter,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
    },
    useFilters,
    usePagination
  );

  function customRutFilter(rows, id, filterValue) {
    return rows.filter((row) => {
      const rowValue = row.values[id];
      return rowValue !== undefined
        ? rowValue.toString().startsWith(filterValue)
        : true;
    });
  }

  const handleFilterChange = (e) => {
    const value = e.target.value || undefined;
    //setFilter("NombreCompleto", value);
    setFilterInput(value);
  };
  const handleFilterRutChange = (e) => {
    const value = e.target.value || undefined;
    //setFilter("RUT", value);
    setRutFilter(value);
  };
  const nextPage = () => {
    setIndexPage(indexPage + 1);
  };
  const previousPage = () => {
    if (indexPage > 1) {
      setIndexPage(indexPage - 1);
    }
  };

  const exportToCSV = (data, fileName) => {
    const csv = unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.csv`;
    link.click();
  };

  const exportToExcel = (data, fileName) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };
  const convertToBase64 = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  };

  const exportToPDF = async (data, fileName) => {
    try {
      const image = await convertToBase64(logoPath);
      const doc = new jsPDF();

      autoTable(doc, {
        didDrawPage: function (data) {
          if (data.pageNumber === 1 || data.cursor.y >= 15 + 10) {
            doc.addImage(image, 'JPEG', data.settings.margin.left, 10, 30, 15);
          }
        },
        margin: { top: 40 },
        head: [["Fecha", "RUT", "Nombre", "Alimentación", "Unidad", "Ley"]],
        body: data.map((row) => [
          row.Fecha,
          row.RUT,
          row.NombreCompleto,
          row.Alimentacion,
          row.CC,
          row.Ley,
        ]),
        theme: 'grid'
      });

      doc.save(`${fileName}.pdf`);
    } catch (error) {
      console.error('Failed to load or convert image:', error);
    }
  };


  return (
    <div className="table-container">
      <div className="select-container justify-around">
        <select
          onChange={(e) => setActiveTable(e.target.value)}
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

        <button
          onClick={() => {
            document.getElementById("BuscarRUT").showModal();
          }}
          className="btn bg-blue-700 text-gray-100 border-2 border-blue-700"
        >
          INSERTAR
        </button>
      </div>

      <div className="flex flex-wrap justify-end gap-2">
        <input
          value={filterInput}
          onChange={handleFilterChange}
          placeholder={"Buscar por nombre..."}
          className="input input-info w-full max-w-xs bg-white border-gray-300 h-10 w-40"
        />
        <input
          value={rutFilter}
          onChange={handleFilterRutChange}
          placeholder={"Buscar por RUT..."}
          className="input input-info w-full max-w-xs bg-white border-gray-300 h-10 w-40"
        />
      </div>

      <div className="flex justify-end gap-2 mt-2">
        <button
          onClick={() => exportToCSV(dataMonth, "Alimentacion_hospital")}
          className="bg-green-500 px-2 py-2 rounded-lg text-gray-100"
        >
          Exportar a CSV
        </button>
        <button
          onClick={() => exportToExcel(dataMonth, "Alimentacion_hospital")}
          className="bg-green-500 px-2 py-2 rounded-lg text-gray-100"
        >
          Exportar a Excel
        </button>
        <button
          onClick={() => exportToPDF(dataMonth, "Alimentacion_hospital")}
          className="bg-red-500 text-gray-100 rounded-lg px-2 py-2"
        >
          Exportar a PDF
        </button>
      </div>

      <table {...getTableProps()} className="table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="flex justify-end gap-2 mt-2">
        <button
          onClick={() => previousPage()}
          className={`px-2 py-1 text-white font-semibold rounded-lg ${indexPage > 0 ? "bg-blue-800 hover:bg-blue-700" : "bg-gray-400"
            }`}
        >
          Anterior
        </button>
        <button
          onClick={() => nextPage()}
          className={`px-2 py-1 text-gray-100 font-semibold rounded-lg bg-blue-800 hover:bg-blue-700 
    }`}
        >
          Siguiente
        </button>
      </div>
      <div className="flex justify-end text-gray-600">Página {indexPage}</div>

      <dialog id="BuscarRUT" className="modal">
        <div className="modal-box bg-white">
          <h3 className="font-bold text-lg">BUSCAR PERSONA POR RUT</h3>
          <p className="py-4">Presiona ESC para cerrar</p>
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
              <div className="flex flex-wrap w-full gap-2">
                <button className="btn w-1/4 m-auto block bg-blue-500 text-gray-100 border-blue-500">Buscar</button>
                <button
                  className="btn w-1/4 m-auto block bg-white text-blue-700 border-blue-500"
                  onClick={() => document.getElementById("BuscarRUT").close()}
                >
                  Cerrar
                </button>
              </div>
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
                  Fecha: e.target.fecha.value + " " + e.target.hora.value,
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
                className="google-input bg-gray-300"
                value={persona.Nombre}
                readOnly
              />
              <label className="label">
                <span className="label-text text-gray-600">RUT</span>
              </label>
              <input
                type="text"
                placeholder="RUT"
                name="1060504-K"
                id="rut"
                className="google-input bg-gray-300"
                value={persona.RUT}
                readOnly
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
              <label className="label">
                <span className="label-text text-gray-600">Fecha</span>
              </label>
              <input
                type="date"
                name="fecha"
                id="fecha"
                className="google-input bg-gray-300"
              />
              <label className="label">
                <span className="label-text text-gray-600">Hora</span>
              </label>
              <input
                type="time"
                name="hora"
                id="hora"
                className="google-input bg-gray-300"
              />
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
