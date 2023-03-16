//import logo from './favicon.ico';

import Homepage from './components/Homepage';
import Create from './components/Create Game';
import Game from './components/Game';

import React, { useEffect } from "react";
import { Routes, Route } from 'react-router-dom';
import './App.scss';
import { io } from "socket.io-client";

const socket = io();
socket.on('alert', (msg) => {
    alert(msg);
});

function App() {
    useEffect(() => {
        document.title = 'Card Me Daddy'
}   );
    return (
      <Routes>
          <Route path={ '/' } element={ <Homepage /> } />
          <Route path={ '/create-game' } element={ <Create /> } />
          <Route path={ '/game/:id' } element={ <Game /> } />
      </Routes>
  );
}

export default App;
