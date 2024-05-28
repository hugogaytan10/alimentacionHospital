import React, { useContext, useState } from 'react'
import './Login.css'
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../Contexto/AppContext';
import logoHospital from '../assets/logoHospital.jpg';
export const Login = () => {
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const contexto = useContext(AppContext);
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('https://becontrolvale-production.up.railway.app/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ User: usuario, Contrasena: contrasena })
        })
            .then(res => res.json())
            .then(data => {
                if (data.Tipo != null) {
                    contexto.setUsuario(data);
                    setTimeout(() => {
                        navigate('/listado');
                    }, 1000)
                }
            }).catch(err => {
                document.getElementById('toast').classList.remove('hidden');
                setTimeout(() => {
                    document.getElementById('toast').classList.add('hidden');
                }, 3000)
            });
    };

    return (
        <div className="login-container">
            <div className="toast toast-top hidden" id='toast'>
                <div className="alert alert-info">
                    <span>Credenciales incorrectas</span>
                </div>
            </div>

            <img src={logoHospital} alt="Logo Hospital" className="absolute h-20 w-20 object-contain top-10 rounded-xl" />

            <form onSubmit={handleSubmit} className="login-form">
                <h2>Iniciar Sesión</h2>
                <div className="input-group">
                    <input
                        id="usuario"
                        type="text"
                        placeholder="Usuario"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                    />
                </div>
                <div className="input-group">
                    <input
                        id="contrasena"
                        type="password"
                        placeholder="Contraseña"
                        value={contrasena}
                        onChange={(e) => setContrasena(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSubmit(e);
                            }
                        }}
                    />
                </div>
                <button type="submit" className="btn login-button  ">Iniciar Sesión</button>
            </form>
        </div>
    );
};
