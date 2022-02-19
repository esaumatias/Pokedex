import React, { useState, useEffect } from 'react';
import AppContext from './AppContext';
import { requestNamePokemon } from '../services/FetchApi';

const AppProvider = ({ children }) => {
  const [namePokemon , setNamePokemon ] = useState([]);
  const [detailsPokemon , setDetailsPokemon ] = useState([]);

  useEffect(() => {
    const getNamePokemon = async () => {
    const response = await requestNamePokemon();
    setNamePokemon(response);
    };
    getNamePokemon();
  }, []);

  return (
    <AppContext.Provider
      value={ {
        namePokemon,
        detailsPokemon,
        setDetailsPokemon,
      } }
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
