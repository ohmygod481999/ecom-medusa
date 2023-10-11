import {useRef} from "react"
import { RichEditorRef } from "../components/shared/RichEditor"

export const useRichEditor = () => {
  const editorRef = useRef<RichEditorRef>()

  return {editorRef}
}
