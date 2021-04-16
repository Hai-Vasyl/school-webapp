import React from "react"
import { Link } from "react-router-dom"
// @ts-ignore
import styles from "../styles/search.module"

interface IPlugCardProps {
  title: string
  url: string
  image: string
}

const PlugCard: React.FC<IPlugCardProps> = ({ title, url, image }) => {
  return (
    <Link className={styles.btn_more} to={url}>
      <span className={styles.btn_more__overlay}></span>
      {image ? (
        <img className={styles.btn_more__image} src={image} alt='imgItem' />
      ) : (
        <span className={styles.btn_more__plug}></span>
      )}
      <span className={styles.btn_more__title}>{title}</span>
    </Link>
  )
}

export default PlugCard
