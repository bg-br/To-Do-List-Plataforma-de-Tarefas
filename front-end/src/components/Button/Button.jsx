// --- Importanções
import React, { useState } from 'react';
import "./Button.css"

// --- Função Button
const Button = ({ children, onClick }) => {
    return (
        <button onClick = {onClick} className="add-task-button">
            {children}
        </button>
    )
}

export default Button;