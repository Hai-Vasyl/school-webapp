import React, { useState } from "react"
import { GET_NEWS_EVENT, GET_CONTENT_IMAGES } from "../fetching/queries"
import { useQuery } from "@apollo/client"
import { useParams, useLocation } from "react-router-dom"
import Title from "../components/Title"
// @ts-ignore
import styles from "../styles/newsevents.module"
import ButtonTab from "../components/ButtonTab"
import { BsPlus } from "react-icons/bs"
import { MODIMAGE_OPEN } from "../redux/toggle/toggleTypes"
import { useDispatch } from "react-redux"
import { types } from "../modules/uploadTypes"
import Carousel from "../components/Carousel"

const NewsEvent: React.FC = () => {
  const { contentId }: any = useParams()
  const { pathname } = useLocation()
  const isNews = pathname.split("/")[1] === "news"
  const dispatch = useDispatch()

  const { data: dataNewsEvent, loading: loadNewsEvent } = useQuery(
    GET_NEWS_EVENT,
    {
      variables: {
        contentId,
        type: isNews ? "news" : "event",
      },
    }
  )
  const {
    data: dataImages,
    loading: loadImages,
    refetch: refetchImages,
  } = useQuery(GET_CONTENT_IMAGES, { variables: { contentId } })

  const handleAddImage = () => {
    dispatch({
      type: MODIMAGE_OPEN,
      payload: {
        id: "",
        content: contentId,
        type: isNews ? types.news.keyWord : types.event.keyWord,
        onCreate: () => {
          refetchImages()
        },
      },
    })
  }

  const images = dataImages ? dataImages.getContentImages : []
  console.log({ dataNewsEvent, dataImages })
  return (
    <div className='container'>
      <Title title={isNews ? "Новина" : "Подія"} />
      <div className='wrapper'>
        <div className={styles.newsevent__carousel}>
          <Carousel slides={images} load={loadImages} />
        </div>
        <ButtonTab click={handleAddImage} Icon={BsPlus} />
      </div>
    </div>
  )
}

export default NewsEvent
