import React, {useEffect, useContext, useState} from 'react';
import AppContext from '../../context/AppContext';
import { requestNamePokemon, requestTypePokemon } from '../../services/FetchApi';

import { Navbar, Container, Form, Row, Col, Nav } from 'react-bootstrap';

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
      if (handleName.length === 0 && handleType === 'Todos') {
        setNamePokemon(response);
        setFilter(response);
      } else {
        setFilter(response);
      }
      if(sum < 10) {
        setSum(sum + 1);
      }
    };
    getNamePokemon();
  }, [handleName.length, handleType, setNamePokemon, setSum, sum]);

  // function handleFilter({target}) {
  //   const { value } = target;
  //   setHandleName(value);
  // }

  function handleCLick() {
    const array = [];
    for(let i = 0; i < filter.length; i += 1) {
     if (handleType !== 'Todos') {
      if (filter[i].pokemon.name.includes(handleName.toLowerCase()) ) {
        array.push(filter[i].pokemon)
        setNamePokemon(array);
        setSum(0);
      }
     } else {
      if (filter[i].name.includes(handleName.toLowerCase()) ) {
        array.push(filter[i])
        setNamePokemon(array);
        setSum(0);
     }
    }
  }
}

  // function typeHandler({target}) {
  //   const { value } = target;
  //   setHandleType(value);
  // }

// console.log(filter)

  return (
    <Navbar bg="danger" variant="danger" className="justify-content-md-center">
      <Nav className="justify-content-center" activeKey="/home">
        <Container fluid>
          <Form >
            <Form.Group>
              <Row style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
                <Col style={{ padding: '7px'}}>
                  <Form.Text style={{ color: 'white', fontSize: '30px'}}>Pokedex</Form.Text>
                </Col>
                
                <div style={{ display: 'flex', flexWrap: 'wrap'}}>
                  <Col xs={'auto'} style={{ padding: '7px'}}>
                    <Form.Control type="search" onChange={({target})=>setHandleName(target.value)} aria-label="Default select example" size="sm" placeholder="Digite o nome do Pokemon"/>
                  </Col>
                  
                  <Col style={{ padding: '7px'}}>
                    <Form.Select aria-label="Default select example" onChange={({target})=>setHandleType(target.value)}  size="sm">
                      {type.map((value, index) => (
                        <option value={value} key={index} name="type">{value}</option>
                      ))}
                    </Form.Select >
                  </Col>

                  <Col style={{ padding: '7px'}}>
                    <Form.Control type="button" value="Procurar" onClick={handleCLick} size="sm"/>
                  </Col>
                </div>
              </Row>
            </Form.Group>
        </Form>
        </Container>
      </Nav>
    </Navbar>
  )
}

export default SearchBar;
