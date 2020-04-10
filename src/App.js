import React from 'react';
import './App.css';
import Player from './Player';
import Tabs from './Tabs';
import 'semantic-ui-css/semantic.min.css'

function App() {
  return (
    <div className="App">
      <Tabs />
      {/* <Player epNo={'06'}/> */}
    </div>
  );
}

export default App;
