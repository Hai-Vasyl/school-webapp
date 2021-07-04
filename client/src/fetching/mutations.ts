import { gql } from "@apollo/client"

export const SET_PAGE_IMAGE = gql`
  mutation SET_PAGE_IMAGE($url: String!, $image: Upload, $deleting: Boolean!) {
    setPageImage(url: $url, image: $image, deleting: $deleting) {
      message
      type
    }
  }
`

export const UPDATE_USER_DATA = gql`
  mutation UPDATE_USER_DATA(
    $firstname: String!
    $lastname: String!
    $middlename: String
    $address: String
    $phone: String
    $email: String!
    $password: String
  ) {
    updateUserData(
      firstname: $firstname
      lastname: $lastname
      middlename: $middlename
      address: $address
      phone: $phone
      email: $email
      password: $password
    ) {
      message
      type
    }
  }
`

export const SET_USER_AVA = gql`
  mutation SET_USER_AVA($image: Upload, $deleting: Boolean!) {
    setUserAva(image: $image, deleting: $deleting) {
      message
      type
    }
  }
`

export const CREATE_UPLOAD = gql`
  mutation CREATE_UPLOAD(
    $hashtags: String
    $description: String
    $upload: Upload
    $content: ID
    $type: String!
    $mimetype: String
  ) {
    createUpload(
      hashtags: $hashtags
      description: $description
      upload: $upload
      content: $content
      type: $type
      mimetype: $mimetype
    ) {
      message
      type
    }
  }
`

export const EDIT_UPLOAD = gql`
  mutation EDIT_UPLOAD(
    $imageId: ID!
    $hashtags: String
    $description: String
    $upload: Upload
  ) {
    editUpload(
      imageId: $imageId
      hashtags: $hashtags
      description: $description
      upload: $upload
    ) {
      message
      type
    }
  }
`

export const DELETE_UPLOAD = gql`
  mutation DELETE_UPLOAD($imageId: ID!) {
    deleteUpload(imageId: $imageId) {
      message
      type
    }
  }
`

export const CREATE_NEWS_EVENT = gql`
  mutation CREATE_NEWS_EVENT(
    $title: String!
    $content: String!
    $type: String!
    $category: String!
    $dateEvent: String!
    $links: [InputLink]
  ) {
    createNewsEvent(
      title: $title
      content: $content
      type: $type
      category: $category
      dateEvent: $dateEvent
      links: $links
    )
  }
`

export const EDIT_NEWS_EVENT = gql`
  mutation EDIT_NEWS_EVENT(
    $contentId: ID!
    $title: String!
    $content: String!
    $type: String!
    $category: String!
    $dateEvent: String!
    $links: [InputLink]
  ) {
    editNewsEvent(
      contentId: $contentId
      title: $title
      content: $content
      type: $type
      category: $category
      dateEvent: $dateEvent
      links: $links
    ) {
      message
      type
    }
  }
`

export const DELETE_NEWS_EVENT = gql`
  mutation DELETE_NEWS_EVENT($contentId: ID!) {
    deleteNewsEvent(contentId: $contentId) {
      message
      type
    }
  }
`

export const CREATE_PAGE_SECTION = gql`
  mutation CREATE_PAGE_SECTION(
    $url: String!
    $title: String!
    $content: String!
    $priority: Int!
    $filters: [InputFilter]!
    $optContent: Boolean
  ) {
    createPageSection(
      url: $url
      title: $title
      content: $content
      priority: $priority
      filters: $filters
      optContent: $optContent
    ) {
      message
      type
    }
  }
`

export const EDIT_PAGE_SECTION = gql`
  mutation EDIT_PAGE_SECTION(
    $sectionId: ID!
    $title: String!
    $content: String!
    $priority: Int!
    $filters: [InputFilterEdit]!
    $optContent: Boolean
  ) {
    editPageSection(
      sectionId: $sectionId
      title: $title
      content: $content
      priority: $priority
      filters: $filters
      optContent: $optContent
    ) {
      message
      type
    }
  }
`

export const DELETE_PAGE_SECTION = gql`
  mutation DELETE_PAGE_SECTION($sectionId: ID!) {
    deletePageSection(sectionId: $sectionId) {
      message
      type
    }
  }
`

export const SEND_EMAIL = gql`
  mutation SEND_EMAIL(
    $firstname: String!
    $lastname: String!
    $email: String!
    $message: String!
  ) {
    sendEmail(
      firstname: $firstname
      lastname: $lastname
      email: $email
      message: $message
    ) {
      message
      type
    }
  }
`
