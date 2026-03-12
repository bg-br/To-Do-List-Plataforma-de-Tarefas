// --- Importanções
import React, { useState, useEffect } from 'react';
import "./SubmitionBar.css"

// --- Função SubmitionBar
const SubmitionBar = ( { children, handleAddition, type = "text" } ) => {
    const [inputData, setInputData] = useState("");
    const [typingTimeout, setTypingTimeout] = useState(null);

    useEffect(() => {
        return () => {
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
        };
    }, [typingTimeout]);

    const handleInputChange = (aux) => {
        const value = aux.target.value;
        setInputData(aux.target.value);

        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        setTypingTimeout(setTimeout(() => {
            handleAddition(value);
            console.log(`Enviando após digitação: ${value}`);
        }));
    };

    return (
        <div className = "add-container">
            <input
                onChange={handleInputChange}
                value = {inputData}
                className = "add-input"
                type={type}
                placeholder={children}
            />
        </div>
    );
};

export default SubmitionBar;

/*
            <div className = "add-button-container">
                <Button onClick={handleAddClick} > Enviar </Button>
            </div>
*/