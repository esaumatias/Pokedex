import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../../context/AppContext';
import { requestDetailsPokemon } from '../../services/FetchApi';

function DetailsPokemon() {
  const { detailsPokemon } = useContext(AppContext);
  const [pokemon, setPokemons] = useState([]);
  const [pokemon2, setPokemons2] = useState({});

  useEffect(() => {
    const getPokemon = async () => {
    const response = await requestDetailsPokemon(detailsPokemon);
    setPokemons([response]);
    };
    getPokemon();
  }, [detailsPokemon]);

  useEffect(() => {
    if (pokemon.length > 0) {
      for (let index = 0; index <= pokemon[0].abilities.length - 1; index += 1) {
        setPokemons2(Object.values(pokemon[0])[0][index].ability.name)
        console.log(pokemon2)
      }
    }
  }, [pokemon, pokemon2]);

  console.log(pokemon.length > 0 ? pokemon[0].abilities : null);

  return (
    <div>
      {pokemon2.length > 0 ? <p>{pokemon2}</p> : null}
    </div>
  )
}

export default DetailsPokemon;


// <div key={index}>
          //   <span>{value.name}</span>
          //   <img src={value.sprites.front_default} alt={value.name} />
          //   <span>{value.abilities[index].ability.name}</span>
          // </div>
