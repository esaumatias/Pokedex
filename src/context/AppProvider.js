import React, { useState, useEffect } from 'react';
import AppContext from './AppContext';
import { requestNamePokemon, requestDetailsPokemon } from '../services/FetchApi';

const AppProvider = ({ children }) => {
  const [namePokemon , setNamePokemon ] = useState([]);
  const [handleNamePokemon , setHandleNamePokemon ] = useState([]);
  const [detailsPokemon, setDetailsPokemon] = useState([]);
  const [sum, setSum] = useState(0);

  useEffect(() => {
    const getNamePokemon = async () => {
      const response = await requestNamePokemon();
      setNamePokemon(response);
      if(sum < 50) {
        setSum(sum + 1);
      }
    };
    getNamePokemon();
  }, [sum]);

  useEffect(() => {
   if(sum === 1) {
    let newArray = [];
    namePokemon.map((value, index) => (
      <div key={index}>
        {requestDetailsPokemon(value.name).then((response) => {
          newArray.push(response);
          setDetailsPokemon(newArray)})}
      </div>
    ))
   }
  }, [namePokemon, sum]);

  return (
    <AppContext.Provider
      value={ {
        namePokemon,
        handleNamePokemon,
        setHandleNamePokemon,
        detailsPokemon,
        setDetailsPokemon,
      } }
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
