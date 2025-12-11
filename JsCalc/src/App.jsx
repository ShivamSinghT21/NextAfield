import React, { useState } from 'react'
import './App.css'

const App = () => {
  const [currentValue, setCurrentValue] = useState('')
  const [previousValue, setPreviousValue] = useState('')

  const handleClick = (value) => {
    setCurrentValue(currentValue + value)
  }

  const handleClear = () => {
    setCurrentValue('')
    setPreviousValue('')
  }

  const handleDelete = () => {
    setCurrentValue(currentValue.slice(0, -1))
  }

  const handleCalculate = () => {
    try {
      setPreviousValue(currentValue)
      const result = eval(currentValue)
      setCurrentValue(result.toString())
    } catch (error) {
      setCurrentValue('Error')
    }
  }

  return (
    <>
      <div className="container">
        <div className="output">
          <div className="previous">{previousValue}</div>
          <div className="current">{currentValue || '0'}</div>
        </div>
        <button className="spantwo" onClick={handleClear}>AC</button>
        <button onClick={handleDelete}>Del</button>
        <button onClick={() => handleClick('-')}>-</button>
        <button onClick={() => handleClick('1')}>1</button>
        <button onClick={() => handleClick('2')}>2</button>
        <button onClick={() => handleClick('3')}>3</button>
        <button onClick={() => handleClick('+')}>+</button>
        <button onClick={() => handleClick('4')}>4</button>
        <button onClick={() => handleClick('5')}>5</button>
        <button onClick={() => handleClick('6')}>6</button>
        <button onClick={() => handleClick('*')}>*</button>
        <button onClick={() => handleClick('7')}>7</button>
        <button onClick={() => handleClick('8')}>8</button>
        <button onClick={() => handleClick('9')}>9</button>
        <button onClick={() => handleClick('/')}>/</button>
        <button onClick={() => handleClick('%')}>%</button>
        <button onClick={() => handleClick('0')}>0</button>
        <button className="spantwo" onClick={handleCalculate}>=</button>
      </div>
    </>
  )
}

export default App
