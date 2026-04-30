import { useEffect, useState } from 'react'
import { NavLink } from "react-router";
function App() {
  const [data, setData] = useState('')

  useEffect(() => {
    // We use '/api/message' because the Vite proxy forwards it to the Express server
    fetch('/api/message')
      .then((res) => res.json())
      .then((data) => setData(data.message))
      .catch((err) => console.error("Error fetching data:", err));
  }, [])

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <NavLink to="/register" end>
        Register
      </NavLink>
      <h1>React + Express</h1>
      <p>Server says: <strong>{data || 'Loading...'}</strong></p>
    </div>
  )
}
export default App