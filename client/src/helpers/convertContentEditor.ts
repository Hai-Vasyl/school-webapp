import HTMLparse from "html-react-parser"

export const convertContent = (content: string) => {
  return (
    content &&
    HTMLparse(
      content
        .replaceAll("oembed", "iframe frameBorder='0'")
        .replaceAll("url", "src") || ""
    )
  )
}
