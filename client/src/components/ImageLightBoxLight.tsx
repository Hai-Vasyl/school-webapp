import React from "react"
import { useSelector } from "react-redux"
import { RootStore } from "../redux/store"
// @ts-ignore
import styles from "../styles/lightbox.module"
// @ts-ignore
import stylesBtn from "../styles/button.module"
import { BsX } from "react-icons/bs"
import { LIGHTBOX_LIGHT_CLOSE } from "../redux/toggle/toggleTypes"
import { useDispatch } from "react-redux"
import ButtonTab from "./ButtonTab"

const ImageLightBoxLight: React.FC = () => {
  const dispatch = useDispatch()
  const {
    toggle: {
      lightboxlight: { image, title, toggle },
    },
  } = useSelector((state: RootStore) => state)

  return (
    <div className={`${styles.lightbox} ${toggle && styles.lightbox__open}`}>
      {image.length && (
        <img className={styles.lightbox__image} src={image} alt='image' />
      )}
      <div className={styles.lightbox__header_area}>
        <div className={styles.lightbox__header}>
          <ButtonTab
            exClass={`${stylesBtn.btn_tab_glass} ${styles.lightbox__btn_overlay}`}
            Icon={BsX}
            click={() => dispatch({ type: LIGHTBOX_LIGHT_CLOSE })}
          />
        </div>
      </div>
      <div
        className={`${styles.lightbox__footer} ${styles.lightbox__footer__unhoverable}`}
      >
        <div className={styles.lightbox__description}>{title}</div>
      </div>
    </div>
  )
}

export default ImageLightBoxLight
