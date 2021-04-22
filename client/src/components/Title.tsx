import React, { useEffect } from "react"
import { useQuery, useMutation } from "@apollo/client"
// @ts-ignore
import styles from "../styles/title.module"
// @ts-ignore
import stylesBtn from "../styles/button.module"
import { useLocation } from "react-router-dom"
import { GET_PAGE } from "../fetching/queries"
import ButtonTab from "./ButtonTab"
import { BsArrowRepeat, BsTrash } from "react-icons/bs"
import ButtonFile from "./ButtonFile"
import LoaderData from "./LoaderData"
import { SET_PAGE_IMAGE } from "../fetching/mutations"
import { useDispatch, useSelector } from "react-redux"
import { RootStore } from "../redux/store"
import { SET_TOAST } from "../redux/toasts/toastsTypes"
import { access } from "../modules/accessModifiers"
import { RiImageAddFill } from "react-icons/ri"
import { setPath } from "../index"

interface ITitleProps {
  title: string
  path?: string
}

const Title: React.FC<ITitleProps> = ({ title, path }) => {
  const {
    auth: { user },
  } = useSelector((state: RootStore) => state)
  const dispatch = useDispatch()
  const { pathname } = useLocation()

  const {
    data: dataImage,
    loading: loadImage,
    refetch: refetchImage,
  } = useQuery(GET_PAGE, {
    variables: { url: path || pathname },
  })
  const [
    setPageImage,
    { data: dataSetImage, loading: loadSetImage, error },
  ] = useMutation(SET_PAGE_IMAGE)

  useEffect(() => {
    const data = dataSetImage && dataSetImage.setPageImage
    if (data) {
      dispatch({
        type: SET_TOAST,
        payload: data,
      })
      refetchImage()
    }
  }, [dispatch, dataSetImage])

  const handleModImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target
    if (files && files.length) {
      setPageImage({
        variables: {
          url: path || pathname,
          image: files[0],
          deleting: false,
        },
      })
    }
  }

  const handleDeleteImage = () => {
    setPageImage({
      variables: {
        url: path || pathname,
        deleting: true,
      },
    })
  }

  const image = dataImage && dataImage.getPage ? dataImage.getPage.image : ""
  return (
    <div className={styles.title}>
      <LoaderData load={loadImage || loadSetImage} noSpiner />
      {!!image.length && (
        <img
          src={setPath(image)}
          className={styles.title__image}
          alt='bgImage'
        />
      )}
      <div className={styles.title__layer}></div>
      {user.role === access.admin.keyWord && (
        <div className={styles.title__btns}>
          <ButtonFile
            Icon={!image ? RiImageAddFill : BsArrowRepeat}
            exClass={`${stylesBtn.btn_tab_glass} ${
              !image && styles.title__btn
            }`}
            change={handleModImage}
          />
          {image && (
            <ButtonTab
              exClass={stylesBtn.btn_tab_glass}
              Icon={BsTrash}
              click={handleDeleteImage}
            />
          )}
        </div>
      )}
      <h2 className={styles.title__text}>{title}</h2>
    </div>
  )
}

export default Title
