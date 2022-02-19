import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from '../pages/Home/Home';
import DetailsPokemon from '../pages/DetailsPokemon/DetailsPokemon';

function Rotas() {
  return (
    <Switch>
      <Route exact path="/" component={ Home } />
      <Route exact path="/DetailsPokemon" component={ DetailsPokemon } />
    </Switch>
  );
}

export default Rotas;