import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../../context/AppContext';
import { Spinner, Container, Button } from 'react-bootstrap';

function Home() {
  const { detailsPokemon, setHandleNamePokemon } = useContext(AppContext);

  function handleCLickName({target}) {
    const { alt, value } = target;
    const name = alt.length > 0 ? alt : value;
    setHandleNamePokemon(name)
  }

  return (
    <Container style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', height: '100vh'}}>
      {detailsPokemon
        ? detailsPokemon.map((value, index) => (
          <Link to={"/DetailsPokemon"} key={index} >
            <Button onClick={handleCLickName} value={value}  style={{ margin: "15px", height: "250px"}}>
              <h5 className="text-center" value={value}>{value.name}</h5>
              <img
                style={{ width: "120px", margin: "auto" }}
                variant="top"
                src={value.sprites.front_default}
                alt={value.name}
                value={value}
              />
              <div>{value.types[0].type.name}</div>
              {value.types[1] ? <div>{value.types[1].type.name}</div> : null}
              {value.types[2] ? <div>{value.types[2].type.name}</div> : null}
            </Button>
        </Link>
          ))
        : <Spinner animation="border"/>}
    </Container>
  );
}

export default Home;
