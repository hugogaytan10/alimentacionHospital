import React, { useContext, useEffect, useState } from "react";
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
pdfMake.vfs = vfsFonts.pdfMake.vfs;

export const TableAdmin = () => {
  const [data, setData] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [persona, setPersona] = useState({});
  const contexto = useContext(AppContext);
  const traerDatos = async (id) => {
    fetch(`https://becontrolvale-production.up.railway.app/api/persona/${id}`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: contexto.usuario.Token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPersona(data);
      });
  };
  const TraerUnidades = async () => {
    fetch(`https://becontrolvale-production.up.railway.app/api/unidad`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: contexto.usuario.Token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUnidades(data);
      });
  };
  const ActualizarPersona = async (persona) => {
    fetch(`https://becontrolvale-production.up.railway.app/api/persona/${persona.RUT}`, {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: contexto.usuario.Token,
      },
      body: JSON.stringify(persona),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        document.getElementById("my_modal_1").close();
      });
  };
  const ReactivarPersona = async (persona) => {
    const actualizarPersona = {
      Estado: 1,
      Nombre: persona.Nombre,
      RUT: persona.RUT,
      Unidad_Id: persona.Unidad_Id,
      Ley: persona.Ley,
    };
    fetch(`https://becontrolvale-production.up.railway.app/api/persona/${persona.RUT}`, {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: contexto.usuario.Token,
      },
      body: JSON.stringify(actualizarPersona),
    })
      .then((response) => response.json())
      .then((data) => {
        document.getElementById("my_modal_1").close();
      });
  };
  const EliminarPersona = async (id) => {
    fetch(`https://becontrolvale-production.up.railway.app/api/persona/eliminar/${id}`, {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: contexto.usuario.Token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        document.getElementById("my_modal_2").close();
      });
  };
  const GuardarPersona = async (persona) => {
    fetch(`https://becontrolvale-production.up.railway.app/api/persona`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        token: contexto.usuario.Token,
      },
      body: JSON.stringify(persona),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        //refrescar la tabla
        document.getElementById("my_modal_3").close();
      });
  };
  const DataTabla = () => {
    fetch("https://becontrolvale-production.up.railway.app/api/personaUnidad", {
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
    TraerUnidades();
    DataTabla();

    // Limpiar DataTable al desmontar el componente
    return () => {
      if ($.fn.DataTable.isDataTable("#myTable2")) {
        $("#myTable2").DataTable().destroy();
      }
    };
  }, []);

  useEffect(() => {
    if ($.fn.DataTable.isDataTable("#myTable2")) {
      $("#myTable2").DataTable().destroy();
    }
    if (data.length > 0) {
      new DataTable("#myTable2", {
        paging: true,
        searching: true,
        responsive: true,
        pageLength: 5,
        dom: "Bfrtip", // Agrega 'B' para botones
        buttons: [
          {
            extend: "excelHtml5",
            className: "btn bg-green-600 text-gray-200 border-none", // Añadir clase personalizada
          },
          {
            extend: "csvHtml5",
            className: "btn bg-green-600 text-gray-200 border-none", // Añadir clase personalizada
          },
          {
            extend: "pdfHtml5",
            className: "btn bg-red-600 text-gray-200 border-none", // Añadir clase personalizada
          },
          {
            extend: "print",
            className: "btn bg-black text-gray-200 border-none", // Añadir clase personalizada
          },
        ],
      });
    }
  }, [data]);

  return (
    <div className="w-3/4 m-auto h-full ">
      <div className="w-full flex justify-end">
        <button
          onClick={() => {
            document.getElementById("my_modal_3").showModal();
          }}
          className="btn bg-blue-700 text-gray-50 border-2 border-blue-700"
        >
          Insertar Registro
        </button>
      </div>
      {data.length > 0 ? (
        <table id="myTable2" className="block h-full ">
          <thead>
            <tr>
              <th>RUT</th>
              <th>Nombre</th>
              <th>Unidad</th>
              <th>Ley</th>
              <th>Accion</th>
              <th>Accion</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 &&
              data.map((item, index) => (
                <tr key={`renglon-${item.RUT}`}>
                  <td>{item.RUT}</td>
                  <td>{item.Nombre}</td>
                  <td>{item.Unidad}</td>
                  <td>{item.Ley}</td>
                  <td>
                    <button
                      onClick={() => {
                        traerDatos(item.RUT);
                        document.getElementById("my_modal_1").showModal();
                      }}
                      className="btn bg-blue-700 text-gray-50 border-2 border-blue-700"
                    >
                      EDITAR
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        traerDatos(item.RUT);
                        document.getElementById("my_modal_2").showModal();
                      }}
                      className="btn bg-red-500 text-gray-50 border-red-500 border-2"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <h1 className="text-xl text-gray-900">
            No hay registros o estamos cargando tus datos
          </h1>
        </div>
      )}

      <dialog id="my_modal_3" className="modal">
        <div className="modal-box bg-white">
          <h3 className="font-bold text-lg">Insertar</h3>
          <p className="py-4">Llene los campos y presione el boton "Guardar"</p>
          <div className="modal-action block">
            <form
              method="dialog w-full"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <label className="form-control w-full ">
                <div className="label">
                  <span className="label-text text-black">RUT</span>
                </div>
                <input
                  type={"text"}
                  name={"rut"}
                  id={"rut"}
                  className="google-input"
                  placeholder={"1000JDJD-K"}
                  onChange={(e) => {
                    setPersona({ ...persona, RUT: e.target.value });
                  }}
                />
              </label>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text text-black">Nombre Completo</span>
                </div>
                <input
                  type={"text"}
                  name={"nombre"}
                  id={"nombre"}
                  className="google-input"
                  placeholder={"Juan Perez"}
                  onChange={(e) => {
                    setPersona({ ...persona, Nombre: e.target.value });
                  }}
                />
              </label>

              <label className="form-control w-full ">
                <div className="label">
                  <span className="label-text text-black">Unidad</span>
                </div>
                <select
                  onChange={(e) => {
                    setPersona({ ...persona, Unidad_Id: e.target.value });
                  }}
                  className="select select-bordered w-full bg-white"
                >
                  <option disabled selected>
                    Unidad
                  </option>

                  {unidades.map((item, index) => (
                    <option key={`unidad-${item.Id}`} value={item.Id}>
                      {item.Nombre}
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-control w-full ">
                <div className="label">
                  <span className="label-text text-black">Ley</span>
                </div>
                <input
                  type={"text"}
                  name={"ley"}
                  id={"ley"}
                  className="google-input"
                  placeholder={"18834"}
                  onChange={(e) => {
                    setPersona({ ...persona, Ley: e.target.value });
                  }}
                />
              </label>

              <div className="w-full flex flex-wrap justify-around">
                <button
                  className="btn bg-blue-700 text-gray-50 w-1/4"
                  onClick={() => {
                    GuardarPersona(persona);
                  }}
                >
                  Guardar
                </button>

                <button
                  className="btn border-red-500 text-red-500 bg-white w-1/4"
                  onClick={() => {
                    document.getElementById("my_modal_3").close();
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>

      <dialog id="my_modal_1" className="modal">
        <div className="modal-box bg-white">
          <h3 className="font-bold text-lg">EDITAR</h3>
          <p className="py-4">
            Edite los campos que desee y presione el boton "Guardar"
          </p>
          <div className="modal-action block">
            <form
              method="dialog w-full"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              {/* if there is a button in form, it will close the modal */}
              <label className="form-control w-full ">
                <div className="label">
                  <span className="label-text text-black">RUT</span>
                </div>
                <input
                  type={"text"}
                  name={"rut"}
                  id={"rut"}
                  className="google-input"
                  value={persona.RUT}
                  onChange={(e) => {
                    setPersona({ ...persona, RUT: e.target.value });
                  }}
                />
              </label>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text text-black">Nombre Completo</span>
                </div>
                <input
                  type={"text"}
                  name={"nombre"}
                  id={"nombre"}
                  className="google-input"
                  value={persona.Nombre}
                  onChange={(e) => {
                    setPersona({ ...persona, Nombre: e.target.value });
                  }}
                />
              </label>

              <label className="form-control w-full ">
                <div className="label">
                  <span className="label-text text-black">Unidad</span>
                </div>
                <select
                  value={persona.Unidad_Id}
                  onChange={(e) => {
                    setPersona({ ...persona, Unidad_Id: e.target.value });
                  }}
                  className="select select-bordered w-full bg-white"
                >
                  <option disabled selected>
                    Unidad
                  </option>

                  {unidades.map((item, index) => (
                    <option key={`unidad-${item.Id}`} value={item.Id}>
                      {item.Nombre}
                    </option>
                  ))}
                </select>
              </label>

              <label className="form-control w-full ">
                <div className="label">
                  <span className="label-text text-black">Ley</span>
                </div>
                <input
                  type={"text"}
                  name={"ley"}
                  id={"ley"}
                  className="google-input"
                  value={persona.Ley}
                  onChange={(e) => {
                    setPersona({ ...persona, Ley: e.target.value });
                  }}
                />
              </label>

              <div className="w-full flex flex-wrap justify-around">
                <button
                  className="btn bg-blue-700 text-gray-50 w-1/4"
                  onClick={() => {
                    ActualizarPersona(persona);
                  }}
                >
                  Guardar
                </button>
                {persona.Estado === 0 && (
                  <button
                    className="btn bg-red-700 text-gray-50 w-1/4"
                    onClick={() => {
                      ReactivarPersona(persona);
                    }}
                  >
                    Reactivar
                  </button>
                )}

                <button
                  className="btn border-red-500 text-red-500 bg-white w-1/4"
                  onClick={() => {
                    document.getElementById("my_modal_1").close();
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>

      <dialog id="my_modal_2" className="modal">
        <div className="modal-box bg-white">
          <h3 className="font-bold text-lg">Eliminar</h3>
          <p className="py-4">
            Estas seguro que deseas eliminar a {persona.Nombre} con RUT{" "}
            {persona.RUT} ?
          </p>
          <div className="modal-action block">
            <form
              method="dialog w-full"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className="w-full flex flex-wrap justify-around">
                <button
                  className="btn bg-red-700 text-gray-50 w-1/4"
                  onClick={() => {
                    EliminarPersona(persona.RUT);
                  }}
                >
                  Eliminar
                </button>

                <button
                  className="btn border-red-500 text-red-500 bg-white w-1/4"
                  onClick={() => {
                    document.getElementById("my_modal_2").close();
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};
