// --- Importações
import react, { useState } from 'react'
import "./Tasks.css"
import Task from "../Task/Task.jsx"

// --- Função Tasks
const Tasks = ({ tasks, handleTaskClick, deleteTaskClick, handleTaskDescription }) => {
    return (
        <div className="tasks-scroll">
            {tasks.map((task) => 
                <Task
                    key = {task.id}
                    task = {task}
                    handleTaskClick = {handleTaskClick}
                    deleteTaskClick = {deleteTaskClick}
                    handleTaskDescription = {handleTaskDescription}
                />
                )}
        </div>
    );
};

export default Tasks;