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
import { IPageSection, IField } from "../interfaces"
import PageSection from "../components/PageSection"
import ModSectionForm from "../components/ModSectionForm"
import ButtonMenu from "../components/ButtonMenu"
import NewsEventsModule from "../components/NewsEventsModule"
import NavbarPage from "../components/NavbarPage"
import SectionAbout from "../components/SectionAbout"

const About: React.FC = () => {
  // const [toggleFormCreate, setToggleFormCreate] = useState(false)
  const [activeSection, setActiveSection] = useState("")

  // const { data: dataPage, loading: loadPage } = useQuery(GET_PAGE, {
  //   variables: {
  //     url: pathname,
  //   },
  // })

  // useEffect(() => {
  //   const data = dataSections && dataSections.getPageSections
  //   if (data) {
  //     setActiveSection(data[0].title)
  //   }
  // }, [dataSections])

  // const onCreate = () => {
  //   refetchSections()
  //   setToggleFormCreate(false)
  // }

  // const sections = dataSections && dataSections.getPageSections
  // const sectionsJSX =
  //   sections &&
  //   sections.map((section: IPageSection) => {
  //     return (
  //       <PageSection
  //         key={section.id}
  //         info={section}
  //         isActive={section.title === activeSection}
  //       />
  //     )
  //   })

  const handleSetActivSection = (link: string) => {
    setActiveSection(link)
  }

  const { pathname } = useLocation()

  const {
    auth: { user },
  } = useSelector((state: RootStore) => state)

  const {
    data: dataSections,
    loading: loadSections,
    refetch: refetchSections,
  } = useQuery(GET_PAGE_SECTIONS, {
    variables: {
      filters: [],
      from: 0,
      url: pathname,
    },
  })
  const [toggleCreate, setToggleCreate] = useState(false)

  const toggleCreateForm = () => {
    setToggleCreate((prev) => !prev)
  }

  const sections = dataSections ? dataSections.getPageSections.items : []

  // <ItemInfoSection
  //     key={section.id}
  //     info={section}
  //     itemLink={`${pathname}/${section.id}`}
  //     link={{
  //       keyWord: "group",
  //       title: "Клас",
  //       text: `${pathname}?page=1&group=`,
  //     }}
  //     subtitle={{
  //       keyWord: "genre",
  //       title: "Жанр",
  //       text: `${pathname}?page=1&genre=`,
  //     }}
  //   />)

  const handleRefetchAll = () => {
    refetchSections()
  }

  const handleCreate = () => {
    handleRefetchAll()
    setToggleCreate((prev) => !prev)
  }

  {
    /* <SectionPerson
    onCreate={refetchSections}
    onRemove={refetchSections}
    onEdit={refetchSections}
    info={section}
    link={{
      keyWord: "year",
      title: "Рік",
      text: `${pathname}?page=1&year=`,
    }}
    subtitle={{
      keyWord: "group",
      title: "Клас",
      text: `${pathname}?page=1&group=`,
    }}
  /> */
  }
  const sectionsJSX =
    sections &&
    sections.map((section: IPageSection) => {
      return (
        <PageSection
          key={section.id}
          info={section}
          filters={[]}
          onDelete={handleRefetchAll}
          onEdit={handleRefetchAll}
        >
          <SectionAbout info={section} />
        </PageSection>
      )
    })

  return (
    <div className='container'>
      <Title title='Про школу' />
      <NavbarPage
        sectionLinks={
          sections ? sections.map((item: IPageSection) => item.title) : []
        }
        setActiveSection={handleSetActivSection}
        onCreate={toggleCreateForm}
        toggle={toggleCreate}
      />
      {user.role === access.admin.keyWord && toggleCreate && (
        <ModSectionForm onCreate={handleCreate} />
      )}
      <div className='wrapper'>
        {loadSections ? (
          <Loader />
        ) : sections.length ? (
          <div className='wrapper-text'>{sectionsJSX}</div>
        ) : (
          <div className='plug-text'>Порожньо</div>
        )}
      </div>
      <NewsEventsModule isNews={true} />
    </div>
  )
}

export default About
