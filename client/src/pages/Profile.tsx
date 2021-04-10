import React, { useEffect, useState } from "react"
import { GET_PAGE_SECTIONS, GET_DATA_USER } from "../fetching/queries"
import { SET_USER_AVA } from "../fetching/mutations"
import { useQuery, useLazyQuery, useMutation } from "@apollo/client"
import Title from "../components/Title"
// @ts-ignore
import styles from "../styles/profile.module"
import { useLocation, useParams } from "react-router-dom"
import Loader from "../components/Loader"
import LoaderData from "../components/LoaderData"
import { useSelector, useDispatch } from "react-redux"
import { RootStore } from "../redux/store"
import { access } from "../modules/accessModifiers"
import { INewsEventSlider, IPageSection } from "../interfaces"
// import PageSection from "./PageSection"
// import ModSectionForm from "./ModSectionForm"
import NewsEventsModule from "../components/NewsEventsModule"
// import NavbarPage from "./NavbarPage"
// import SectionAbout from "./SectionAbout"
// import SideNavbar from "./SideNavbar"
import NewsEventsModuleContainer from "../components/NewsEventsModuleContainer"
import FooterModule from "../components/FooterModule"
// import DesignLayout_1 from "./DesignLayout_1"
import ButtonFile from "../components/ButtonFile"
import UserAva from "../components/UserAva"
import ButtonTab from "../components/ButtonTab"
// @ts-ignore
import stylesBtn from "../styles/button.module"
import { RiImageAddFill } from "react-icons/ri"
import { BsArrowRepeat, BsTrash } from "react-icons/bs"
import { SET_TOAST } from "../redux/toasts/toastsTypes"
import { SET_USER_DATA } from "../redux/auth/authTypes"
import { LIGHTBOX_LIGHT_OPEN } from "../redux/toggle/toggleTypes"
import { getUserAccess } from "../modules/accessModifiers"

const Profile: React.FC = () => {
  const { userId }: any = useParams()
  const {
    auth: { user },
  } = useSelector((state: RootStore) => state)
  const dispatch = useDispatch()
  const isMyProfile = userId === user.id
  const [activeSection, setActiveSection] = useState("")
  const [initLoad, setInitLoad] = useState(true)
  const { pathname } = useLocation()
  const [
    getUser,
    { data: dataUser, loading: loadUser, refetch: refetchUser },
  ] = useLazyQuery(GET_DATA_USER)
  const [setUserAva, { data: dataUserAva, loading: loadUserAva }] = useMutation(
    SET_USER_AVA
  )
  // const [
  //   getUser,
  //   { data: dataUser, loading: loadUser },
  // ] = useLazyQuery(GET_DATA_USER, { fetchPolicy: "no-cache" })

  // const {
  //   data: dataSections,
  //   loading: loadSections,
  //   refetch: refetchSections,
  // } = useQuery(GET_PAGE_SECTIONS, {
  //   variables: {
  //     filters: [],
  //     from: 0,
  //     url: pathname,
  //   },
  // })

  const [toggleForm, setToggleForm] = useState(false)

  useEffect(() => {
    const data = dataUser && dataUser.getUser
    if (isMyProfile && !!data) {
      dispatch({ type: SET_USER_DATA, payload: data })
    }
  }, [dispatch, isMyProfile, dataUser])

  useEffect(() => {
    if (!isMyProfile) {
      getUser({ variables: { userId: user.id } })
    }
  }, [getUser, isMyProfile])

  useEffect(() => {
    const data = dataUserAva && dataUserAva.setUserAva
    if (data) {
      dispatch({
        type: SET_TOAST,
        payload: data,
      })
      const userData = dataUser && dataUser.getUser
      if (!!userData) {
        refetchUser && refetchUser()
      } else {
        getUser({ variables: { userId: user.id } })
      }
    }
  }, [dispatch, dataUserAva])

  const handleModImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target
    if (files && files.length) {
      setUserAva({
        variables: {
          image: files[0],
          deleting: false,
        },
      })
    }
  }

  const handleDeleteImage = () => {
    setUserAva({
      variables: {
        deleting: true,
      },
    })
  }

  const userData = isMyProfile ? user : dataUser?.getUser
  const userParams = getUserAccess(userData.role)

  const handlePopupLightBox = () => {
    dispatch({
      type: LIGHTBOX_LIGHT_OPEN,
      payload: {
        image: userData.ava,
        title: `${userData.firstname} ${userData.lastname}`,
      },
    })
  }

  console.log({ userParams })
  return (
    <div className='container'>
      <Title
        title={isMyProfile ? "Особистий кабінет" : "Профіль користувача"}
        path='/profile'
      />
      <div className='wrapper'>
        <div className={styles.user}>
          <div className={styles.user__preview}>
            <button
              className={styles.user__btn_lightbox}
              onClick={handlePopupLightBox}
            >
              <LoaderData load={loadUser || loadUserAva} />
              <span className={styles.user__overlay}></span>
              {userData.ava ? (
                <img
                  className={styles.user__ava}
                  src={userData.ava}
                  alt='avaImg'
                />
              ) : (
                <UserAva
                  color={userData.color}
                  ava={userData.ava}
                  firstname={userData.firstname}
                  lastname={userData.lastname}
                />
              )}
            </button>
            <span className={styles.user__icon}>
              {userParams && <userParams.Icon />}
            </span>
            {isMyProfile && (
              <div className={styles.user__btn_image}>
                <ButtonFile
                  Icon={!user.ava ? RiImageAddFill : BsArrowRepeat}
                  exClass={stylesBtn.btn_tab_glass}
                  change={handleModImage}
                />
                {user.ava && (
                  <ButtonTab
                    exClass={stylesBtn.btn_tab_glass}
                    Icon={BsTrash}
                    click={handleDeleteImage}
                  />
                )}
              </div>
            )}
          </div>
          <div className={styles.user__info}>sdfsdfdsf</div>
        </div>
        {/* {loadSections ? (
            <Loader />
          ) : sections.length ? (
            <div className={styles.page_wrapper_flex}>
              {links.length > 1 && (
                <SideNavbar
                  links={links}
                  active={activeSection}
                  setActive={setActiveSection}
                  exClass={styles.page_wrapper_flex__sidebar}
                />
              )}
              <div className={styles.page_wrapper_flex__content}>
                {sectionsJSX}
              </div>
            </div>
          ) : (
            <div className='plug-text'>Порожньо</div>
          )} */}
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

export default Profile
