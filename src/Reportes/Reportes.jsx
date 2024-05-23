import React, { useRef, useContext, useState } from 'react';
import Chart from 'chart.js/auto';
import { AppContext } from "../Contexto/AppContext";
import './Reportes.css';

export const Reportes = () => {
    const contexto = useContext(AppContext);

    const chartRef = useRef(null);
    const canvasRef = useRef(null);
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFin, setHoraFin] = useState('');
    const [mes, setMes] = useState('');
    const [anio, setAnio] = useState('');

    const reportehoy = () => {
        fetch('http://localhost:8090/api/reporte/hoy', {
            method: 'GET',
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                token: contexto.usuario.Token,
            },
        })
            .then(res => res.json())
            .then(data => {
                if (data.length > 0) {
                    const ctx = canvasRef.current.getContext('2d');

                    // Destruir el gráfico existente si lo hay
                    if (chartRef.current) {
                        chartRef.current.destroy();
                    }

                    // Crear un nuevo gráfico y guardarlo en chartRef
                    chartRef.current = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: data.map(row => row.Alimentacion),
                            datasets: [
                                {
                                    label: 'Alimentos',
                                    data: data.map(row => row.Total),
                                },
                            ],
                        },
                    });
                }else{
                    alert("No hay datos para mostrar");
                }
            }).catch(err => {
                console.log(err);
            });
    };

    const reporteHorasHoy = () => {
        fetch(`http://localhost:8090/api/reporte/horas/${horaInicio}/${horaFin}`, {
            method: 'GET',
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                token: contexto.usuario.Token,
            },
        })
            .then(res => res.json())
            .then(data => {
                if (data.length > 0) {
                    const ctx = canvasRef.current.getContext('2d');

                    // Destruir el gráfico existente si lo hay
                    if (chartRef.current) {
                        chartRef.current.destroy();
                    }

                    // Crear un nuevo gráfico y guardarlo en chartRef
                    chartRef.current = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: data.map(row => row.Alimentacion),
                            datasets: [
                                {
                                    label: 'Alimentos',
                                    data: data.map(row => row.Total),
                                },
                            ],
                        },
                    });
                    document.getElementById("my_modal_1").close();
                }else{
                    alert("No hay datos para mostrar");
                }
            }).catch(err => {
                console.log(err);
            });
    };

    const reporteFechas = () => {
        fetch(`http://localhost:8090/api/reporte/dias/${fechaInicio}/${fechaFin}`, {
            method: 'GET',
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                token: contexto.usuario.Token,
            },
        })
            .then(res => res.json())
            .then(data => {
                if (data.length > 0) {
                    const ctx = canvasRef.current.getContext('2d');

                    // Destruir el gráfico existente si lo hay
                    if (chartRef.current) {
                        chartRef.current.destroy();
                    }

                    // Crear un nuevo gráfico y guardarlo en chartRef
                    chartRef.current = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: data.map(row => row.Alimentacion),
                            datasets: [
                                {
                                    label: 'Alimentos',
                                    data: data.map(row => row.Total),
                                },
                            ],
                        },
                    });
                    document.getElementById("my_modal_2").close();
                }else{
                    alert("No hay datos para mostrar");
                }
            }).catch(err => {
                console.log(err);
            });
    };

    const reporteMes = () => {
        fetch(`http://localhost:8090/api/reporte/mes/${mes}/${anio}`, {
            method: 'GET',
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                token: contexto.usuario.Token,
            },
        })
            .then(res => res.json())
            .then(data => {
                if (data.length > 0) {
                    const ctx = canvasRef.current.getContext('2d');

                    // Destruir el gráfico existente si lo hay
                    if (chartRef.current) {
                        chartRef.current.destroy();
                    }

                    // Crear un nuevo gráfico y guardarlo en chartRef
                    chartRef.current = new Chart(ctx, {
                        type: 'bar',
                        data: {
                            labels: data.map(row => row.Alimentacion),
                            datasets: [
                                {
                                    label: 'Alimentos',
                                    data: data.map(row => row.Total),
                                },
                            ],
                        },
                    });
                    document.getElementById("my_modal_3").close();
                }else{
                    alert("No hay datos para mostrar");
                }
            }).catch(err => {
                console.log(err);
            });
    };

    return (
        <div>
            <div className="button-container">
                <button onClick={reportehoy}>Mostrar Gráfico Hoy</button>
                <button onClick={() => { document.getElementById("my_modal_1").showModal(); }}>
                    Mostrar Gráfico Horas Hoy
                </button>
                <button onClick={() => { document.getElementById("my_modal_2").showModal(); }}>
                    Mostrar Gráfico Fechas
                </button>
                <button
                    onClick={() => { document.getElementById("my_modal_3").showModal(); }}>
                    Mostrar Gráfico Mes
                </button>
            </div>
            <div className="canvas-container">
                <canvas ref={canvasRef}></canvas>
            </div>
            <dialog id="my_modal_1" className="modal">
                <div className="modal-box bg-white">
                    <h3 className="font-bold text-lg">Seleccione Hora de Inicio y Fin</h3>
                    <p className="py-4">Seleccione una hora de inicio y una hora de fin</p>
                    <div className="modal-action block">
                        <form
                            method="dialog w-full"
                            onSubmit={(e) => {
                                e.preventDefault();
                            }}
                        >
                            <label className="form-control w-full">
                                <div className="label">
                                    <span className="label-text text-black">Hora de Inicio</span>
                                </div>
                                <input
                                    type="time"
                                    onChange={(e) => {
                                        setHoraInicio(e.target.value);
                                    }}
                                    className="input input-bordered w-full bg-white"
                                />
                            </label>
                            <label className="form-control w-full mt-4">
                                <div className="label">
                                    <span className="label-text text-black">Hora de Fin</span>
                                </div>
                                <input
                                    type="time"
                                    onChange={(e) => {
                                        setHoraFin(e.target.value);
                                    }}
                                    className="input input-bordered w-full bg-white"
                                />
                            </label>

                            <div className="w-full flex flex-wrap justify-around mt-4">
                                <button
                                    className="btn bg-blue-700 text-gray-50 w-1/4"
                                    onClick={() => {
                                        reporteHorasHoy();
                                    }}
                                >
                                    Obtener
                                </button>

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
                    <h3 className="font-bold text-lg">Seleccione Fecha de Inicio y Fin</h3>
                    <p className="py-4">Seleccione una fecha de inicio y una fecha de fin</p>
                    <div className="modal-action block">
                        <form
                            method="dialog w-full"
                            onSubmit={(e) => {
                                e.preventDefault();
                            }}
                        >
                            <label className="form-control w-full">
                                <div className="label">
                                    <span className="label-text text-black">Fecha de Inicio</span>
                                </div>
                                <input
                                    type="date"
                                    onChange={(e) => {
                                        setFechaInicio(e.target.value);
                                    }}
                                    className="input input-bordered w-full bg-white"
                                />
                            </label>
                            <label className="form-control w-full mt-4">
                                <div className="label">
                                    <span className="label-text text-black">Fecha de Fin</span>
                                </div>
                                <input
                                    type="date"
                                    onChange={(e) => {
                                        setFechaFin(e.target.value);
                                    }}
                                    className="input input-bordered w-full bg-white"
                                />
                            </label>

                            <div className="w-full flex flex-wrap justify-around mt-4">
                                <button
                                    className="btn bg-blue-700 text-gray-50 w-1/4"
                                    onClick={() => {
                                        reporteFechas();
                                    }}
                                >
                                    Obtener
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
            <dialog id="my_modal_3" className="modal">
                <div className="modal-box bg-white">
                    <h3 className="font-bold text-lg">Graficos por mes</h3>
                    <p className="py-4">Seleccione un Mes y un año</p>
                    <div className="modal-action block">
                        <form
                            method="dialog w-full"
                            onSubmit={(e) => {
                                e.preventDefault();
                            }}
                        >
                            <label className="form-control w-full ">
                                <div className="label">
                                    <span className="label-text text-black">Mes</span>
                                </div>
                                <select
                                    onChange={(e) => {
                                        setMes(e.target.value);
                                    }}
                                    className="select select-bordered w-full bg-white"
                                >
                                    <option disabled selected>
                                        Mes
                                    </option>
                                    <option value="1">Enero</option>
                                    <option value="2">Febrero</option>
                                    <option value="3">Marzo</option>
                                    <option value="4">Abril</option>
                                    <option value="5">Mayo</option>
                                    <option value="6">Junio</option>
                                    <option value="7">Julio</option>
                                    <option value="8">Agosto</option>
                                    <option value="9">Septiembre</option>
                                    <option value="10">Octubre</option>
                                    <option value="11">Noviembre</option>
                                    <option value="12">Diciembre</option>
                                </select>
                                <div className="label">
                                    <span className="label-text text-black">Año</span>
                                </div>
                                <select
                                    onChange={(e) => {
                                        setAnio(e.target.value);
                                    }}
                                    className="select select-bordered w-full bg-white"
                                >
                                    <option disabled selected>
                                        Año
                                    </option>
                                    <option value="2021">2021</option>
                                    <option value="2022">2022</option>
                                    <option value="2023">2023</option>
                                    <option value="2024">2024</option>
                                    <option value="2025">2025</option>
                                    <option value="2026">2026</option>
                                </select>
                            </label>

                            <div className="w-full flex flex-wrap justify-around mt-4">
                                <button
                                    className="btn bg-blue-700 text-gray-50 w-1/4"
                                    onClick={() => {
                                        reporteMes();
                                    }}
                                >
                                    Obtener
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

        </div>

    );
};
