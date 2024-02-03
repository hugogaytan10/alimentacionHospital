import React, { useContext, useState } from 'react'
import './Login.css'
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../Contexto/AppContext';
export const Login = () => {
    const [usuario, setUsuario] = useState('');
    const [contrasena, setContrasena] = useState('');
    const contexto = useContext(AppContext);
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('https://bechatpdf-production.up.railway.app/api/usuario/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ User: usuario, Contrasenia: contrasena })
        })
            .then(res => res.json())
            .then(data => {
                if (data.Tipo != null) {
                    contexto.setUsuario(data);
                    setTimeout(() => {
                        navigate('/chat');
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
                <button type="submit" className="btn login-button bg-blue-300 ">Iniciar Sesión</button>
            </form>
        </div>
    );
};
