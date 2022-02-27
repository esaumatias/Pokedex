import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../../context/AppContext';
import { Spinner, Container, Button } from 'react-bootstrap';
import SearchBar from '../../componentes/SearchBar/SearchBar';
import Footer from '../../componentes/Footer/Footer';

import './Home.css';

function Home() {
  const { detailsPokemon, setHandleNamePokemon, loading } = useContext(AppContext);

  function handleCLickName({target}) {
    const { alt, value } = target;
    const name = alt.length > 0 ? alt : value;
    setHandleNamePokemon(name)
  }

  return (
    <>
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
        <SearchBar />
        <Container style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap'}}>
        {detailsPokemon
          ? detailsPokemon.map((value, index) => (
            <Link to={"/DetailsPokemon"} key={index} >
              <Button onClick={handleCLickName} value={value}  style={{ margin: "15px", height: "250px", width: "250px", borderRadius: "40px 10px" }}>
                <h5 className="text-center" value={value}>{value.name}</h5>
                <img
                  style={{ width: "120px", margin: "10px" }}
                  variant="top"
                  src={value.sprites.other.home.front_default}
                  alt={value.name}
                  value={value}
                />
                <div className="containerType">
                  <div className={value.types[0].type.name}>{value.types[0].type.name}</div>
                  {value.types[1] ? <div className={value.types[1].type.name}>{value.types[1].type.name}</div> : null}
                  {value.types[2] ? <div className={value.types[2].type.name}>{value.types[2].type.name}</div> : null}
                </div>
              </Button>
          </Link>
            ))
          : <Spinner animation="border"/>}
      </Container>
      <Footer />
    </div>
      ) : <Spinner animation="border"/>}
    </>
  );
}

export default Home;
