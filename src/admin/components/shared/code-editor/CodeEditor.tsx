import React, {useMemo} from 'react'
import Editor from '@monaco-editor/react';
import { useCodeEdit } from '../../../routes/themes/code-edit/[id]/CodeEditContext';

export const CodeEditor = (props: {}) => {
  const {files, activeFileIndex, currentFileContent, currentFileExtension} = useCodeEdit()
  
  return (
    <div>
      <Editor height="80vh" defaultLanguage="javascript" value={currentFileContent} language={currentFileExtension}/>
    </div>
  )
}
