import { useState } from 'react'
import { Route } from 'react-router-dom'
import Home from './pages/Home';
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Route path="/" element={<Home />} />
  )
}

export default App
