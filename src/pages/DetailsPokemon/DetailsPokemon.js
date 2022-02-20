import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../../context/AppContext';
import { requestDetailsPokemon, locationAreaEncounters } from '../../services/FetchApi';
import { ProgressBar, Spinner, Card, Container, Row, Col } from 'react-bootstrap';

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

  console.log(detailsPokemon)

  return (
    <Container style={{ height: '100vh'}}>
      {detailsPokemon.length > 0 ? (
        <Card
        variant="Success"
        style={{ width: '100%' }}
        className="justify-content-md-center"
        >
          <Card.Header className="text-center">{detailsPokemon[0].name}</Card.Header>
          <Card.Img style={{ width: '300px', margin: 'auto' }} variant="top" src={`${detailsPokemon[0].sprites.front_default}`} />
          <Card.Body>
            <Row className="justify-content-md-center">
              {types.map((value, index) => (
                  <Col key={index} xs md="auto">{value}</Col>
                ))}
            </Row>
          </Card.Body>

          <Card.Body>
            <Card.Title>Habilidades:</Card.Title >
            <Row className="justify-content-md-center">
              {ability.map((value, index) => (
                  <Col key={index} xs md="auto">{value}</Col>
              ))}
            </Row>
          </Card.Body>

          <Card.Body>
            <Card.Title>Stats:</Card.Title >
            {stats.map((value, index) => (
                <Row className="justify-content-md-center" key={index}>
                  <Col key={index}>
                    <Card.Text>{value[0]}</Card.Text>
                    <ProgressBar animated now={value[1]} label={`${value[1]}`}/>
                  </Col>
                </Row>
              ))}
          </Card.Body>

          <div>
            <p>Localização:</p>
            {location.length > 0 ? (
              location.map((value, index) => (
                <p key={index}>{value.location_area.name}</p>
              ))
            ) : <p>sem informações!</p>}
          </div>
        </Card>
      ) : <Spinner animation="border" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}/>}
    </Container>
  )
}

export default DetailsPokemon;
