import React, { useEffect, useState, useCallback } from "react"
import { GET_DATA_USER } from "../fetching/queries"
import { SET_USER_AVA, UPDATE_USER_DATA } from "../fetching/mutations"
import { useLazyQuery, useMutation } from "@apollo/client"
import Title from "../components/Title"
// @ts-ignore
import styles from "../styles/profile.module"
// @ts-ignore
import stylesForm from "../styles/form.module"
import { useParams } from "react-router-dom"
import Loader from "../components/Loader"
import LoaderData from "../components/LoaderData"
import { useSelector, useDispatch } from "react-redux"
import { RootStore } from "../redux/store"
import { INewsEventSlider } from "../interfaces"
import NewsEventsModule from "../components/NewsEventsModule"
import NewsEventsModuleContainer from "../components/NewsEventsModuleContainer"
import FooterModule from "../components/FooterModule"
import ButtonFile from "../components/ButtonFile"
import UserAva from "../components/UserAva"
import ButtonTab from "../components/ButtonTab"
import Button from "../components/Button"
// @ts-ignore
import stylesBtn from "../styles/button.module"
import { RiImageAddFill } from "react-icons/ri"
import {
  BsArrowRepeat,
  BsArrowLeft,
  BsPencil,
  BsTrash,
  BsArrowClockwise,
  BsPencilSquare,
} from "react-icons/bs"
import { SET_TOAST } from "../redux/toasts/toastsTypes"
import { SET_USER_DATA } from "../redux/auth/authTypes"
import { LIGHTBOX_LIGHT_OPEN } from "../redux/toggle/toggleTypes"
import { getUserAccess } from "../modules/accessModifiers"
import Field from "../components/Field"
import { convertDate } from "../helpers/convertDate"
import useSetErrorsFields from "../hooks/useSetErrorsFields"

const Profile: React.FC = () => {
  const { userId }: any = useParams()
  const {
    auth: { user, token },
  } = useSelector((state: RootStore) => state)
  const dispatch = useDispatch()
  const [initLoad, setInitLoad] = useState(true)
  const isMyProfile = userId === user.id
  const { setErrors } = useSetErrorsFields()

  const [form, setForm] = useState([
    {
      param: "firstname",
      type: "text",
      value: "",
      title: "Ім'я",
      important: true,
      msg: "",
    },
    {
      param: "lastname",
      type: "text",
      value: "",
      title: "Прізвище",
      important: true,
      msg: "",
    },
    {
      param: "middlename",
      type: "text",
      value: "",
      title: "По батькові",
      msg: "",
    },
    {
      param: "email",
      type: "email",
      value: "",
      title: "Електронна адреса",
      important: true,
      msg: "",
    },
    {
      param: "phone",
      type: "text",
      value: "",
      title: "Телефон",
      msg: "",
    },
    {
      param: "address",
      type: "text",
      value: "",
      title: "Адреса",
      msg: "",
    },
    {
      param: "password",
      type: "password",
      value: "",
      title: "Новий пароль",
      msg: "",
    },
  ])

  const [getUser, { data: dataUser }] = useLazyQuery(GET_DATA_USER, {
    fetchPolicy: "no-cache",
  })
  const [setUserAva, { data: dataUserAva, loading: loadUserAva }] = useMutation(
    SET_USER_AVA
  )
  const [
    updateUserData,
    { data: dataUserData, error: errorUserData, loading: loadUserData },
  ] = useMutation(UPDATE_USER_DATA)

  const [toggleForm, setToggleForm] = useState(false)

  const refreshForm = useCallback(() => {
    setForm((prevForm) =>
      prevForm.map((field) => {
        let fieldValue = field.value
        Object.keys(user).map((key) => {
          if (field.param === key) {
            // @ts-ignore
            fieldValue = user[key]
          }
        })
        return { ...field, value: fieldValue }
      })
    )
  }, [user])

  useEffect(() => {
    if (isMyProfile) {
      refreshForm()
      setInitLoad(false)
    }
  }, [refreshForm])

  useEffect(() => {
    const data = dataUserData && dataUserData.updateUserData
    if (errorUserData) {
      setErrors(errorUserData.message, setForm)
    } else if (data) {
      dispatch({
        type: SET_TOAST,
        payload: data,
      })
      setToggleForm(false)
      getUser({ variables: { userId: user.id } })
    }
  }, [dataUserData, errorUserData, dispatch])

  useEffect(() => {
    const data = dataUser && dataUser.getUser
    if (isMyProfile && !!data) {
      dispatch({ type: SET_USER_DATA, payload: data })
    }
  }, [dispatch, isMyProfile, dataUser])

  useEffect(() => {
    if (!isMyProfile) {
      getUser({ variables: { userId } })
    }
  }, [getUser, isMyProfile, userId])

  useEffect(() => {
    const data = dataUser && dataUser.getUser
    if (!!data) {
      setInitLoad(false)
    }
  }, [dataUser])

  useEffect(() => {
    const data = dataUserAva && dataUserAva.setUserAva
    if (data) {
      dispatch({
        type: SET_TOAST,
        payload: data,
      })
      getUser({ variables: { userId: user.id } })
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

  const handleFlipForm = () => {
    if (toggleForm) {
      refreshForm()
    }
    setToggleForm((prev) => !prev)
  }

  const userData = isMyProfile ? user : dataUser?.getUser || user
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

  const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const [
      firstname,
      lastname,
      middlename,
      email,
      phone,
      address,
      password,
    ] = form

    updateUserData({
      variables: {
        firstname: firstname.value.trim(),
        lastname: lastname.value.trim(),
        middlename: middlename.value.trim(),
        address: address.value.trim(),
        phone: phone.value.trim(),
        email: email.value.trim(),
        password: password.value.trim(),
      },
    })
  }

  const handleRefreshForm = () => {
    refreshForm()
  }

  const fields = form.map((field) => {
    return (
      <Field
        isImportant={field.important}
        field={field}
        change={setForm}
        key={field.param}
      />
    )
  })

  return (
    <div className='container'>
      <Title
        title={isMyProfile ? "Особистий кабінет" : "Профіль користувача"}
        path='/profile'
      />
      <div className='wrapper'>
        {initLoad ? (
          <Loader />
        ) : (
          <div className={styles.user}>
            <div className={styles.user__preview}>
              <button
                className={styles.user__btn_lightbox}
                onClick={handlePopupLightBox}
              >
                <LoaderData load={loadUserAva} />
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
                    Icon={!userData.ava ? RiImageAddFill : BsArrowRepeat}
                    exClass={stylesBtn.btn_tab_glass}
                    change={handleModImage}
                  />
                  {userData.ava && (
                    <ButtonTab
                      exClass={stylesBtn.btn_tab_glass}
                      Icon={BsTrash}
                      click={handleDeleteImage}
                    />
                  )}
                </div>
              )}
            </div>
            <div className={styles.user__info}>
              {!!token.length && (
                <ButtonTab
                  exClass={`${styles.user__btn_flip} ${
                    toggleForm && styles.user__btn_flip__disappear
                  }`}
                  Icon={BsPencilSquare}
                  click={handleFlipForm}
                />
              )}
              <div
                className={`${styles.user__section} ${
                  styles.user__section_content
                } ${!toggleForm && styles.user__section__open}`}
              >
                <h2 className={`title-second ${styles.user__title}`}>
                  {userData.firstname} {userData.lastname} {userData.middlename}
                </h2>
                <div>{userData.email}</div>
                <div className={styles.user__body}>
                  <div className={styles.user__info_item}>
                    <span>Телефон:</span>
                    <span>
                      {userData.phone ? (
                        userData.phone
                      ) : (
                        <span className={styles.user__plug}>Порожньо</span>
                      )}
                    </span>
                  </div>
                  <div className={styles.user__info_item}>
                    <span>Адреса:</span>
                    <span>
                      {userData.address ? (
                        userData.address
                      ) : (
                        <span className={styles.user__plug}>Порожньо</span>
                      )}
                    </span>
                  </div>
                  <div className={styles.user__info_item}>
                    <span>Останнє оновлення:</span>
                    <span>{convertDate(userData.date)}</span>
                  </div>
                </div>
              </div>
              <div
                className={`${styles.user__section} ${
                  toggleForm && styles.user__section__open
                }`}
              >
                <div className={stylesForm.form__title}>
                  {toggleForm && (
                    <ButtonTab
                      Icon={BsArrowLeft}
                      click={handleFlipForm}
                      exClass={stylesForm.form__btn_back}
                    />
                  )}
                  <div className={stylesForm.form__title_text}>
                    Редагування даних користувача
                  </div>
                </div>
                <form
                  className={stylesForm.form__container_fields}
                  onSubmit={handleSubmitForm}
                >
                  <LoaderData load={loadUserData} />
                  <div
                    className={`${stylesForm.form__fields} ${stylesForm.form__fields_grid}`}
                  >
                    {fields}
                    <div className={styles.user__form_btns}>
                      <Button
                        exClass={stylesBtn.btn_simple}
                        Icon={BsArrowClockwise}
                        click={handleRefreshForm}
                        type='button'
                      />
                      <Button
                        title='Застосувати зміни'
                        exClass={stylesBtn.btn_primary}
                        Icon={BsPencil}
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
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

export default Profile
