import React, { PropTypes }   from 'react';
import { bindActionCreators } from 'redux'
import { connect }            from 'react-redux'
import * as CounterActions    from '../ducks/counter'
import PizzaSVG1              from './PizzaSVG1';

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
    <PizzaSVG1 />
    <img src="./imgs/pizza1.png" alt="pizza"/>
  </div>
)

Counter.propTypes = {
  increment: PropTypes.func.isRequired,
  incrementIfOdd: PropTypes.func.isRequired,
  incrementAsync: PropTypes.func.isRequired,
  decrement: PropTypes.func.isRequired,
  counter: PropTypes.number.isRequired
}

const mapStateToProps = (state) => ({
  counter: state.counter
})

function mapDispatchToProps(dispatch) {
  return bindActionCreators(CounterActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Counter)
