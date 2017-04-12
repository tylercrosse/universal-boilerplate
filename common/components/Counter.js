import React, { PropTypes } from 'react'

const Counter = ({increment, incrementIfOdd, incrementAsync, decrement, counter}) => (
  <div>
    <p>
      Clicked: {counter} times
      {' '}
      <button onClick={increment}>+</button>
      {' '}
      <button onClick={decrement}>-</button>
      {' '}
      <button onClick={incrementIfOdd}>Increment if odd</button>
      {' '}
      <button onClick={() => incrementAsync()}>Increment async</button>
    </p>
    <img src="./imgs/pizza1.png" alt="pizza"/>
    <img src="./imgs/pizza2.svg" alt="pizza"/>
  </div>
)

Counter.propTypes = {
  increment: PropTypes.func.isRequired,
  incrementIfOdd: PropTypes.func.isRequired,
  incrementAsync: PropTypes.func.isRequired,
  decrement: PropTypes.func.isRequired,
  counter: PropTypes.number.isRequired
}

export default Counter
