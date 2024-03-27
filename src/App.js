import React from 'react'
import { useEffect, useState } from 'react'

function App() {
  const [data, setData] = useState([{}]);

  // execute code on page load
  useEffect(() => {
    fetch("/api").then(
      response => response.json()
    ).then(
      data => {
        setData(data)
      }
    )
  }, [])

  // display view
  return (
    <div>
       {( typeof data === 'undefined' ? (
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