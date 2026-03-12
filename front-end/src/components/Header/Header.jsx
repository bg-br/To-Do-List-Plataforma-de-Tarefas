// --- Importanções
import React, { useState } from 'react';
import "./Header.css"

// --- Função Header
const Header = ( { children } ) => {
    try {
            return ( <p className = "header-add" >{children}</p> );
        } catch (error) {
            console.error("Ocorreu um erro aao carregar a header: ", error,".");
            alert("Erro de carregamento.");
        }
};

export default Header;