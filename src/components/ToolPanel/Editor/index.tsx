import * as React from 'react'
import AceEditor from 'react-ace'
import 'brace/theme/monokai'
import 'brace/mode/typescript'

interface Props {
  updateCode: (value: string) => void
  code: string
}

export const Editor = (props: Props) => {
  const { code, updateCode } = props

  return (
    <AceEditor
      mode="typescript"
      theme="monokai"
      editorProps={{ $blockScrolling: true }}
      value={code}
      onChange={value => updateCode(value)}
      setOptions={{ tabSize: 2 }}
      width="100%"
      height="100%"
    />
  )
}
