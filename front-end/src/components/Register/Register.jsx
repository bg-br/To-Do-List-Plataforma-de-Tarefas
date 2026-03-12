// --- Importanções
import React, { useState } from 'react';
import axios from 'axios';
import SubmitionBar from "../SubmitionBar/SubmitionBar";
import Button from '../Button/Button.jsx'
import { useNavigate } from 'react-router-dom';

// --- Axios: Pra comunicação com back-end
const API = axios.create({
    baseURL: 'http://localhost:3001'
});

// --- Função Register
const Register = ({ handleUserRegister }) => {
    const navigate = useNavigate();
    const [inputData, setInputData] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [newUser, setNewUser] = useState({
        nome: "",
        email: "",
        senha: ""
    });

    // Lidando com submissão
    const handleSubmition = (fieldName) => (value) => {
        setNewUser(prev => ({
            ...prev,
            [fieldName]: value
        }));
        setError("");
    };

    // Lidando com Registro
    const handleRegister = async () => {
        // Validação 
        if (!newUser.nome || !newUser.email || !newUser.senha) {
            setError("Todos os campos são obrigatórios!");
            return;
        }

        // Validação de email
        if (!newUser.email.includes('@') || !newUser.email.includes('.')) {
            setError("Email inválido!");
            return;
        }

        // Validação de senha
        if (newUser.senha.length < 6) {
            setError("A senha deve ter pelo menos 6 caracteres!");
            return;
        }

        setLoading(true);
        setError("");

        try {
            // Enviar dados para o backend
            const response = await API.post('/users/registrar', newUser);
            console.log("Resposta do servidor:", response.data);

            if (response.data.message === "Registro bem sucedido.") {
                alert("Registro realizado com sucesso!");
                
                // Salva token e dados do usuário
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                
                // Chama a função do App
                handleUserRegister(response.data.user, response.data.token);
                
                // Navega para tasks
                navigate('/tasks');
                
            } else {
                setError(response.data.message || "Erro ao registrar. Tente novamente.");
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
                        <header>Registro</header>
                        <SubmitionBar handleAddition={handleSubmition("nome") } type="text" > Digite seu nome. </SubmitionBar>
                        <SubmitionBar handleAddition={handleSubmition("email") } type="email" > Digite seu email. </SubmitionBar>
                        <SubmitionBar handleAddition={handleSubmition("senha") } type="password" > Digite sua senha de até 6 caracteres. </SubmitionBar>
                        <div> 
                            <Button
                                onClick={handleRegister}
                                disabled={loading}
                            >
                            Submeter </Button> 
                        </div>
                    </div>
                </div>
    );
};

export default Register;