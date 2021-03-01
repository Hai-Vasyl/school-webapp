import React from "react"
// @ts-ignore
import styles from "../styles/loader.module"

interface ILoaderDataProps {
  load: boolean
  noSpiner?: boolean
}

const LoaderData: React.FC<ILoaderDataProps> = ({ load, noSpiner = false }) => {
  return (
    <div
      className={`${styles.loader_data} ${load && styles.loader_data__active}`}
    >
      {!noSpiner && <div className={styles.loader_data__spinner}></div>}
    </div>
  )
}

export default LoaderData
