import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AppContext from '../../context/AppContext';

function Home() {
  const { namePokemon, setHandleNamePokemon } = useContext(AppContext);

  function handleCLickName({target}) {
    const { value } = target;
    setHandleNamePokemon(value)
  }

  return (
    <div>
      {namePokemon.map((value, index) => (
        <div key={index}>
          <Link to={"/DetailsPokemon"}>
            <button
              onClick={handleCLickName}
              value={value.name}
            >
              {value.name}
            </button>
          </Link>
        </div>
      ))}
    </div>
  )
}

export default Home;
