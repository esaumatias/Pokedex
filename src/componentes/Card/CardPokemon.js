import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../../context/AppContext';
import { requestDetailsPokemon, locationAreaEncounters } from '../../services/FetchApi';
import { ProgressBar, Spinner, Card, Container, Row, Col } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

function CardPokemon() {
  const { handleNamePokemon } = useContext(AppContext);
  const [singleDetailsPokemon, setSingleDetails] = useState([]);
  const [ability, setAbility] = useState([]);
  const [types, setTypes] = useState([]);
  const [location, setLocation] = useState([]);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const getPokemon = async () => {
    const response = await requestDetailsPokemon(handleNamePokemon);
    setSingleDetails([response]);
    };
    getPokemon();
  }, [handleNamePokemon]);

  useEffect(() => {
    const arrayAbility = [];
    const arrayTypes = [];
    const arrayStats = [];

    if (singleDetailsPokemon.length > 0) {
      for (let index = 0; index <= singleDetailsPokemon[0].abilities.length - 1; index += 1) {
        arrayAbility.push(Object.values(singleDetailsPokemon[0])[0][index].ability.name)
      }

      for (let index = 0; index <= singleDetailsPokemon[0].types.length - 1; index += 1) {
        arrayTypes.push(Object.values(singleDetailsPokemon)[0].types[index].type.name)
      }

      for (let index = 0; index <= singleDetailsPokemon[0].stats.length - 1; index += 1) {
        arrayStats.push([Object.values(singleDetailsPokemon)[0].stats[index].stat.name, Object.values(singleDetailsPokemon)[0].stats[index].base_stat]);
      }

      const getLocation = async () => {
        const responseLocation = await locationAreaEncounters(singleDetailsPokemon[0].location_area_encounters);
        setLocation(responseLocation);
      };
      getLocation();
    }
    setAbility(arrayAbility)
    setTypes(arrayTypes);
    setStats(arrayStats);
  }, [singleDetailsPokemon]);

  console.log(handleNamePokemon);

  return(
    <Container>
      {handleNamePokemon.length <= 0 || handleNamePokemon === undefined ? <Redirect to="/" /> : null}

      {singleDetailsPokemon.length > 0 ? (
        <Card
        variant="Success"
        style={{ width: '100%' }}
        className="justify-content-md-center"
        >
          <Card.Header className="text-center">{singleDetailsPokemon[0].name}</Card.Header>

          <Card.Body>
            <Row className="justify-content-md-center" style={{ width: '100%'}} >
              <Col xs md="auto">
                <Card.Img style={{ width: '50%', margin: 'auto' }} variant="top" src={`${singleDetailsPokemon[0].sprites.front_default}`} />
                <Card.Img style={{ width: '50%', margin: 'auto' }} variant="top" src={`${singleDetailsPokemon[0].sprites.back_default}`} />
              </Col>
              <Col md="auto" style={{ width: '100%'}}>
                {stats.map((value, index) => (
                    <Row className="justify-content-md-center" key={index}>
                      <Col key={index}>
                        <Card.Text>{value[0]}</Card.Text>
                        <ProgressBar animated now={value[1]} label={`${value[1]}`}/>
                      </Col>
                    </Row>
                  ))}
              </Col>
            </Row>
          </Card.Body>

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
            <Card.Title>Localização:</Card.Title>
            {location.length > 0 ? (
              <Row className="justify-content-md-center" style={{ flexWrap: 'wrap', display: 'flex'}}>
                {location.map((value, index) => (
                  <Card.Text key={index}>{value.location_area.name}</Card.Text>
                ))}
              </Row>
            ) : <p>sem informações!</p>}
          </Card.Body>
        </Card>
      ) : <Spinner animation="border" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}/>}
    </Container>
  )
}

export default CardPokemon;
