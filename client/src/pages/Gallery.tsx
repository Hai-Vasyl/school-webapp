import React, { useEffect, useState } from "react"
import Title from "../components/Title"
import { MODIMAGE_OPEN } from "../redux/toggle/toggleTypes"
import { useDispatch } from "react-redux"
import { types } from "../modules/uploadTypes"
import { useLocation, useHistory } from "react-router-dom"
import { GET_IMAGES } from "../fetching/queries"
import { useQuery } from "@apollo/client"
import { types as uploadTypes } from "../modules/uploadTypes"
// @ts-ignore
import styles from "../styles/gallery.module"
import { IImage, IOption, INewsEventSlider } from "../interfaces"
import Pagination from "../components/Pagination"
import Loader from "../components/Loader"
import FilterSearch from "../components/FilterSearch"
import DesignLayout_3 from "../components/DesignLayout_3"
import NewsEventsModuleContainer from "../components/NewsEventsModuleContainer"
import NewsEventsModule from "../components/NewsEventsModule"
import FooterModule from "../components/FooterModule"
import ImageCard from "../components/ImageCard"

const Gallery: React.FC = () => {
  const location = useLocation().search
  const history = useHistory()
  const params = new URLSearchParams(location)
  const page = Number(params.get("page")) || 1
  const type = params.get("type") || "all"
  let search = params.get("search") || ""
  const amountItems = 15
  let searchWords = search.split(" ")
  for (let i = 0; i < searchWords.length; i++) {
    searchWords[i] = searchWords[i].replace("hash_", "#")
  }
  search = searchWords.join(" ")
  const [searchStr, setSearchStr] = useState(search)
  const [typeImage, setTypeImage] = useState([
    {
      param: "type",
      type: "text",
      value: type,
      title: "Тип зображення",
      msg: "",
    },
  ])
  const {
    data: dataImages,
    loading: loadImages,
    refetch: refetchImages,
  } = useQuery(GET_IMAGES, {
    variables: {
      from: (page - 1) * amountItems,
      to: amountItems,
      search,
      type: type === "all" ? "" : type,
    },
    fetchPolicy: "cache-and-network",
  })
  const dispatch = useDispatch()

  useEffect(() => {
    setSearchStr(search)
  }, [search])

  let options: IOption[] = []
  Object.keys(uploadTypes).forEach((item) => {
    // @ts-ignore
    if (uploadTypes[item].keyWord === uploadTypes.private.keyWord) {
      return
    }
    options.push({
      // @ts-ignore
      value: uploadTypes[item].keyWord,
      // @ts-ignore
      label: uploadTypes[item].label,
    })
  })

  const getRedirectLink = (
    number: number,
    typeCustom?: string,
    searchCustom?: string
  ) => {
    let searchParam = searchCustom || search
    let searchWords = searchParam.split(" ")
    for (let i = 0; i < searchWords.length; i++) {
      searchWords[i] = searchWords[i].replace("#", "hash_")
    }
    searchParam = searchWords.join(" ")
    const typeParam = typeCustom || type
    const typeQuery = `${typeParam ? "type=" + typeParam + "&" : ""}`
    const searchQuery =
      searchCustom === "all"
        ? ""
        : `${searchParam ? "search=" + searchParam + "&" : ""}`
    let link = `/gallery?page=${number}&${typeQuery}${searchQuery}`
    history.push(link.slice(0, link.length - 1))
  }

  const handleResetSearch = () => {
    setSearchStr("")
    getRedirectLink(1, typeImage[0].value, "all")
  }

  const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    getRedirectLink(1, typeImage[0].value, searchStr.trim())
  }

  const handlePopupCreateImage = () => {
    dispatch({
      type: MODIMAGE_OPEN,
      payload: {
        id: "",
        content: null,
        type: types.image.keyWord,
        onCreate: () => {
          refetchImages()
        },
      },
    })
  }

  const images = dataImages && dataImages.getImages.images
  const imagesJSX = images?.map((image: IImage) => (
    <ImageCard
      key={image.id}
      info={image}
      images={images}
      onEdit={refetchImages}
      onRemove={refetchImages}
      onCreate={refetchImages}
    />
  ))

  const quantityItems = dataImages && dataImages.getImages.quantity
  return (
    <div className='container'>
      <Title title='Галерея' />
      <FilterSearch
        handleSubmit={handleSubmitForm}
        quantityItems={quantityItems}
        search={search}
        searchStr={searchStr}
        options={options}
        onClickBtnPlus={handlePopupCreateImage}
        handleResetSearch={handleResetSearch}
        setSearchStr={setSearchStr}
        setFormPicker={setTypeImage}
        fieldPicker={typeImage[0]}
      />
      <DesignLayout_3>
        <div className='wrapper'>
          {!!quantityItems && (
            <Pagination
              getRedirectLink={getRedirectLink}
              quantityItem={quantityItems}
              amountItemsPage={amountItems}
              currentPageNumber={page}
              isTop
            />
          )}
          <div
            className={`${styles.images} ${
              (loadImages || !(imagesJSX && imagesJSX.length)) &&
              styles.images__load
            }`}
          >
            {loadImages ? (
              <Loader />
            ) : imagesJSX.length ? (
              imagesJSX
            ) : (
              <div className='plug-text'>Порожньо</div>
            )}
          </div>
          {!!quantityItems && (
            <Pagination
              getRedirectLink={getRedirectLink}
              quantityItem={quantityItems}
              amountItemsPage={amountItems}
              currentPageNumber={page}
            />
          )}
        </div>
      </DesignLayout_3>
      <NewsEventsModuleContainer isNews={true}>
        {(items: INewsEventSlider[], loading: boolean, isNews: boolean) => (
          <NewsEventsModule items={items} loading={loading} isNews={isNews} />
        )}
      </NewsEventsModuleContainer>
      <FooterModule />
    </div>
  )
}

export default Gallery
