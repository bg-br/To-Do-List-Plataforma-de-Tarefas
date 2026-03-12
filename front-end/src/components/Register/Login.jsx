// --- Importanções
import React, { useState } from 'react';
import axios from 'axios';
import SubmitionBar from "../SubmitionBar/SubmitionBar.jsx";
import Button from '../Button/Button.jsx'
import { useNavigate } from 'react-router-dom';

// --- Axios: Pra comunicação com back-end
const API = axios.create({
    baseURL: 'http://localhost:3001'
});

// --- Função Login
const Login = ({ handleUserLogin }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [logUser, setLogUser] = useState({
        email: "",
        senha: ""
    });

    // Lidando com submissão
    const handleSubmition = (fieldName) => (value) => {
        setLogUser(prev => ({
            ...prev,
            [fieldName]: value
        }));
        setError("");
    };

    // Lidando com Login
    const handleLogin = async () => {
        // Validação básica
        if (!logUser.email || !logUser.senha) {
            setError("Todos os campos são obrigatórios!");
            return;
        }

        // Validação de email simples
        if (!logUser.email.includes('@') || !logUser.email.includes('.')) {
            setError("Email inválido!");
            return;
        }

        setLoading(true);
        setError("");

        try {
            // Enviar dados para o backend
            const response = await API.post('/users/login', logUser);
            console.log("Resposta do servidor:", response.data);

            if (response.data.token) {
                alert("Login realizado com sucesso!");

                // Salva token e dados do usuário
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                
                // Chama a função do App com os dados do usuário
                handleUserLogin(response.data.user, response.data.token);
                
                // Navega para tasks
                navigate('/tasks');
            } else {
                setError(response.data.message || "Erro ao conectar-se. Tente novamente.");
            }
        } catch (error) {
            console.error("Erro no registro:", error);
            setError("Erro de conexão com o servidor. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className = "bg-home">
                    <div className = "container-registro" >
                        <header>Login</header>
                        <SubmitionBar handleAddition={handleSubmition("email") } type="email" > Digite seu email. </SubmitionBar>
                        <SubmitionBar handleAddition={handleSubmition("senha") } type="password" > Digite sua senha. </SubmitionBar>
                        <div> 
                            <Button
                                onClick={handleLogin}
                                disabled={loading}
                            >
                            Entrar </Button> 
                        </div>
                    </div>
                </div>
    );
};

export default Login;