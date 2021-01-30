import React, { useEffect } from "react"
import Title from "../components/Title"
import ButtonTab from "../components/ButtonTab"
import { BsPlus } from "react-icons/bs"
import { MODIMAGE_OPEN } from "../redux/toggle/toggleTypes"
import { useDispatch } from "react-redux"

const Gallery: React.FC = () => {
  const dispatch = useDispatch()

  return (
    <div className='container'>
      <Title title='Галерея' />
      <div className='wrapper'>
        <ButtonTab
          Icon={BsPlus}
          click={() =>
            dispatch({
              type: MODIMAGE_OPEN,
              payload: { upload: "", description: "" },
            })
          }
        />
      </div>
    </div>
  )
}

export default Gallery
