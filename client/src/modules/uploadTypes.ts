import {
  BsNewspaper,
  BsCalendar,
  BsImage,
  BsReverseLayoutTextSidebarReverse,
} from "react-icons/bs"

export const types = {
  image: {
    keyWord: "image",
    label: "Зображення",
    labelSingle: "Зображення",
    Icon: BsImage,
    getLink(itemId: string) {
      return `/gallery/${itemId}`
    },
  },
  news: {
    keyWord: "news",
    label: "Новини",
    labelSingle: "Новина",
    Icon: BsNewspaper,
    getLink(itemId: string) {
      return `/news/${itemId}`
    },
  },
  event: {
    keyWord: "event",
    label: "Події",
    labelSingle: "Подія",
    Icon: BsCalendar,
    getLink(itemId: string) {
      return `/events/${itemId}`
    },
  },
  other: {
    keyWord: "other",
    label: "Інші",
    Icon: BsReverseLayoutTextSidebarReverse,
  },
  all: {
    keyWord: "all",
    label: "Усі",
  },
}

export const getParamsByType = (type: string) => {
  switch (type) {
    case types.image.keyWord:
      return types.image
    case types.news.keyWord:
      return types.news
    case types.event.keyWord:
      return types.event
    case types.other.keyWord:
      return types.other
  }
}
