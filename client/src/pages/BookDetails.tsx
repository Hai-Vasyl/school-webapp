import React, { useEffect, useState } from "react"
import PageSection from "../components/PageSection"
import { useQuery } from "@apollo/client"
import { GET_PAGE_SECTION, GET_PAGE_FILTERS } from "../fetching/queries"
import { useParams, useHistory } from "react-router-dom"
import Loader from "../components/Loader"
import { IField, IOption, IPageSectionFilter } from "../interfaces"
import Title from "../components/Title"
import SectionInfo from "../components/SectionInfo"
import useFindFilter from "../hooks/useFindFilter"
import BooksModule from "../components/BooksModule"

const BookDetails: React.FC = () => {
  const { bookId }: any = useParams()
  const history = useHistory()
  const { getFormFilterParams } = useFindFilter()

  const [filters, setFilters] = useState<IField[]>([
    {
      param: "genre",
      title: "Жанр",
      options: [],
    },
    {
      param: "group",
      title: "Клас",
      options: [],
    },
  ])

  const { data: dataFilters, refetch: refetchFilters } = useQuery(
    GET_PAGE_FILTERS,
    {
      variables: {
        url: "/library",
      },
    }
  )

  const {
    data: dataSection,
    loading: loadSection,
    refetch: refetchSection,
  } = useQuery(GET_PAGE_SECTION, {
    variables: {
      sectionId: bookId,
    },
  })

  useEffect(() => {
    let filters = dataFilters && dataFilters.getFilters

    const setOptions = (setForm: any, genres: IOption[], groups: IOption[]) => {
      setForm((prev: IField[]) =>
        prev.map((field: IField) => {
          if (field.param === "genre") {
            return {
              ...field,
              options: genres,
            }
          } else if (field.param === "group") {
            return {
              ...field,
              options: groups,
            }
          }
          return field
        })
      )
    }

    if (filters && filters.length) {
      let groups: string[] = []
      let genres: string[] = []

      for (let i = 0; i < filters.length; i++) {
        if (
          filters[i].keyWord === "genre" &&
          !genres.includes(filters[i].value)
        ) {
          genres.push(filters[i].value)
        } else if (
          filters[i].keyWord === "group" &&
          !groups.includes(filters[i].value)
        ) {
          groups.push(filters[i].value)
        }
      }

      const genreOptions = genres.map((item) => ({ label: item, value: item }))
      const groupOptions = groups.map((item) => ({ label: item, value: item }))
      setOptions(setFilters, genreOptions, groupOptions)
    }
  }, [dataFilters])

  const handleRefetchAll = () => {
    refetchFilters()
    refetchSection()
  }

  const handleDeleteSection = () => {
    handleRefetchAll()
    history.push("/library")
  }

  const info = dataSection && dataSection.getPageSection

  return (
    <div className='container'>
      <Title title='Бібліотека' />
      <div className='wrapper-clear'>
        {loadSection ? (
          <Loader />
        ) : (
          <PageSection
            key={info.id}
            info={info}
            filters={info.filters.map(
              (filter: IPageSectionFilter, index: string) => {
                const filterParams = getFormFilterParams(
                  filters,
                  filter.keyWord
                )
                return {
                  keyWord: filter.keyWord,
                  value: filter.value,
                  options: filterParams.options,
                  title: filterParams.title,
                }
              }
            )}
            onDelete={handleDeleteSection}
            onEdit={handleRefetchAll}
          >
            <SectionInfo
              onEdit={refetchSection}
              onRemove={refetchSection}
              onCreate={refetchSection}
              info={info}
              subtitle={{
                keyWord: "group",
                title: "Клас",
                text: `/library?page=1&group=`,
              }}
              link={{
                keyWord: "genre",
                title: "Жанр",
                text: `/library?page=1&genre=`,
              }}
            />
          </PageSection>
        )}
      </div>
      <BooksModule exceptId={info && info.id} />
    </div>
  )
}

export default BookDetails
