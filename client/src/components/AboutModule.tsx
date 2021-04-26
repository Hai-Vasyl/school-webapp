import React from "react"
import { useQuery } from "@apollo/client"
import { GET_PAGE_SECTIONS } from "../fetching/queries"
import SectionAbout from "./SectionAbout"
import PageSection from "./PageSection"
import { useSelector, useDispatch } from "react-redux"
import { RootStore } from "../redux/store"
import { access } from "../modules/accessModifiers"
import Loader from "./Loader"
// @ts-ignore
import styles from "../styles/pages.module"
import { IPageSection } from "../interfaces"
import { Link, useHistory } from "react-router-dom"
import { AUTHFORM_TOGGLE } from "../redux/toggle/toggleTypes"
import {
  BsInfoCircle,
  BsKanban,
  BsPeople,
  BsGear,
  BsCompass,
} from "react-icons/bs"
import { FaRegCalendarAlt } from "react-icons/fa"
import { FiPhoneCall } from "react-icons/fi"
import { BiUserCircle } from "react-icons/bi"
import SideNavbar from "./SideNavbar"

const AboutModule: React.FC = () => {
  const history = useHistory()
  const dispatch = useDispatch()
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
      to: 1,
      url: "/about",
    },
  })

  const handleRedirectProfile = () => {
    if (user.id) {
      history.push(`/profile/${user.id}`)
    } else {
      dispatch({ type: AUTHFORM_TOGGLE })
    }
  }

  const sections = dataSections ? dataSections.getPageSections.items : []

  const sectionsJSX = sections.map((section: IPageSection) => {
    return (
      <PageSection
        key={section.id}
        info={section}
        filters={[]}
        onDelete={refetchSections}
        onEdit={refetchSections}
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

  const links = [
    { to: "/about", title: "Про школу", Icon: BsInfoCircle },
    { to: "/discover", title: "Шукати", Icon: BsCompass },
    { to: "/team", title: "Команда", Icon: BsPeople },
    { to: "/schedule", title: "Розклад занять", Icon: FaRegCalendarAlt },
    { to: "/management", title: "Управління", Icon: BsGear },
    { to: "/contacts", title: "Контакти", Icon: FiPhoneCall },
    { to: "/projects", title: "Проекти", Icon: BsKanban },
    {
      to: "profile",
      title: "Мій кабінет",
      Icon: BiUserCircle,
      click: handleRedirectProfile,
    },
  ]

  const linksTiles = links.map((link) => {
    if (link.to === "profile") {
      return (
        <button key={link.to} className={styles.link_tile} onClick={link.click}>
          <div className={styles.link_tile__icon}>
            <link.Icon />
          </div>
          <span className={styles.link_tile__title}>{link.title}</span>
        </button>
      )
    }
    return (
      <Link key={link.to} className={styles.link_tile} to={link.to}>
        <div className={styles.link_tile__icon}>
          <link.Icon />
        </div>
        <span className={styles.link_tile__title}>{link.title}</span>
      </Link>
    )
  })

  const linksJSX = links.map((link) => {
    if (link.to === "profile") {
      return (
        <button
          key={link.to}
          className={`${styles.side_link} ${styles.module_about__link}`}
          onClick={link.click}
        >
          <div className={styles.module_about__link_icon}>
            <link.Icon />
          </div>
          <span>{link.title}</span>
        </button>
      )
    }
    return (
      <Link
        key={link.to}
        className={`${styles.side_link} ${styles.module_about__link}`}
        to={link.to}
      >
        <div className={styles.module_about__link_icon}>
          <link.Icon />
        </div>
        <span>{link.title}</span>
      </Link>
    )
  })

  return (
    <>
      <div className={styles.module_about__tiles}>{linksTiles}</div>
      <div className={`wrapper ${styles.module_about}`}>
        {loadSections ? (
          <Loader />
        ) : sections.length ? (
          <div className={styles.page_wrapper_flex}>
            <SideNavbar exClass={styles.page_wrapper_flex__sidebar}>
              {linksJSX}
            </SideNavbar>
            <div className={styles.page_wrapper_flex__content}>
              {sectionsJSX}
            </div>
          </div>
        ) : (
          <div className='plug-text'>Порожньо</div>
        )}
      </div>
    </>
  )
}

export default AboutModule
