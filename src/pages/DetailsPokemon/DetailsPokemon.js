import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../../context/AppContext';
import { requestDetailsPokemon, locationAreaEncounters } from '../../services/FetchApi';
import { ProgressBar, Spinner } from 'react-bootstrap';

function DetailsPokemon() {
  const { handleNamePokemon } = useContext(AppContext);
  const [detailsPokemon, setDetailsPokemon] = useState([]);
  const [ability, setAbility] = useState([]);
  const [types, setTypes] = useState([]);
  const [location, setLocation] = useState([]);
  const [stats, setStats] = useState([]);

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
    const arrayStats = [];

    if (detailsPokemon.length > 0) {
      for (let index = 0; index <= detailsPokemon[0].abilities.length - 1; index += 1) {
        arrayAbility.push(Object.values(detailsPokemon[0])[0][index].ability.name)
      }

      for (let index = 0; index <= detailsPokemon[0].types.length - 1; index += 1) {
        arrayTypes.push(Object.values(detailsPokemon)[0].types[index].type.name)
      }

      for (let index = 0; index <= detailsPokemon[0].stats.length - 1; index += 1) {
        arrayStats.push([Object.values(detailsPokemon)[0].stats[index].stat.name, Object.values(detailsPokemon)[0].stats[index].base_stat]);
      }

      const getLocation = async () => {
        const responseLocation = await locationAreaEncounters(detailsPokemon[0].location_area_encounters);
        setLocation(responseLocation);
      };
      getLocation();
    }
    setAbility(arrayAbility)
    setTypes(arrayTypes);
    setStats(arrayStats);
  }, [detailsPokemon]);

  console.log(stats)

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
            <p>Stats:</p>
            <div>
              {stats.map((value, index) => (
                <div key={index}>
                  <h3>{value[0]}</h3>
                  <ProgressBar animated now={value[1]} label={`${value[1]}`}/>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p>Localização:</p>
            {location.length > 0 ? (
              location.map((value, index) => (
                <p key={index}>{value.location_area.name}</p>
              ))
            ) : <p>sem informações!</p>}
          </div>
        </div>
      ) : <Spinner animation="border" />}
    </div>
  )
}

export default DetailsPokemon;
