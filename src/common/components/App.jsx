import React from 'react';
import { Link } from 'react-router';

const App = (props) => {
  return (
    <div>
      <header>
        <Link to="/">Counter</Link>
        <br />
        <Link to="/pizza">Pizza</Link>
        <br />
        <br />
      </header>
      {props.children}
    </div>
  );
};

export default App;
