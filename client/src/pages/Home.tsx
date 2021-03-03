import React, { useEffect } from "react"
import { GET_NEWS_EVENTS_DETAILED } from "../fetching/queries"
import { useQuery } from "@apollo/client"
import { access } from "../modules/accessModifiers"
import { useSelector } from "react-redux"
import { RootStore } from "../redux/store"
import Carousel from "../components/Carousel"
// @ts-ignore
import styles from "../styles/pages.module"
import { INewsEventSlider, INewsEvent } from "../interfaces"
import NewsSlide from "../components/NewsSlide"
import AboutModule from "../components/AboutModule"
import GalleryModule from "../components/GalleryModule"
import NewsEventsModule from "../components/NewsEventsModule"
import NewsEventsModuleGrid from "../components/NewsEventsModuleGrid"
import BooksModule from "../components/BooksModule"
import NewsEventsModuleContainer from "../components/NewsEventsModuleContainer"

const Home: React.FC = () => {
  const {
    auth: { user },
  } = useSelector((state: RootStore) => state)
  const { data: dataNews, loading: loadNews } = useQuery(
    GET_NEWS_EVENTS_DETAILED,
    {
      variables: {
        search: "",
        type: "news",
        category: null,
        dateFrom: null,
        dateTo: null,
        from: 0,
        to: 3,
      },
      // fetchPolicy: "cache-and-network",
    }
  )

  const news = dataNews ? dataNews.getNewsEvents.items : []
  const isOwnerContent =
    user.role === access.admin.keyWord || user.role === access.teacher.keyWord

  return (
    <div className='container'>
      <div
        className={`${styles.page__carousel} ${
          !news.length && styles.page__carousel__minimize
        }`}
      >
        <Carousel
          slides={news}
          load={loadNews}
          isOwnerContent={isOwnerContent}
          content=''
          type=''
          noImage
        >
          {(params: any) =>
            news.map((item: INewsEventSlider, index: number) => {
              return (
                <NewsSlide
                  key={item.id}
                  info={item}
                  index={index}
                  params={params}
                />
              )
            })
          }
        </Carousel>
      </div>
      <AboutModule />
      <GalleryModule />
      <NewsEventsModuleContainer from={3} isNews={true}>
        {(items: INewsEventSlider[], loading: boolean, isNews: boolean) => (
          <NewsEventsModule items={items} loading={loading} isNews={isNews} />
        )}
      </NewsEventsModuleContainer>
      <NewsEventsModuleContainer isNews={true}>
        {(items: INewsEventSlider[], loading: boolean, isNews: boolean) => (
          <NewsEventsModuleGrid
            items={items}
            loading={loading}
            isNews={isNews}
          />
        )}
      </NewsEventsModuleContainer>
      {/* <NewsEventsModule isNews={false} /> */}
      <BooksModule />
    </div>
  )
}

export default Home
