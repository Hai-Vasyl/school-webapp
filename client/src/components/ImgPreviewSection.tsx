import React from "react"
// @ts-ignore
import styles from "../styles/pages.module"
import { BsImages, BsInfoSquare } from "react-icons/bs"
import { Link } from "react-router-dom"

interface IImgSectionProps {
  imgLocation: string
  exClass?: string
  redirectStr: string
}

const ImgPreviewSection: React.FC<IImgSectionProps> = ({
  imgLocation,
  exClass,
  redirectStr,
}) => {
  return (
    <Link
      className={`${styles.content__preview} ${styles.content__preview__extended} ${exClass}`}
      to={redirectStr}
    >
      <span className={styles.content__overlay}>
        <span className={styles.item_info__more}>
          <BsInfoSquare className={styles.item_info__more_icon} />
          <span className={styles.item_info__more_text}>Детальніше</span>
        </span>
      </span>
      {imgLocation ? (
        <img
          className={styles.content__img}
          src={imgLocation}
          alt='imgPreview'
        />
      ) : (
        <BsImages className={styles.content__icon} />
      )}
    </Link>
  )
}

export default ImgPreviewSection
