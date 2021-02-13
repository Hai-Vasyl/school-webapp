import React, { useEffect, useState } from "react"
// import { useDispatch } from "react-redux"
import { GET_PAGE, GET_PAGE_SECTIONS } from "../fetching/queries"
import { useQuery } from "@apollo/client"
import Title from "../components/Title"
import ButtonTab from "../components/ButtonTab"
import { BsPlus, BsX } from "react-icons/bs"
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
import ButtonMenu from "../components/ButtonMenu"
import NewsEventsModule from "../components/NewsEventsModule"

const About: React.FC = () => {
  const { pathname } = useLocation()
  const {
    auth: { user },
  } = useSelector((state: RootStore) => state)

  const [toggleFormCreate, setToggleFormCreate] = useState(false)
  const [activeSection, setActiveSection] = useState("")

  const { data: dataPage, loading: loadPage } = useQuery(GET_PAGE, {
    variables: {
      url: pathname,
    },
  })
  const {
    data: dataSections,
    loading: loadSections,
    refetch: refetchSections,
  } = useQuery(GET_PAGE_SECTIONS, {
    variables: {
      url: pathname,
    },
  })

  useEffect(() => {
    const data = dataSections && dataSections.getPageSections
    if (data) {
      setActiveSection(data[0].title)
    }
  }, [dataSections])

  const onCreate = () => {
    refetchSections()
    setToggleFormCreate(false)
  }

  const sections = dataSections && dataSections.getPageSections
  const sectionsJSX =
    sections &&
    sections.map((section: IPageSection) => {
      return (
        <PageSection
          key={section.id}
          info={section}
          isActive={section.title === activeSection}
        />
      )
    })

  const handleSetActivSection = (link: string) => {
    setActiveSection(link)
  }

  return (
    <div className='container'>
      <Title title='Про школу' />
      {((sections && sections.length > 1) ||
        user.role === access.admin.keyWord) && (
        <div className={styles.page__navbar_wrapper}>
          <div className={styles.page__navbar}>
            {sections && sections.length > 1 && (
              <ButtonMenu
                links={
                  sections
                    ? sections.map((item: IPageSection) => item.title)
                    : []
                }
                active={activeSection}
                click={handleSetActivSection}
              />
            )}
            {user.role === access.admin.keyWord && (
              <div className={styles.page__create}>
                <p>Створити розділ сторінки</p>
                <ButtonTab
                  click={() => setToggleFormCreate((prev) => !prev)}
                  Icon={toggleFormCreate ? BsX : BsPlus}
                />
              </div>
            )}
          </div>
          <div
            className={`${styles.page__form} ${
              !toggleFormCreate && styles.page__form__close
            }`}
          >
            <ModSectionForm onCreate={onCreate} />
          </div>
        </div>
      )}
      <div>{loadSections ? <Loader /> : <div>{sectionsJSX}</div>}</div>
      <NewsEventsModule isNews={true} />
    </div>
  )
}

export default About
