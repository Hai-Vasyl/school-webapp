import React from "react"
import { GET_PAGE_SECTIONS_SHORT } from "../fetching/queries"
import { useQuery } from "@apollo/client"
import Loader from "./Loader"
import { IPageSectionShort } from "../interfaces"
// @ts-ignore
import styles from "../styles/pages.module"
// @ts-ignore
import stylesBtn from "../styles/button.module"
import { Link, useHistory } from "react-router-dom"
import ItemInfoSection from "../components/ItemInfoSection"
import Button from "./Button"

interface IBooksModuleProps {
  exceptId?: string
  title?: string
}

const BooksModule: React.FC<IBooksModuleProps> = ({ exceptId, title }) => {
  const amountItems = 4
  const pathname = "/library"
  const history = useHistory()

  const { data: dataSections, loading: loadSections } = useQuery(
    GET_PAGE_SECTIONS_SHORT,
    {
      variables: {
        search: "",
        filters: [],
        from: 0,
        to: amountItems,
        url: pathname,
        exceptId,
      },
    }
  )

  const items = dataSections ? dataSections.getPageSections.items : []
  return (
    <div className={styles.module}>
      <div className='wrapper'>
        <div>
          <Link to='/library' className={styles.module__title}>
            {title || "Бібліотека"}
          </Link>
        </div>
        {loadSections ? (
          <Loader />
        ) : (
          <div
            className={`${styles.page_wrapper} ${styles.page_wrapper__grid_4}`}
          >
            {items.map((item: IPageSectionShort) => {
              return (
                <ItemInfoSection
                  key={item.id}
                  info={item}
                  itemLink={`${pathname}/${item.id}`}
                  link={{
                    keyWord: "group",
                    title: "Клас",
                    text: `${pathname}?page=1&group=`,
                  }}
                  subtitle={{
                    keyWord: "genre",
                    title: "Жанр",
                    text: `${pathname}?page=1&genre=`,
                  }}
                />
              )
            })}
          </div>
        )}
        <div className={styles.module__more}>
          <Button
            exClass={`${stylesBtn.btn_simple} ${styles.module__more_btn}`}
            click={() => history.push("/library")}
            title='Більше підручників'
          />
        </div>
      </div>
    </div>
  )
}

export default BooksModule
