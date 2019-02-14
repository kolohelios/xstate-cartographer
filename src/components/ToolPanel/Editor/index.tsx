import * as React from 'react'
import { useContext } from 'react'
import AceEditor from 'react-ace'
import 'brace/theme/monokai'
import 'brace/mode/typescript'
import { RootContext, updateCode } from 'src/machines/Root'

export const Editor = () => {
  const rootContext = useContext(RootContext)

  return (
    <AceEditor
      mode="typescript"
      theme="monokai"
      editorProps={{ $blockScrolling: true }}
      value={rootContext.code}
      onChange={value => updateCode(value)}
      setOptions={{ tabSize: 2 }}
      width="100%"
      height="100%"
    />
  )
}
