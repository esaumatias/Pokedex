import React, { useState, useEffect } from 'react';
import AppContext from './AppContext';
import { requestDetailsPokemon } from '../services/FetchApi';

const AppProvider = ({ children }) => {
  const [namePokemon , setNamePokemon ] = useState([]);
  const [handleNamePokemon , setHandleNamePokemon ] = useState([]);
  const [detailsPokemon, setDetailsPokemon] = useState([]);
  const [sum, setSum] = useState(0);

  useEffect(() => {
   if(sum === 1) {
    let newArray = [];
    namePokemon.slice(0, 49).map((value, index) => (
      <div key={index}>
        {requestDetailsPokemon(value.name).then((response) => {
          newArray.push(response);
          setDetailsPokemon(newArray)})}
      </div>
    ))
   }
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
        setSum
      } }
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
