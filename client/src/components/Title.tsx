import React from "react"
import { GET_PAGE } from "../fetching/queries"
import { useQuery } from "@apollo/client"
// @ts-ignore
import styles from "../styles/title.module"
import { useLocation } from "react-router-dom"

interface ITitleProps {
  title: string
}

const Title: React.FC<ITitleProps> = ({ title }) => {
  const location = useLocation()
  const { data: dataImage, loading, error } = useQuery(GET_PAGE, {
    variables: { url: location.pathname },
  })

  return (
    <div className={styles.title}>
      {dataImage && (
        <img
          src={dataImage.image}
          className={styles.title__image}
          alt='bgImage'
        />
      )}
      <div className={styles.title__layer}></div>
      <h2 className={styles.title__text}>{title}</h2>
    </div>
  )
}

export default Title
