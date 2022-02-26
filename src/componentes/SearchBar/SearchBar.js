import React, {useEffect, useContext, useState} from 'react';
import AppContext from '../../context/AppContext';
import { requestNamePokemon, requestTypePokemon } from '../../services/FetchApi';

function SearchBar() {
  const { setNamePokemon, setSum, sum } = useContext(AppContext);
  const [filter, setFilter] = useState([]);
  const [handleName, setHandleName] = useState([]);
  const [handleType, setHandleType] = useState('Todos');
  const type = [
    'Todos',
    'grass',
    'fire',
    'water',
    'bug',
    'normal',
    'poison',
    'electric',
    'ground',
    'fighting',
    'psychic',
    'rock',
    'flying',
    'ghost',
    'ice',
    'dragon',
    'steel',
    'dark',
    'fairy'];

  useEffect(() => {
    const getNamePokemon = async () => {
      const response = handleType !== 'Todos' ? await requestTypePokemon(handleType) : await requestNamePokemon(); 
      if (handleName.length === 0) {
        setNamePokemon(response);
      } else if (handleName.length > 0) {
        setFilter(response);
      }
      if(sum < 10) {
        setSum(sum + 1);
      }
    };
    getNamePokemon();
  }, [handleName.length, handleType, setNamePokemon, setSum, sum]);

  function handleFilter({target}) {
    const { value } = target;
    setHandleName(value);
  }

  function handleCLick() {
    const array = [];
    for(let i = 0; i < filter.length; i += 1) {
     if (handleType !== 'Todos') {
      if (handleName.length > 0 ) {
        if (filter[i].pokemon.name.includes(handleName) ) {
          array.push(filter[i].pokemon)
          setNamePokemon(array);
          setSum(0);
        } else {
          array.push(filter[i].pokemon)
          setNamePokemon(array);
          setSum(0);
        }
      }
     } else {
      if (filter[i].name.includes(handleName) ) {
        array.push(filter[i])
        setNamePokemon(array);
        setSum(0);
     }
    }
  }
}

  function typeHandler({target}) {
    const { value } = target;
    setHandleType(value);
  }

// console.log(filter)

  return (
    <div>
      <input type="search" onChange={handleFilter}/>
      <select onChange={typeHandler}>
        {type.map((value, index) => (
          <option value={value} key={index} name="type">{value}</option>
        ))}
      </select>
      <button type="button" onClick={handleCLick}>Procurar</button>
    </div>
  )
}

export default SearchBar;
