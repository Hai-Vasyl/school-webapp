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
import { BsInfoCircle, BsKanban, BsPeople } from "react-icons/bs"
import { FaRegCalendarAlt } from "react-icons/fa"
import { FiPhoneCall } from "react-icons/fi"
import { BiUserCircle } from "react-icons/bi"

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

  return (
    <div className={`wrapper ${styles.module_about}`}>
      <div className={styles.module_about__body}>
        {loadSections ? <Loader /> : sectionsJSX}
      </div>
      <div className={styles.module_about__sidebar}>
        <h3 className={styles.module_about__title}>Швидкі посилання</h3>
        <Link className={styles.module_about__link} to='/about'>
          <BsInfoCircle className={styles.module_about__link_icon} />
          <span>Про школу</span>
        </Link>
        <Link className={styles.module_about__link} to='/team'>
          <BsPeople className={styles.module_about__link_icon} />
          <span>Команда</span>
        </Link>
        <Link className={styles.module_about__link} to='/projects'>
          <BsKanban className={styles.module_about__link_icon} />
          <span>Проекти</span>
        </Link>
        <Link className={styles.module_about__link} to='/schedule'>
          <FaRegCalendarAlt className={styles.module_about__link_icon} />
          <span>Розклад занять</span>
        </Link>
        <Link className={styles.module_about__link} to='/contacts'>
          <FiPhoneCall className={styles.module_about__link_icon} />
          <span>Контакти</span>
        </Link>
        <button
          className={styles.module_about__link}
          onClick={handleRedirectProfile}
        >
          <BiUserCircle className={styles.module_about__link_icon} />
          <span>Мій кабінет</span>
        </button>
      </div>
    </div>
  )
}

export default AboutModule
