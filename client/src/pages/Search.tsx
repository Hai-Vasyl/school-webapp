import React, { useState } from "react"
import NewsEventsModuleContainer from "../components/NewsEventsModuleContainer"
import FooterModule from "../components/FooterModule"
import NewsEventsModule from "../components/NewsEventsModule"
import { INewsEventSlider, IImage } from "../interfaces"
import Loader from "../components/Loader"
import Title from "../components/Title"
import ButtonCheckBox from "../components/ButtonCheckBox"
// @ts-ignore
import styles from "../styles/search.module"
// @ts-ignore
import stylesForm from "../styles/form.module"
import FieldSearch from "../components/FieldSearch"
import { useHistory, useLocation, Link } from "react-router-dom"
import { SEARCH_CONTENT } from "../fetching/queries"
import { useQuery } from "@apollo/client"
import ImageCard from "../components/ImageCard"

const Search: React.FC = () => {
  const history = useHistory()
  const location = useLocation()
  const params = new URLSearchParams(location.search)

  const search = params.get("search") || ""
  let tags = params.get("tags") || "all"

  const checkers = [
    {
      title: "Новини",
      keyWord: "news",
    },
    {
      title: "Події",
      keyWord: "events",
    },
    {
      title: "Зображення",
      keyWord: "images",
    },
    {
      title: "Інше",
      keyWord: "other",
    },
  ]

  const [searchStr, setSearchStr] = useState(search)
  const {
    data: dataSearch,
    loading: loadSearch,
    refetch: refetchSearch,
  } = useQuery(SEARCH_CONTENT, {
    variables: {
      search,
      tags: tags === "all" ? "" : tags,
    },
  })

  console.log({ dataSearch })

  const getRedirectLink = (tags?: string, searchStr?: string) => {
    const searchQuery = `${searchStr ? "search=" + searchStr + "&" : ""}`

    let link = `/discover?tags=${tags}&${searchQuery}`
    history.push(link.slice(0, link.length - 1))
  }

  const handleResetSearch = () => {
    setSearchStr("")
    getRedirectLink(tags)
  }

  const checkSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if (!value) {
      handleResetSearch()
      return
    }
  }

  const checkIfChecked = (keyWord: string) => {
    return tags.includes(keyWord)
  }

  const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    getRedirectLink(tags, searchStr)
  }

  const handleCheckTag = (status: boolean, tag: string) => {
    let _tags = ""
    let _search = search

    if (status) {
      _tags = tags.replaceAll(tag, "")
      _tags = _tags.trim().replace(/\s+/g, " ")
      if (!_tags.length) {
        _tags = "all"
      }
    } else {
      if (tags.includes("all")) {
        tags = tags.replaceAll("all", "")
        _tags = tag
      } else {
        _tags = `${tags} ${tag}`
      }
    }

    getRedirectLink(_tags, _search)
  }

  const btns = checkers.map((btn) => {
    const isChecked = checkIfChecked(btn.keyWord)

    return (
      <ButtonCheckBox
        key={btn.keyWord}
        title={btn.title}
        status={isChecked}
        click={() => handleCheckTag(isChecked, btn.keyWord)}
      />
    )
  })
  const images = dataSearch && dataSearch.searchContent.images
  const imagesJSX = images?.map((image: IImage) => (
    <ImageCard
      key={image.id}
      info={image}
      images={images}
      onEdit={refetchSearch}
      onRemove={refetchSearch}
      onCreate={refetchSearch}
    />
  ))

  return (
    <div className='container'>
      <Title title='Шукати контент' />
      <div className={stylesForm.form_filter_container}>
        <div className='wrapper-clear'>
          <form onSubmit={handleSubmitForm} className={stylesForm.form_filter}>
            <FieldSearch
              resetSearch={handleResetSearch}
              search={search}
              check={checkSearch}
              searchStr={searchStr}
              change={setSearchStr}
            />
            <div className={styles.form_tags}>{btns}</div>
            <button className='btn-handler'></button>
          </form>

          {/* <p className={styles.form_filter__footer}>
          {!search ? (
            <span className={styles.form_filter__results}>
              Кількість результатів:
              <span className={styles.form_filter__results_counter}>
                {quantityItems}
              </span>
            </span>
          ) : (
            <span className={styles.form_filter__results}>
              Кількість результатів пошуку "
              <span className={styles.form_filter__search_string}>
                {search}
              </span>
              ":
              <span className={styles.form_filter__results_counter}>
                {quantityItems}
              </span>
            </span>
          )}
        </p> */}
        </div>
      </div>

      <div className='wrapper'>
        {/* {initLoad ? (
          <Loader />
        ) : (*/}
        <div className={styles.module}>
          <div>
            <Link className={styles.module__title} to='/gallery'>
              Зображення
            </Link>
          </div>
          <div className={styles.module__body}>
            {imagesJSX}
            <Link
              className={styles.module__item_more}
              to={`/gallery?page=1&type=all&search=${search}`}
            >
              <span>Більше зображень за запитом</span>
            </Link>
          </div>
        </div>
        {/* )} */}
      </div>
      <NewsEventsModuleContainer isNews={true}>
        {(items: INewsEventSlider[], loading: boolean, isNews: boolean) => (
          <NewsEventsModule items={items} loading={loading} isNews={isNews} />
        )}
      </NewsEventsModuleContainer>
      <FooterModule />
    </div>
  )
}

export default Search
