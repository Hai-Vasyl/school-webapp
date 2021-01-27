import React, { useEffect } from "react"
import { useDispatch } from "react-redux"
import { AUTHFORM_TOGGLE } from "../redux/toggle/toggleTypes"

const Home: React.FC = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos/1")
      .then((response) => response.json())
      .then((json) => console.log(json))

    console.log("Hello moto")
  }, [])

  return (
    <div className='wrapper' style={{ height: "200vh" }}>
      <div>Home Page</div>
      <div>
        sdfsdf
        <button
          style={{ marginTop: "180px" }}
          onClick={() => dispatch({ type: AUTHFORM_TOGGLE })}
        >
          sdfsdf
        </button>
      </div>
    </div>
  )
}

export default Home
