import React from "react"
// @ts-ignore
import image_6 from "../images/plant-6.svg"
// @ts-ignore
import image_4 from "../images/plant-4.svg"
// @ts-ignore
import styles from "../styles/pages.module"

interface IDesignLayout_2Props {
  children: any
}

const DesignLayout_2: React.FC<IDesignLayout_2Props> = ({ children }) => {
  return (
    <div className={styles.page__wrapper_module}>
      <img
        className={`${styles.page__bg} ${styles.page__bg_3}`}
        src={image_6}
        alt='bgImage'
      />
      <img
        className={`${styles.page__bg} ${styles.page__bg_4}`}
        src={image_4}
        alt='bgImage'
      />
      {children}
    </div>
  )
}

export default DesignLayout_2
