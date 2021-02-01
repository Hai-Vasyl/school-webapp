import React, { useEffect, useState, useRef } from "react"
import Title from "../components/Title"
import ButtonTab from "../components/ButtonTab"
import { BsPlus, BsX } from "react-icons/bs"
import { MODIMAGE_OPEN } from "../redux/toggle/toggleTypes"
import { useDispatch } from "react-redux"
import { types } from "../modules/uploadTypes"
import { useLocation, useHistory } from "react-router-dom"
import { GET_IMAGES } from "../fetching/queries"
import { useQuery } from "@apollo/client"
import FieldPicker from "../components/FieldPicker"
import { types as uploadTypes, getParamsByType } from "../modules/uploadTypes"
import { BsSearch } from "react-icons/bs"
// @ts-ignore
import stylesForm from "../styles/form.module"
// @ts-ignore
import styles from "../styles/gallery.module"
import { IImage } from "../interfaces"
import { convertDate } from "../helpers/convertDate"
import Pagination from "../components/Pagination"

const Gallery: React.FC = () => {
  const location = useLocation().search
  const history = useHistory()
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
  console.log({ search })
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
  const { data: dataImages, loading: loadImages } = useQuery(GET_IMAGES, {
    variables: {
      from: (page - 1) * amountItems,
      to: page * amountItems,
      search,
      type: type === "all" ? "" : type,
    },
  })
  const dispatch = useDispatch()

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
  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if (!value) {
      handleResetSearch()
    } else {
      setSearchStr(value)
    }
  }

  const imagesJSX =
    dataImages &&
    dataImages.getImages.images.map((image: IImage) => {
      const imageParams: any = getParamsByType(image.type)
      return (
        <button className={styles.image} key={image.id}>
          <img
            className={styles.image__preview}
            src={image.location}
            alt='imgItem'
          />
          <span className={styles.image__overlay}></span>
          <span className={styles.image__icon}>
            <imageParams.Icon />
          </span>
          {/* <button className={styles.image__icon}></button> */}
          <span className={styles.image__date}>{convertDate(image.date)}</span>
        </button>
      )
    })

  const quantityItems = dataImages && dataImages.getImages.quantity
  return (
    <div className='container'>
      <Title title='Галерея' />
      <div className='wrapper'>
        <div className={stylesForm.form_filter_container}>
          <form onSubmit={handleSubmitForm} className={stylesForm.form_filter}>
            <ButtonTab
              exClass={styles.btn_create_image}
              Icon={BsPlus}
              click={() =>
                dispatch({
                  type: MODIMAGE_OPEN,
                  payload: { id: "", content: null, type: types.image.keyWord },
                })
              }
            />
            <div className={stylesForm.form_filter__search}>
              <button
                type='button'
                onClick={handleResetSearch}
                className={`${stylesForm.form_filter__search_btn} ${
                  stylesForm.form_filter__search_btn__reset
                } ${!search && stylesForm.form_filter__search_btn__close}`}
              >
                <BsX />
              </button>
              <input
                className={`${stylesForm.form_filter__search_input} ${
                  !search && stylesForm.form_filter__search_input__close
                }`}
                type='text'
                value={searchStr}
                onChange={handleChangeSearch}
                placeholder='Пошук зображення'
              />
              <button className={stylesForm.form_filter__search_btn}>
                <BsSearch />
              </button>
            </div>
            <FieldPicker
              submit
              exClass={stylesForm.form_filter__picker}
              noError
              change={setTypeImage}
              field={typeImage[0]}
              options={options}
            />
            <button className='btn-handler'></button>
          </form>
          <p className={stylesForm.form_filter__footer}>
            {!search ? (
              <span className={stylesForm.form_filter__results}>
                Кількість результатів:
                <span className={stylesForm.form_filter__results_counter}>
                  {quantityItems}
                </span>
              </span>
            ) : (
              <span className={stylesForm.form_filter__results}>
                Кількість результатів пошуку "
                <span className={stylesForm.form_filter__search_string}>
                  {search}
                </span>
                ":
                <span className={stylesForm.form_filter__results_counter}>
                  {quantityItems}
                </span>
              </span>
            )}
          </p>
        </div>
        <div>
          <Pagination
            getRedirectLink={getRedirectLink}
            quantityItem={quantityItems}
            amountItemsPage={amountItems}
            currentPageNumber={page}
            isTop
          />
        </div>
        <div className={styles.images}>{imagesJSX}</div>
        <div>
          <Pagination
            getRedirectLink={getRedirectLink}
            quantityItem={quantityItems}
            amountItemsPage={amountItems}
            currentPageNumber={page}
          />
        </div>
      </div>
    </div>
  )
}

export default Gallery
