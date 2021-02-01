import React, { useEffect, useState } from "react"
import Title from "../components/Title"
import ButtonTab from "../components/ButtonTab"
import { BsPlus } from "react-icons/bs"
import { MODIMAGE_OPEN } from "../redux/toggle/toggleTypes"
import { useDispatch } from "react-redux"
import { types } from "../modules/uploadTypes"
import { useLocation } from "react-router-dom"
import { GET_IMAGES } from "../fetching/queries"
import { useLazyQuery, useQuery } from "@apollo/client"
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
  const params = new URLSearchParams(location)
  const page = Number(params.get("page")) || 1
  const type = params.get("type") || ""
  const search = params.get("search") || ""
  const amountItems = 15
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
      type,
    },
  })
  const dispatch = useDispatch()

  let options = Object.keys(uploadTypes).map((item) => {
    // @ts-ignore
    return { value: uploadTypes[item].keyWord, label: uploadTypes[item].label }
  })
  options.push({ value: "", label: "Усі" })

  const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log("SUBMITED!")
  }
  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchStr(event.target.value)
  }

  const getRedirectLink = (number: number) => {
    const typeQuery = `${type ? "type=" + type + "&" : ""}`
    const searchQuery = `${search ? "search=" + search + "&" : ""}`
    let link = `/gallery?page=${number}&${typeQuery}${searchQuery}`
    return link.slice(0, link.length - 1)
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
          <span className={styles.image__date}>{convertDate(image.date)}</span>
        </button>
      )
    })

  return (
    <div className='container'>
      <Title title='Галерея' />
      <div className='wrapper'>
        <form onSubmit={handleSubmitForm} className={stylesForm.form_filter}>
          <div className={stylesForm.form_filter__search}>
            <input
              className={stylesForm.form_filter__search_input}
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
        <div className={styles.images}>{imagesJSX}</div>
        <div>
          <Pagination
            getRedirectLink={getRedirectLink}
            quantityItem={143}
            amountItemsPage={15}
            currentPageNumber={1}
          />
        </div>
        <ButtonTab
          Icon={BsPlus}
          click={() =>
            dispatch({
              type: MODIMAGE_OPEN,
              payload: { id: "", content: null, type: types.image.keyWord },
            })
          }
        />
      </div>
    </div>
  )
}

export default Gallery
