import React from "react"
// @ts-ignore
import styles from "../styles/loader.module"

interface ILoaderProps {
  center?: boolean
}

const Loader: React.FC<ILoaderProps> = ({ center }) => {
  return (
    <div className={`${styles.loader} ${center && styles.loader__center}`}>
      <div className={styles.loader__spinner}></div>
    </div>
  )
}

export default Loader
