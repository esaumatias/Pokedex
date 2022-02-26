import React, { useContext, useEffect, useState } from 'react';
import AppContext from '../../context/AppContext';
import { requestDetailsPokemon, locationAreaEncounters } from '../../services/FetchApi';
import { Link } from 'react-router-dom';
import { ProgressBar, Spinner, Card, Container, Row, Col, Button } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

import './CardPokemon.css';

function CardPokemon() {
  const { handleNamePokemon } = useContext(AppContext);
  const [singleDetailsPokemon, setSingleDetails] = useState([]);
  const [ability, setAbility] = useState([]);
  const [types, setTypes] = useState([]);
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
    }
    setAbility(arrayAbility)
    setTypes(arrayTypes);
    setStats(arrayStats);
  }, [singleDetailsPokemon]);

  console.log(handleNamePokemon);

  return(
    <Container className="containerCard">
      {handleNamePokemon.length <= 0 || handleNamePokemon === undefined ? <Redirect to="/" /> : null}

      {singleDetailsPokemon.length > 0 ? (
        <Card
        style={{ width: '100%' }}
        className="justify-content-md-center containerSingleCard"
        >
          <Card.Header className="text-center" style={{ backgroundColor: 'red', color: 'white', fontSize: '20px'}}>{singleDetailsPokemon[0].name}</Card.Header>

          <Card.Body>
            <Row className="justify-content-md-center" style={{ width: '100%'}} >
              <Col xs md="auto">
                <Card.Img style={{ maxWidth: '100%', height: '250px' ,margin: 'auto' }} variant="top" src={`${singleDetailsPokemon[0].sprites.front_default}`} />
              </Col>
              <Col md="auto" className="containerStats">
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
            <Row className="justify-content-md-center" style={{ textAlign: 'center' }}>
              {types.map((value, index) => (
                  <Col key={index} xs md="auto" className={value} style={{ color: 'white', width: '30%', margin: '5px'}}>{value}</Col>
                ))}
            </Row>
          </Card.Body>

          <Card.Body style={{ textAlign: 'center' }}>
            <Card.Title>Habilidades:</Card.Title >
            <Row className="justify-content-md-center">
              {ability.map((value, index) => (
                  <Col key={index} xs md="auto">{value}</Col>
              ))}
            </Row>
          </Card.Body>
        <Link to="/" className="d-grid gap-2">
          <Button>Voltar</Button>
        </Link>
        </Card>
      ) : <Spinner animation="border" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}/>}
    </Container>
  )
}

export default CardPokemon;
