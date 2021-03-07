import React from "react"
// @ts-ignore
import image_8 from "../images/plant-8.svg"
// @ts-ignore
import styles from "../styles/pages.module"

interface IDesignLayout_3Props {
  children: any
}

const DesignLayout_3: React.FC<IDesignLayout_3Props> = ({ children }) => {
  return (
    <div className={styles.page__wrapper_module}>
      <img
        className={`${styles.page__bg} ${styles.page__bg_5}`}
        src={image_8}
        alt='bgImage'
      />
      {children}
    </div>
  )
}

export default DesignLayout_3
