import * as React from 'react'
import AceEditor from 'react-ace'
import 'brace/theme/monokai'
import 'brace/mode/typescript'
import { RootConsumer, updateCode } from 'src/machines/Root'

export const Editor = () => {
  return (
    <RootConsumer>
      {({ code }) => (
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
      )}
    </RootConsumer>
  )
}
