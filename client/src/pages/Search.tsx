import React, { useState, useEffect, useRef } from "react"
import NewsEventsModuleContainer from "../components/NewsEventsModuleContainer"
import FooterModule from "../components/FooterModule"
import NewsEventsModule from "../components/NewsEventsModule"
import {
  INewsEventSlider,
  IImage,
  INewsEventShort,
  IPageSectionShorter,
} from "../interfaces"
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
import NewsEvent from "../components/NewsEventCard"
import PlugCard from "../components/PlugCard"
import { convertContent } from "../helpers/convertContentEditor"
import { convertDate } from "../helpers/convertDate"
import { FiLink2 } from "react-icons/fi"
import { AiOutlineClockCircle } from "react-icons/ai"

const Search: React.FC = () => {
  const anchor = useRef<HTMLDivElement>(null)
  const history = useHistory()
  const location = useLocation()
  const params = new URLSearchParams(location.search)

  const search = params.get("search") || ""
  let tags = params.get("tags") || "all"

  const checkers = [
    {
      title: "Зображення",
      keyWord: "images",
    },
    {
      title: "Новини",
      keyWord: "news",
    },
    {
      title: "Події",
      keyWord: "events",
    },
    {
      title: "Інше",
      keyWord: "other",
    },
  ]

  const [searchStr, setSearchStr] = useState("")
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

  useEffect(() => {
    anchor.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [])

  useEffect(() => {
    if (search) {
      setSearchStr(search)
    }
  }, [search])

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

  const getUrl = (item: IPageSectionShorter) => {
    switch (item.url) {
      case "/library":
        return `/library/${item.id}`
      case "/team":
        return `/team?page=1&category=all&search=${item.title}`
      default:
        return `${item.url}?section=${item.id}`
    }
  }

  const images = dataSearch && dataSearch.searchContent.images
  const news = dataSearch && dataSearch.searchContent.news
  const events = dataSearch && dataSearch.searchContent.events
  const other = dataSearch && dataSearch.searchContent.other

  const imagesJSX = images?.map((image: IImage, index: number) => {
    if (index === 3) {
      return (
        <PlugCard
          key={image.id}
          url={`/gallery?page=1&type=all${search && `&search=${search}`}`}
          title={`Більше зображень${search && " за запитом"}`}
          image={image.location}
        />
      )
    } else {
      return (
        <ImageCard
          key={image.id}
          info={image}
          images={images}
          onEdit={refetchSearch}
          onRemove={refetchSearch}
          onCreate={refetchSearch}
        />
      )
    }
  })

  const newsJSX = news?.map((item: INewsEventShort, index: number) => {
    if (index === 3) {
      return (
        <PlugCard
          key={item.id}
          url={`/news?page=1&category=all${search && `&search=${search}`}`}
          title={`Більше новин${search && " за запитом"}`}
          image={item.preview.location}
        />
      )
    } else {
      return <NewsEvent key={item.id} info={item} />
    }
  })

  const eventsJSX = events?.map((item: INewsEventShort, index: number) => {
    if (index === 3) {
      return (
        <PlugCard
          key={item.id}
          url={`/events?page=1&category=all${search && `&search=${search}`}`}
          title={`Більше подій${search && " за запитом"}`}
          image={item.preview.location}
        />
      )
    } else {
      return <NewsEvent key={item.id} info={item} />
    }
  })

  const otherJSX = other?.map((item: IPageSectionShorter, index: number) => {
    const url = getUrl(item)
    return (
      <div key={item.id} className={styles.section}>
        <div>
          <Link to={url} className={styles.section__url}>
            <FiLink2 className={styles.section__url_icon} />
            <span>{url}</span>
          </Link>
        </div>
        <div className={styles.section__title_container}>
          <span className={styles.section__order}>{index + 1}.</span>
          <Link className={styles.section__title} to={url}>
            {item.title}
          </Link>
        </div>
        <div className={styles.section__content}>
          {convertContent(item.content)}
        </div>
        <div className={styles.section__date}>
          <AiOutlineClockCircle className={styles.section__date_icon} />
          <span>{convertDate(item.date)}</span>
        </div>
      </div>
    )
  })

  return (
    <div className='container'>
      <div ref={anchor}></div>
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
          <p className={stylesForm.form_filter__footer}>
            {search && (
              <span className={stylesForm.form_filter__results}>
                Результати пошуку "
                <span className={stylesForm.form_filter__search_string}>
                  {search}
                </span>
                "
              </span>
            )}
          </p>
        </div>
      </div>

      <div className='wrapper'>
        {loadSearch ? (
          <Loader />
        ) : !images.length &&
          !news.length &&
          !events.length &&
          !other.length ? (
          <div className='plug-text'>Порожньо</div>
        ) : (
          <div>
            {!!images.length && (
              <div className={styles.module}>
                <div>
                  <Link className={styles.module__title} to='/gallery'>
                    Зображення
                  </Link>
                </div>
                <div className={styles.module__body}>{imagesJSX}</div>
              </div>
            )}
            {!!news.length && (
              <div className={styles.module}>
                <div>
                  <Link className={styles.module__title} to='/news'>
                    Новини
                  </Link>
                </div>
                <div className={styles.module__body}>{newsJSX}</div>
              </div>
            )}
            {!!events.length && (
              <div className={styles.module}>
                <div>
                  <Link className={styles.module__title} to='/events'>
                    Події
                  </Link>
                </div>
                <div className={styles.module__body}>{eventsJSX}</div>
              </div>
            )}
            {!!other.length && (
              <div className={styles.module}>
                <div>
                  <div className={styles.module__title}>Інші джерела</div>
                </div>
                <div className={styles.module__body_sections}>{otherJSX}</div>
              </div>
            )}
          </div>
        )}
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
