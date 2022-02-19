import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../../context/AppContext';
import { requestDetailsPokemon } from '../../services/FetchApi';

function DetailsPokemon() {
  const { detailsPokemon } = useContext(AppContext);
  const [pokemon, setPokemons] = useState([]);
  const [pokemon2, setPokemons2] = useState([]);

  useEffect(() => {
    const getPokemon = async () => {
    const response = await requestDetailsPokemon(detailsPokemon);
    setPokemons([response]);
    };
    getPokemon();
  }, [detailsPokemon]);

  useEffect(() => {
    const array = [];
    if (pokemon.length > 0) {
      for (let index = 0; index <= pokemon[0].abilities.length - 1; index += 1) {
        array.push(Object.values(pokemon[0])[0][index].ability.name)
      }
    }
    setPokemons2(array)
  }, [pokemon]);

  return (
    <div>
      {pokemon2.length > 0 ? (
        <div>
          <span>{pokemon[0].name}</span>
          <img src={pokemon[0].sprites.front_default} alt={pokemon[0].name} />
          <div>
            <p>Habilidades</p>
            {pokemon2.map((value, index) => (
                <p key={index}>{value}</p>
              ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default DetailsPokemon;


// <div key={index}>
//             <span>{value.name}</span>
//             <img src={value.sprites.front_default} alt={value.name} />
//             <span>{value.abilities[index].ability.name}</span>
//           </div>
