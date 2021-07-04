export interface IAuthErrors {
  [key: string]: { value: string; msg: string[] }
}

export interface IRoute {
  path: string
  exact?: boolean
  Component: any
}

export interface ILink {
  to?: string
  exact?: boolean
  title: any
  extraLinks?: any
}

export interface IOwner {
  ava: string
  email: string
  id: string
  color: string
  firstname: string
  lastname: string
  role: string
}

export interface IOption {
  label: string
  value: string
}

export interface IField {
  param: string
  type?: string
  value?: any
  title: string
  msg?: string
  options?: IOption[]
  isImportant?: boolean
}

export interface IToast {
  type: string
  message: string
}

export interface IImage {
  id: string
  date: string
  location: string
  type: string
  owner: {
    id: string
  }
}

export interface IImageDetailed {
  id: string
  owner: {
    id: string
    email: string
    ava: string
    color: string
    firstname: string
    lastname: string
    role: string
  }
  date: string
  location: string
  content: string
  type: string
  key: string
  hashtags: string
  description: string
  format: string
}

export interface INewsEvent {
  id: string
  title: string
  date: string
  category: string
  dateEvent: string
  links: {
    link: string
    label: string
  }[]
  preview: {
    id: string
    location: string
  }
}

export interface INewsEventShort {
  id: string
  title: string
  date: string
  category: string
  dateEvent: string
  type: string
  preview: {
    id: string
    location: string
  }
}

export interface INewsEventDetailed {
  id: string
  title: string
  content: string
  type: string
  owner: {
    id: string
    email: string
    ava: string
    color: string
    firstname: string
    lastname: string
    role: string
  }
  date: string
  category: string
  dateEvent: string
  links: {
    link: string
    label: string
  }[]
}

export interface INewsEventSlider {
  id: string
  title: string
  content: string
  type: string
  owner: {
    id: string
    email: string
    ava: string
    color: string
    firstname: string
    lastname: string
    role: string
  }
  date: string
  preview: {
    id: string
    location: string
  }
  category: string
  dateEvent: string
  links: {
    link: string
    label: string
  }[]
}

export interface IImageSlide {
  id: string
  date: string
  location: string
  type: string
  owner: {
    id: string
  }
  hashtags?: string
  description?: string
}

export interface ISliderParams {
  isRight: boolean
  previousItem: number
  currentItem: number
}

export interface IUploadSection {
  id: string
  location: string
  content: string
  type: string
  hashtags: string
  description: string
  format: string
  owner: {
    id: string
  }
  date: string
}

export interface IPageSection {
  id: string
  page: string
  url: string
  title: string
  content: string
  priority: string
  date: string
  owner: {
    id: string
  }
  uploads: IUploadSection[]
  filters: {
    id: string
    url: string
    section: string
    keyWord: string
    value: string
  }[]
}

export interface IPageSectionShort {
  id: string
  page: string
  url: string
  title: string
  priority: string
  date: string
  owner: {
    id: string
  }
  uploads: IUploadSection[]
  filters: {
    id: string
    url: string
    section: string
    keyWord: string
    value: string
  }[]
}

export interface IPageSectionShorter {
  id: string
  page: string
  url: string
  title: string
  content: string
  date: string
}

export interface IPageSectionFilter {
  id: string
  url: string
  section: string
  keyWord: string
  value: string
}

export interface IFilter {
  keyWord: string
  value: string
}
