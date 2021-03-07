import React from "react"
// @ts-ignore
import image_1 from "../images/plant-1.svg"
// @ts-ignore
import image_2 from "../images/plant-2.svg"
// @ts-ignore
import styles from "../styles/pages.module"

interface IDesignLayout_1Props {
  children: any
}

const DesignLayout_1: React.FC<IDesignLayout_1Props> = ({ children }) => {
  return (
    <div className={styles.page__wrapper_module}>
      <img
        className={`${styles.page__bg} ${styles.page__bg_1}`}
        src={image_1}
        alt='bgImage'
      />
      <img
        className={`${styles.page__bg} ${styles.page__bg_2}`}
        src={image_2}
        alt='bgImage'
      />
      {children}
    </div>
  )
}

export default DesignLayout_1
