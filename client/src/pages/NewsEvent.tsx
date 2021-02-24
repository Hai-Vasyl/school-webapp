import React from "react"
import { GET_NEWS_EVENT, GET_CONTENT_IMAGES } from "../fetching/queries"
import { useQuery } from "@apollo/client"
import { useParams, useLocation } from "react-router-dom"
// @ts-ignore
import styles from "../styles/newsevents.module"
import { getParamsByType, types } from "../modules/uploadTypes"
import Carousel from "../components/Carousel"
import { Link, useHistory } from "react-router-dom"
import { getNewsParamsByKey } from "../modules/newsCategories"
import Loader from "../components/Loader"
import UserCard from "../components/UserCard"
import { RiExternalLinkLine } from "react-icons/ri"
import NewsEventsModule from "../components/NewsEventsModule"
import { useSelector } from "react-redux"
import { RootStore } from "../redux/store"
import { access } from "../modules/accessModifiers"
import ButtonTab from "../components/ButtonTab"
import { BsPencilSquare } from "react-icons/bs"
import { convertContent } from "../helpers/convertContentEditor"
import ImageSlide from "../components/ImageSlide"
import { IImageSlide } from "../interfaces"

const NewsEvent: React.FC = () => {
  const { contentId }: any = useParams()
  const { pathname } = useLocation()
  const isNews = pathname.split("/")[1] === "news"
  const {
    auth: { user },
  } = useSelector((state: RootStore) => state)
  const history = useHistory()

  const { data: dataNewsEvent, loading: loadNewsEvent } = useQuery(
    GET_NEWS_EVENT,
    {
      variables: {
        contentId,
        type: isNews ? "news" : "event",
      },
      fetchPolicy: "cache-and-network",
    }
  )
  const {
    data: dataImages,
    loading: loadImages,
    refetch: refetchImages,
  } = useQuery(GET_CONTENT_IMAGES, { variables: { contentId } })

  const images = dataImages ? dataImages.getContentImages : []
  const newsevent = dataNewsEvent ? dataNewsEvent.getNewsEvent : {}
  const newseventParams = getNewsParamsByKey(newsevent.category)
  const newsEventExtraParams: any = newsevent && getParamsByType(newsevent.type)
  const content = newsevent && convertContent(newsevent.content)

  const isOwnerContent =
    user.role === access.admin.keyWord || user.id === newsevent.owner.id

  return (
    <div className='container'>
      <div
        className={`${styles.newsevent__carousel} ${
          !images.length && styles.newsevent__carousel__minimize
        }`}
      >
        <Carousel
          slides={images}
          load={loadImages}
          isOwnerContent={isOwnerContent}
          content={newsevent.id}
          type={isNews ? types.news.keyWord : types.event.keyWord}
          onEdit={refetchImages}
          onRemove={refetchImages}
          onCreate={refetchImages}
        >
          {(params: any) =>
            images.map((slide: IImageSlide, index: number) => {
              return (
                <ImageSlide
                  key={slide.id}
                  info={slide}
                  index={index}
                  params={params}
                />
              )
            })
          }
        </Carousel>
      </div>
      {loadNewsEvent ? (
        <Loader />
      ) : (
        <>
          <div className='wrapper'>
            <div className={styles.newsevent__categoty_wrapper}>
              <Link
                className={styles.newsevent__category}
                to={`/news?page=1&category=${newsevent && newsevent.category}`}
              >
                <RiExternalLinkLine className={styles.newsevent__icon_link} />
                <span>{newseventParams?.title}</span>
              </Link>
              <ButtonTab
                exClass={styles.newsevent__btn_edit}
                click={() =>
                  history.push(
                    `${isNews ? "/edit-news/" : "/edit-event/"}${contentId}`
                  )
                }
                Icon={BsPencilSquare}
              />
            </div>
            <h1 className={styles.newsevent__title}>{newsevent.title}</h1>
            <div className={styles.newsevent__date}>
              <newsEventExtraParams.Icon
                className={styles.newsevent__date_icon}
              />
              <span>{newsevent.date}</span>
            </div>
            <div className={styles.newsevent__content}>{content}</div>
          </div>
          <div className={styles.newsevent__footer}>
            <div
              className={`${styles.content__links} ${styles.newsevent__links}`}
            >
              {newsevent.links.map(
                (link: { label: string; link: string }, index: number) => {
                  return (
                    <a
                      className={styles.content__link}
                      key={index}
                      href={link.link}
                    >
                      <span>{link.label}</span>
                    </a>
                  )
                }
              )}
            </div>
            <div className={styles.newsevent__info}>
              <span className={styles.newsevent__info_title}>Дата події:</span>
              <span className={styles.newsevent__info_text}>
                {newsevent.dateEvent}
              </span>
            </div>
            <div className={styles.newsevent__info}>
              <span className={styles.newsevent__info_title}>Автор:</span>
              <UserCard
                exClass={styles.newsevent__info_text}
                user={newsevent.owner}
                isEnvChat={false}
                isLink
                minimize
              />
            </div>
          </div>
        </>
      )}
      <NewsEventsModule isNews={isNews} exceptId={contentId} />
    </div>
  )
}

export default NewsEvent
