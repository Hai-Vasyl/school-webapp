import React, { useEffect, useState } from "react"
// import { useDispatch } from "react-redux"
import { GET_PAGE, GET_PAGE_SECTIONS } from "../fetching/queries"
import { useMutation, useQuery } from "@apollo/client"
import Title from "../components/Title"
import ButtonTab from "../components/ButtonTab"
import { BsPlus } from "react-icons/bs"
// @ts-ignore
import styles from "../styles/pages.module"
import { useLocation } from "react-router-dom"
import Loader from "../components/Loader"
import { useSelector } from "react-redux"
import { RootStore } from "../redux/store"
import { access } from "../modules/accessModifiers"
import { IPageSection } from "../interfaces"
import PageSection from "../components/PageSection"
import ModSectionForm from "../components/ModSectionForm"

const About: React.FC = () => {
  const { pathname } = useLocation()
  const {
    auth: { user },
  } = useSelector((state: RootStore) => state)

  const [toggleFormCreate, setToggleFormCreate] = useState(false)

  const { data: dataPage, loading: loadPage } = useQuery(GET_PAGE, {
    variables: {
      url: pathname,
    },
  })
  const { data: dataSections, loading: loadSections } = useQuery(
    GET_PAGE_SECTIONS,
    {
      variables: {
        url: pathname,
      },
    }
  )

  const sections =
    dataSections &&
    dataSections.getPageSections.map((section: IPageSection) => {
      return <PageSection info={section} />
    })

  return (
    <div className='container'>
      <Title title='Про школу' />
      {user.role === access.admin.keyWord && (
        <div>
          <div className={styles.create_section}>
            <div className={styles.create_section__title}>
              Створити розділ сторінки
            </div>
            <ButtonTab
              click={() => setToggleFormCreate((prev) => !prev)}
              Icon={BsPlus}
            />
          </div>

          <div
            className={`${styles.page__form} ${
              toggleFormCreate && styles.page__form__close
            }`}
          >
            <ModSectionForm />
          </div>
        </div>
      )}
      <div className='wrapper'>
        {loadSections ? <Loader /> : <div>{sections}</div>}
      </div>
    </div>
  )
}

export default About
