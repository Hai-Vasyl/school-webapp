import React, { useEffect, useState, useRef } from "react"
import { GET_PAGE_SECTIONS } from "../fetching/queries"
import { useQuery } from "@apollo/client"
import Title from "./Title"
// @ts-ignore
import styles from "../styles/pages.module"
import { useLocation } from "react-router-dom"
import Loader from "./Loader"
import { useSelector } from "react-redux"
import { RootStore } from "../redux/store"
import { access } from "../modules/accessModifiers"
import { INewsEventSlider, IPageSection } from "../interfaces"
import PageSection from "./PageSection"
import ModSectionForm from "./ModSectionForm"
import NewsEventsModule from "./NewsEventsModule"
import NavbarPage from "./NavbarPage"
import SectionAbout from "./SectionAbout"
import SideNavbar from "./SideNavbar"
import NewsEventsModuleContainer from "./NewsEventsModuleContainer"
import FooterModule from "./FooterModule"
import DesignLayout_1 from "./DesignLayout_1"

interface ILayoutTabsProps {
  imgsPrivate?: boolean
  title: string
}

const LayoutTabs: React.FC<ILayoutTabsProps> = ({
  imgsPrivate = false,
  title,
}) => {
  const { pathname, search } = useLocation()
  const params = new URLSearchParams(search)
  const section = params.get("section")

  const [activeSection, setActiveSection] = useState("")
  const [initLoad, setInitLoad] = useState(true)
  const anchor = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    anchor.current?.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [activeSection])

  useEffect(() => {
    const data = dataSections && dataSections.getPageSections
    if (data && data.items.length && initLoad) {
      if (!section) {
        setActiveSection(data.items[0].id)
      } else {
        setActiveSection(section)
      }
      setInitLoad(false)
    }
  }, [dataSections, section])

  const handleRefetchAll = () => {
    refetchSections()
  }

  const handleCreate = () => {
    handleRefetchAll()
    setToggleCreate((prev) => !prev)
  }

  const sections = dataSections ? dataSections.getPageSections.items : []
  const links = sections
    ? sections.map((item: IPageSection) => ({ title: item.title, id: item.id }))
    : []

  const sectionsJSX =
    sections &&
    sections.map((section: IPageSection) => {
      return (
        <div
          className={
            activeSection === section.id
              ? styles.section__active
              : styles.section__close
          }
          key={section.id}
        >
          <PageSection
            info={section}
            filters={[]}
            onDelete={handleRefetchAll}
            onEdit={handleRefetchAll}
            isOptContent
          >
            <SectionAbout
              info={section}
              onCreate={refetchSections}
              onEdit={refetchSections}
              onRemove={refetchSections}
              privateType={imgsPrivate}
              isOwnerContent={user.role === access.admin.keyWord}
            />
          </PageSection>
        </div>
      )
    })

  return (
    <div className='container'>
      <div ref={anchor}></div>
      <Title title={title} />
      <NavbarPage
        sectionLinks={links}
        setActiveSection={setActiveSection}
        activeSection={activeSection}
        onCreate={() => setToggleCreate((prev) => !prev)}
        toggle={toggleCreate}
      />
      {user.role === access.admin.keyWord && toggleCreate && (
        <ModSectionForm onCreate={handleCreate} isOptContent />
      )}
      <DesignLayout_1>
        <div className='wrapper'>
          {loadSections ? (
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
          )}
        </div>
      </DesignLayout_1>
      <NewsEventsModuleContainer isNews={true}>
        {(items: INewsEventSlider[], loading: boolean, isNews: boolean) => (
          <NewsEventsModule items={items} loading={loading} isNews={isNews} />
        )}
      </NewsEventsModuleContainer>
      <FooterModule />
    </div>
  )
}

export default LayoutTabs
