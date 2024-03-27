import React from 'react'
import { useEffect, useState } from 'react'

function App() {
  const [data, setData] = useState([{}]);

  // execute code on page load
  useEffect(() => {
    async function fetchData() 
    {
      const response = await fetch("/api");
      const data = await response.json();
      setData(data);
    }
    fetchData();
  }, []);

  // display view
  return (
    <div>
       {( typeof data === 'undefined' || typeof data.data === 'undefined' || data.data.length === 0 ? (
        <p>Loading ...</p>
       ) :(
        <p>
          {data.data[0].Message}
        </p>
       ))}
    </div>
  )
}

export default App