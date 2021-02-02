import React from "react"
import { useSelector } from "react-redux"
import { RootStore } from "../redux/store"
// @ts-ignore
import styles from "../styles/lightbox.module"
// @ts-ignore
import stylesBtn from "../styles/button.module"
import { GET_IMAGE } from "../fetching/queries"
import { useQuery } from "@apollo/client"
import Loader from "./Loader"
import { getParamsByType } from "../modules/uploadTypes"
import { access } from "../modules/accessModifiers"
import { BsPencilSquare, BsX } from "react-icons/bs"
import { MODIMAGE_OPEN, LIGHTBOX_CLOSE } from "../redux/toggle/toggleTypes"
import { useDispatch } from "react-redux"
import { types } from "../modules/uploadTypes"
import ButtonTab from "./ButtonTab"

const ImageLightBox: React.FC = () => {
  const dispatch = useDispatch()
  const {
    auth: { user },
    toggle: {
      lightbox: { imageId, isLeft, isRight, toggle, onMove, handleEditImage },
    },
  } = useSelector((state: RootStore) => state)
  const { data: dataImage, loading: loadImage } = useQuery(GET_IMAGE, {
    variables: { imageId },
  })

  console.log({ dataImage })
  const image = dataImage && dataImage.getImage
  const imageParams: any = getParamsByType(image && image.type)
  return (
    <div className={`${styles.lightbox} ${toggle && styles.lightbox__open}`}>
      {loadImage ? (
        <Loader />
      ) : (
        <>
          <img
            className={styles.lightbox__image}
            src={image && image.location}
            alt='image'
          />
          <div className={styles.lightbox__header}>
            <span className={styles.lightbox__icon}>
              {imageParams && <imageParams.Icon />}
            </span>
            {(user.role === access.admin.keyWord ||
              (user.id === image && image.owner.id)) && (
              <ButtonTab
                exClass={`${stylesBtn.btn_tab_glass} ${styles.lightbox__btn_overlay}`}
                Icon={BsPencilSquare}
                click={handleEditImage}
              />
            )}
            <ButtonTab
              exClass={`${stylesBtn.btn_tab_glass} ${styles.lightbox__btn_overlay}`}
              Icon={BsX}
              click={() => dispatch({ type: LIGHTBOX_CLOSE })}
            />
          </div>
          <div></div>
        </>
      )}
    </div>
  )
}

export default ImageLightBox
