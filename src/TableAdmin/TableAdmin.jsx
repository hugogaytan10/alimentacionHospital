import React, { useEffect, useState } from "react";
import DataTable from "datatables.net-dt";
import "datatables.net-dt/css/jquery.dataTables.min.css";
import "datatables.net-responsive-dt/css/responsive.dataTables.min.css";
import $ from "jquery";
import "datatables.net-responsive";
import "./Table.css";
import 'datatables.net-buttons';
// @ts-ignore
import 'datatables.net-buttons/js/buttons.html5.js';
import 'datatables.net-buttons/js/buttons.print.js';
import jszip from 'jszip';
import pdfMake from 'pdfmake/build/pdfmake';
import vfsFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = vfsFonts.pdfMake.vfs;

export const TableAdmin = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8090/api/tabla", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
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
        responsive: true,
        dom: 'Bfrtip', // Agrega 'B' para botones
        buttons: [
          'excelHtml5', // Botón para exportar a Excel
          'csvHtml5',   // Botón para exportar a CSV
          'pdfHtml5',   // Botón para exportar a PDF
          'print'       // Botón para imprimir
        ]
      });
    }
  }, [data]);

  return (
    <div className="w-3/4 m-auto ">
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
          {/*
          
          <tr>
            <td>Row 1 Data 1</td>
            <td>Row 1 Data 2</td>
            <td>Row 1 Data 3</td>
            <td>Row 1 Data 4</td>
            <td>
              <button
                onClick={() =>
                  document.getElementById("my_modal_1").showModal()
                }
                className="btn bg-blue-800 text-gray-50"
              >
                EDITAR
              </button>
            </td>
            <td>
              <button className="btn bg-red-800 text-gray-50">ELIMINAR</button>
            </td>
          </tr>
              */}

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
