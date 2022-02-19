import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../../context/AppContext';
import { requestDetailsPokemon, locationAreaEncounters } from '../../services/FetchApi';

function DetailsPokemon() {
  const { handleNamePokemon } = useContext(AppContext);
  const [detailsPokemon, setDetailsPokemon] = useState([]);
  const [ability, setAbility] = useState([]);
  const [types, setTypes] = useState([]);
  const [location, setLocation] = useState([]);

  useEffect(() => {
    const getPokemon = async () => {
    const response = await requestDetailsPokemon(handleNamePokemon);
    setDetailsPokemon([response]);
    };
    getPokemon();
  }, [handleNamePokemon]);

  useEffect(() => {
    const arrayAbility = [];
    const arrayTypes = [];
    if (detailsPokemon.length > 0) {
      for (let index = 0; index <= detailsPokemon[0].abilities.length - 1; index += 1) {
        arrayAbility.push(Object.values(detailsPokemon[0])[0][index].ability.name)
      }
      for (let index = 0; index <= detailsPokemon[0].types.length - 1; index += 1) {
        arrayTypes.push(Object.values(detailsPokemon)[0].types[index].type.name)
      }
      const getLocation = async () => {
        const responseLocation = await locationAreaEncounters(detailsPokemon[0].location_area_encounters);
        setLocation(responseLocation);
      };
      getLocation();
    }
    setAbility(arrayAbility)
    setTypes(arrayTypes);
  }, [detailsPokemon]);


  return (
    <div>
      {detailsPokemon.length > 0 ? (
        <div>
          <span>{detailsPokemon[0].name}</span>
          <img src={detailsPokemon[0].sprites.front_default} alt={detailsPokemon[0].name} />
          <div>
            <p>Tipo:</p>
            {types.map((value, index) => (
                <p key={index}>{value}</p>
              ))}
          </div>

          <div>
            <p>Habilidades:</p>
            {ability.map((value, index) => (
                <p key={index}>{value}</p>
              ))}
          </div>

          <div>
            <p>Localização:</p>
            {location.map((value, index) => (
                <p key={index}>{value.location_area.name}</p>
              ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default DetailsPokemon;
