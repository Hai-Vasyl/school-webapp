import React, { useState } from "react"
import ReactMapGL, { Marker } from "react-map-gl"
import { ImLocation2 } from "react-icons/im"

const Map: React.FC = () => {
  const [viewport, setViewport] = useState({
    latitude: 49.802508984376054,
    longitude: 23.992843515344916,
    width: "100%",
    height: "100%",
    zoom: 15,
  })
  const marker = {
    latitude: 49.802508984376054,
    longitude: 23.992843515344916,
  }
  const styling = "mapbox://styles/vasyl-hai/cklpagbd3623o17nn3r3plenc"
  const accessToken =
    "pk.eyJ1IjoidmFzeWwtaGFpIiwiYSI6ImNrbHA5NXp4eTB6bHEydm1zbWY0NmVoNnAifQ.5W4GqZ0GC_RBnNQVJD62Pw"

  return (
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={accessToken}
      onViewportChange={(viewport: any) => {
        setViewport(viewport)
      }}
      mapStyle={styling}
    >
      <Marker latitude={marker.latitude} longitude={marker.longitude}>
        <ImLocation2 className='icon_location' />
      </Marker>
    </ReactMapGL>
  )
}

export default Map
