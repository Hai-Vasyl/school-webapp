import React, { useEffect, useState } from "react"
import Title from "../components/Title"
import ButtonTab from "../components/ButtonTab"
import { BsPencilSquare } from "react-icons/bs"
import { MODIMAGE_OPEN } from "../redux/toggle/toggleTypes"
import { useDispatch } from "react-redux"
import { types } from "../modules/uploadTypes"
import { useLocation, useHistory } from "react-router-dom"
import { GET_IMAGES } from "../fetching/queries"
import { useQuery } from "@apollo/client"
import { types as uploadTypes, getParamsByType } from "../modules/uploadTypes"
// @ts-ignore
import stylesBtn from "../styles/button.module"
// @ts-ignore
import styles from "../styles/gallery.module"
import { IImage } from "../interfaces"
import { convertDate } from "../helpers/convertDate"
import Pagination from "../components/Pagination"
import { useSelector } from "react-redux"
import { RootStore } from "../redux/store"
import { access } from "../modules/accessModifiers"
import { LIGHTBOX_OPEN } from "../redux/toggle/toggleTypes"
import Loader from "../components/Loader"
import useLightBox from "../hooks/useLightBox"
import FilterSearch from "../components/FilterSearch"

const Gallery: React.FC = () => {
  const location = useLocation().search
  const history = useHistory()
  const {
    auth: { user },
  } = useSelector((state: RootStore) => state)
  const params = new URLSearchParams(location)
  const page = Number(params.get("page")) || 1
  const type = params.get("type") || "all"
  let search = params.get("search") || ""
  const amountItems = 15
  // const anchor = useRef<HTMLDivElement>(null)
  let searchWords = search.split(" ")
  for (let i = 0; i < searchWords.length; i++) {
    searchWords[i] = searchWords[i].replace("hash_", "#")
  }
  search = searchWords.join(" ")
  const { getLightBox } = useLightBox()
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
  })
  const dispatch = useDispatch()

  useEffect(() => {
    setSearchStr(search)
  }, [search])

  // useEffect(() => {
  //   anchor.current && anchor.current.scrollIntoView({ behavior: "smooth" })
  // }, [page])

  let options = Object.keys(uploadTypes).map((item) => {
    // @ts-ignore
    return { value: uploadTypes[item].keyWord, label: uploadTypes[item].label }
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

  const handlePopupEditImage = (
    imageId: string,
    event?: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event && event.stopPropagation()
    dispatch({
      type: MODIMAGE_OPEN,
      payload: {
        id: imageId,
        content: null,
        type: types.image.keyWord,
        onEdit: () => {
          refetchImages()
        },
        onRemove: () => {
          refetchImages()
        },
        onCreate: () => {
          refetchImages()
        },
      },
    })
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

  const handlePopupLightBox = (imageId: string) => {
    const { getIndexImage, checkMoveAccess, onMove } = getLightBox(
      dataImages && dataImages.getImages.images
    )
    const { isLeft, isRight } = checkMoveAccess(getIndexImage(imageId))
    dispatch({
      type: LIGHTBOX_OPEN,
      payload: {
        imageId,
        onMove,
        isLeft,
        isRight,
        handleEditImage: () => handlePopupEditImage(imageId),
      },
    })
  }

  const imagesJSX =
    dataImages &&
    dataImages.getImages.images.map((image: IImage) => {
      const imageParams: any = getParamsByType(image.type)
      return (
        <div
          className={styles.image}
          key={image.id}
          onClick={() => handlePopupLightBox(image.id)}
        >
          <img
            className={styles.image__preview}
            src={image.location}
            alt='imgItem'
          />
          <span className={styles.image__overlay}></span>
          <span className={styles.image__icon}>
            <imageParams.Icon />
          </span>
          {(user.role === access.admin.keyWord ||
            user.id === image.owner.id) && (
            <ButtonTab
              exClass={`${stylesBtn.btn_tab_glass} ${styles.image__btn_overlay}`}
              Icon={BsPencilSquare}
              click={(event) => handlePopupEditImage(image.id, event)}
            />
          )}
          <span className={styles.image__date}>{convertDate(image.date)}</span>
        </div>
      )
    })

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
    </div>
  )
}

export default Gallery
