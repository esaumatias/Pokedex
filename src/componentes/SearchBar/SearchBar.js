import React, {useEffect, useContext, useState} from 'react';
import AppContext from '../../context/AppContext';
import { requestNamePokemon } from '../../services/FetchApi';

function SearchBar() {
  const { setNamePokemon, setSum, sum } = useContext(AppContext);
  const [filter, setFilter] = useState([]);
  const [handleName, setHandleName] = useState([]);

  useEffect(() => {
    const getNamePokemon = async () => {
      const response = await requestNamePokemon();
      if (handleName.length === 0) {
        setNamePokemon(response);
      } else if (handleName.length > 0) {
        setFilter(response);
      }
      if(sum < 3) {
        setSum(sum + 1);
      }
    };
    getNamePokemon();
  }, [setNamePokemon, setSum, sum, handleName.length]);

  function handleFilter({target}) {
    const { value } = target;
    setHandleName(value);
  }

  function handleCLick() {
    const array = [];
    for(let i = 0; i < filter.length; i += 1) {
      if (filter[i].name.includes(handleName) ) {
        array.push(filter[i])
        setNamePokemon(array);
        setSum(0);
      } 
    }
  }

// console.log(filter)

  return (
    <div>
      <input type="search" onChange={handleFilter}/>
      <button type="button" onClick={handleCLick}>Procurar</button>
    </div>
  )
}

export default SearchBar;
