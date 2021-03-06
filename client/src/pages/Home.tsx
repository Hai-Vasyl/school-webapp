import React from "react"
import { GET_NEWS_EVENTS_DETAILED } from "../fetching/queries"
import { useQuery } from "@apollo/client"
import { access } from "../modules/accessModifiers"
import { useSelector } from "react-redux"
import { RootStore } from "../redux/store"
import Carousel from "../components/Carousel"
// @ts-ignore
import styles from "../styles/pages.module"
import { INewsEventSlider } from "../interfaces"
import NewsSlide from "../components/NewsSlide"
import AboutModule from "../components/AboutModule"
import GalleryModule from "../components/GalleryModule"
import NewsEventsModule from "../components/NewsEventsModule"
import NewsEventsModuleGrid from "../components/NewsEventsModuleGrid"
import BooksModule from "../components/BooksModule"
import NewsEventsModuleContainer from "../components/NewsEventsModuleContainer"
import ContactsModule from "../components/ContactsModule"
import UsefulLinksModule from "../components/UsefulLinksModule"
import FooterModule from "../components/FooterModule"
// @ts-ignore
import bg_1 from "../images/plant-1.svg"
// @ts-ignore
import bg_3 from "../images/plant-3.svg"
// @ts-ignore
import bg_8 from "../images/plant-8.svg"
// @ts-ignore
import bg_6 from "../images/plant-6.svg"

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

      <div className={styles.page__wrapper_module}>
        <img
          className={`${styles.page__bg} ${styles.page__bg_home_1}`}
          src={bg_1}
          alt='bgImage'
        />
        <img
          className={`${styles.page__bg} ${styles.page__bg_home_2}`}
          src={bg_3}
          alt='bgImage'
        />
        <img
          className={`${styles.page__bg} ${styles.page__bg_home_3}`}
          src={bg_8}
          alt='bgImage'
        />
        <AboutModule />
      </div>
      <GalleryModule />
      <div className={styles.page__wrapper_module}>
        <img
          className={`${styles.page__bg} ${styles.page__bg_home_4}`}
          src={bg_6}
          alt='bgImage'
        />
        <NewsEventsModuleContainer from={3} isNews={true}>
          {(items: INewsEventSlider[], loading: boolean, isNews: boolean) => (
            <NewsEventsModule items={items} loading={loading} isNews={isNews} />
          )}
        </NewsEventsModuleContainer>
      </div>
      <NewsEventsModuleContainer isNews={true}>
        {(items: INewsEventSlider[], loading: boolean, isNews: boolean) => (
          <NewsEventsModuleGrid
            items={items}
            loading={loading}
            isNews={isNews}
          />
        )}
      </NewsEventsModuleContainer>
      <div className={styles.page__wrapper_module}>
        <BooksModule />
      </div>
      <UsefulLinksModule />
      <ContactsModule />
      <FooterModule />
    </div>
  )
}

export default Home
