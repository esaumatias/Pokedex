import React, { useState, useEffect } from 'react';
import AppContext from './AppContext';
import { requestDetailsPokemon } from '../services/FetchApi';

const AppProvider = ({ children }) => {
  const [namePokemon , setNamePokemon ] = useState([]);
  const [handleNamePokemon , setHandleNamePokemon ] = useState([]);
  const [detailsPokemon, setDetailsPokemon] = useState([]);
  const [sum, setSum] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
   if(sum === 1) {
    let newArray = [];
    namePokemon.slice(0, 24).map((value, index) => (
      <div key={index}>
        {requestDetailsPokemon(value.name).then((response) => {
          newArray.push(response);
          setDetailsPokemon(newArray)})}
      </div>
    ))
   }
   setLoading(true);
  }, [namePokemon, sum]);

  console.log(namePokemon)

  return (
    <AppContext.Provider
      value={ {
        namePokemon,
        setNamePokemon,
        handleNamePokemon,
        setHandleNamePokemon,
        detailsPokemon,
        setDetailsPokemon,
        sum,
        setSum,
        loading,
        setLoading
      } }
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
