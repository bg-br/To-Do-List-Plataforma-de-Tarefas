// --- Importanções
import React, { useState } from 'react';
import "./Task.css";

// --- Função Task
const Task = ({ task, handleTaskClick, deleteTaskClick, handleTaskDescription }) => {
    const [inputData, setInputData] = useState("");
    const [isEditing, setIsEditing] = useState(false);  // Controla se está editando
    
    const handleInputChange = (newDescription) => {
        setInputData(newDescription.target.value);
    };

    // Salvar Descrição com Enter
    const handleSaveDescription = () => {
        if (inputData.trim() !== '') {
            handleTaskDescription(task.id, inputData);
            setInputData("");
            setIsEditing(false); 
        }
    };

    // Verificando Enter
    const handleKeyDown = (button) => {
        if (button.key === 'Enter' && inputData.trim() !== '') {
            handleTaskDescription(task.id, inputData);
            setInputData("");
            setIsEditing(false);  // Sai do modo edição
        }
    };

    // Edição
    const startEditing = () => {
        setInputData(task.description || '');
        setIsEditing(true);
    };

    return (
        <div
            className="task-container"
            style={task.completed ? { borderLeft: '6px solid #d400ff' } : {}}
        >
            <div className="task-title">
                <div onClick={() => handleTaskClick(task.id)}>
                    {task.title}
                </div>
                <div className="task-description">
                    {isEditing ? (
                        <div>
                            <input
                                onChange={handleInputChange}
                                value={inputData}
                                onKeyDown={handleKeyDown}
                                className="add-task-description"
                                type="text"
                                placeholder="Digite a descrição..."
                                autoFocus
                                onBlur={() => {
                                    if (!inputData.trim()) {
                                        setIsEditing(false);
                                    }
                                }}
                            />
                        </div>
                    ) : (
                        <div 
                            className={`description-text ${task.description ? '' : 'empty'}`}
                            onClick={startEditing}
                        >
                            {task.description ? (
                                <>
                                    {task.description}
                                    <span className="edit-hint"></span>
                                </>
                            ) : (
                                <span className="add-hint">+ Clique para adicionar descrição</span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div onClick={() => deleteTaskClick(task.id)} className="delete-button">
                X
            </div>
        </div>
    );
};

export default Task;