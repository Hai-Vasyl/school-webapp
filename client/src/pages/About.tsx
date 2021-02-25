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
import NewsEventsModule from "../components/NewsEventsModule"
import NavbarPage from "../components/NavbarPage"
import SectionAbout from "../components/SectionAbout"

const About: React.FC = () => {
  const [activeSection, setActiveSection] = useState("")

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

  const handleRefetchAll = () => {
    refetchSections()
  }

  const handleCreate = () => {
    handleRefetchAll()
    setToggleCreate((prev) => !prev)
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
          <SectionAbout
            info={section}
            onCreate={refetchSections}
            onEdit={refetchSections}
            onRemove={refetchSections}
            isOwnerContent={user.role === access.admin.keyWord}
          />
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
