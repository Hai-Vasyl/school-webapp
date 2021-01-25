import React from "react"
import { GET_PAGE } from "../fetching/queries"
import { useQuery } from "@apollo/client"
// @ts-ignore
import styles from "../styles/title.module"

interface ITitleProps {
  url: string
  title: string
}

const Title: React.FC<ITitleProps> = ({ title, url }) => {
  const { data: dataImage, loading, error } = useQuery(GET_PAGE, {
    variables: { url },
  })

  console.log({ dataImage, loading, error })
  return (
    <div className={styles.title}>
      {dataImage && (
        <img
          src={dataImage.image}
          className={styles.title__image}
          alt='bgImage'
        />
      )}
      <h2 className={styles.title__text}>{title}</h2>
    </div>
  )
}

export default Title
