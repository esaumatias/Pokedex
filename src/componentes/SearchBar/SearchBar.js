import React, {useEffect, useContext, useState} from 'react';
import AppContext from '../../context/AppContext';
import { requestNamePokemon } from '../../services/FetchApi';

function SearchBar() {
  const { setNamePokemon, setSum, sum } = useContext(AppContext);
  const [filter, setFilter] = useState([]);
  const [value, setValue] = useState([]);

  useEffect(() => {
    const getNamePokemon = async () => {
      const response = await requestNamePokemon();
      if (value.length === 0) {
        setNamePokemon(response);
      } else if (value.length > 0) {
        setFilter(response);
      }
      if(sum < 5) {
        setSum(sum + 1);
      }
    };
    getNamePokemon();
  }, [setNamePokemon, setSum, sum, value.length]);


function handleFilter({target}) {
  const { value } = target;
  setValue(value);
  const array = [];
  for(let i = 0; i < filter.length; i += 1) {
    if (filter[i].name.includes(value) ) {
      array.push(filter[i])
      setNamePokemon(array);
      setSum(0);
    } 
    if(value.length === 0) {
      setNamePokemon(filter);
    }
  }
}

console.log(value)

  return (
    <div>
      <input type="search" onChange={handleFilter}/>
      <button type="button">Procurar</button>
    </div>
  )
}

export default SearchBar;
