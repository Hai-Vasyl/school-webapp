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
  // const styling = "mapbox://styles/vasyl-hai/cklpfhpxx3gwm17o080h28qat"
  // const styling = "mapbox://styles/vasyl-hai/cklsbi5ms1bk717ljcnov2otu"
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
      {/* <span className='layout-black'></span> */}
      <Marker latitude={marker.latitude} longitude={marker.longitude}>
        <ImLocation2 className='icon-location' />
      </Marker>
    </ReactMapGL>
  )
}

export default Map
