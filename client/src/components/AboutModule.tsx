import React from "react"
import { useQuery } from "@apollo/client"
import { GET_PAGE_SECTIONS } from "../fetching/queries"
import SectionAbout from "./SectionAbout"
import PageSection from "./PageSection"
import { useSelector } from "react-redux"
import { RootStore } from "../redux/store"
import { access } from "../modules/accessModifiers"
import Loader from "./Loader"
// @ts-ignore
import styles from "../styles/pages.module"

const AboutModule: React.FC = () => {
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

  const section = dataSections ? dataSections.getPageSections.items[0] : {}
  console.log({ section })
  return (
    <div className={`wrapper-text ${styles.module_about}`}>
      {loadSections ? (
        <Loader />
      ) : (
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
      )}
    </div>
  )
}

export default AboutModule
