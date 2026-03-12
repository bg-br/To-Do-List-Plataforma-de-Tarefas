// --- Importanções
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';

import "./App.css";

import AddTask from "./components/AddTask/AddTask";
import Button from "./components/Button/Button";
import Header from "./components/Header/Header";
import Tasks from "./components/Tasks/Tasks.jsx";

import Login from "./components/Register/Login";
import Register from "./components/Register/Register";

// --- Axios: Pra comunicação com back-end
const API = axios.create({
    baseURL: 'http://localhost:3001'
});

// --- API para Token
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) { config.headers.Authorization = `Bearer ${token}`; }
        return config;
    },
    (error) => { return Promise.reject(error); }
);


// --- Função App
const App = () => {
    // Sets
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    // --- Funções das Tasks
    // Carregar tarefas
    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        if (token && user) {
            setCurrentUser(JSON.parse(user));
            setIsAuthenticated(true);
            loadTasks();
        }
    }, []);


    const loadTasks = async () => {
        setLoading(true);
        try {
            const gettingTasks = await API.get(`/tasks`);
            setTasks(gettingTasks.data);
        } catch (error) {
            console.error("Ocorreu um erro ao carregar as tarefas: ", error,".");
            if (error.response?.status === 401) {
                handleLogout();
            } else {
                // alert("Erro ao carregar tarefas.");
            }
        } finally { setLoading(false) };
    };

    // Click nas Tasks
    const handleTaskClick = async (taskId) => {
        try {
            // Banco
            const task = tasks.find(t => t.id === taskId);
            const aux = await API.patch(`/tasks/${taskId}/toggle`);

            // Local
            const newTasks = tasks.map(task => {
                if (task.id === taskId) return aux.data;
                return task;
            });
            setTasks(newTasks);
        } catch (error) {
            console.error("Ocorreu um erro ao atualizar as tarefas: ", error,".");
            if (error.response?.status === 401) handleLogout();
            alert("Erro ao atualizar tarefas.");
        }
    }

    // Adição de Tasks
    const handleTaskAddition = async (taskTitle) => {
        if (!taskTitle.trim()) return;
        try {
            const newTasks = await API.post('/tasks', {
                title: taskTitle,
                description: '',
                completed: false
            });
        setTasks([newTasks.data, ...tasks]);
        } catch (error) {
            console.error("Erro ao adicionar tarefa: ", error,".");
            if (error.response?.status === 401) handleLogout();
            alert("Erro ao adicionar tarefa.");
        }
    };

    // Deletar Tasks
    const deleteTaskClick = async (taskId) => {
        try {
            await API.delete(`/tasks/${taskId}`);
            const remainingTasks = tasks.filter(task => task.id !== taskId);
            setTasks(remainingTasks);  
        } catch (error) {
            console.error("Erro ao deletar tarefa:", error);
            if (error.response?.status === 401) handleLogout();
            alert("Erro ao deletar tarefa.");
        }
    };

    // Adicionar / Editar descrição das tasks
    const handleTaskDescription = async (taskId, taskDescription) => {
        try {
            // Banco de Dados
            const update = await API.put(`/tasks/${taskId}`, {
                description: taskDescription
            });

            // Local
            const updatedTasks = tasks.map(task => {
                if (task.id === taskId) { 
                    return { ...task, description: taskDescription };
                }
                return task;
            });
            setTasks(updatedTasks);
        } catch (error) {
            console.error("Erro ao atualizar descrição: ", error,".");
            if (error.response?.status === 401) handleLogout();
            alert("Erro ao atualizar descrição.");
        }
    };

    // --- Funções de Rotas
    const handleClickRegister = () => { navigate('/registro') };
    const handleClickLogin = () => { navigate('/login') };

    const handleUserRegister = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setCurrentUser(userData);
        setIsAuthenticated(true);
        loadTasks();
        navigate('/tasks');
    };

    const handleUserLogin = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setCurrentUser(userData);
        console.log("Usuário conectado:", userData);
        loadTasks();
        navigate('/tasks');
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setCurrentUser(null);
        setIsAuthenticated(false);
        setTasks([]);
        navigate('/', { replace: true });
        window.location.reload(true)
    }

    const ProtectedRoute = ({ children }) => {
        const token = localStorage.getItem('token');
        if (!isAuthenticated || !token) {
            return <Navigate to="/" replace />;
        }
        return children;
    };

    return (
        <Routes>
            <Route
                path = "/"
                element = { 
                <div className = "bg-home">
                    <div className = "container-home" >
                        <Header>Bem-vindo ao Tasks!</Header>
                        <div className = "button-container" onClick = {handleClickRegister} > <Button> Registrar-se </Button> </div>
                        <div className = "button-container" onClick = {handleClickLogin} > <Button> Login </Button> </div>
                    </div>
                </div>
            } />

            <Route
                path = "/registro"
                element = { 
                <Register handleUserRegister = {handleUserRegister} />
            } />

            <Route
                path = "/login"
                element = { 
                <Login handleUserLogin = {handleUserLogin} />
            } />
                
            <Route
                path = "/tasks"
                element = { 
                <ProtectedRoute>
                    <div className = "container-tasks">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
                            <Header >
                                {currentUser && currentUser.nome 
                                    ? `Tasks de ${currentUser.nome}` 
                                    : "Tasks"}
                            </Header>
                            <div>
                            <Button onClick={handleLogout} >Sair</Button>
                            </div>
                        </div>
                        <AddTask handleTaskAddition = {handleTaskAddition} />
                        {loading && <p>Carregando tarefas...</p>}
                        <Tasks
                            tasks = {tasks}
                            handleTaskClick = {handleTaskClick}
                            deleteTaskClick = {deleteTaskClick}
                            handleTaskDescription = {handleTaskDescription}
                        />
                    </div>
                </ProtectedRoute>
                } />
        </Routes>
    );
};

export default App;
