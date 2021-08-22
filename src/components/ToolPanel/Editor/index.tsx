import * as React from 'react'
import { useContext, useEffect } from 'react'
import AceEditor from 'react-ace'
import 'brace/theme/monokai'
import 'brace/mode/typescript'
import { AppContext, updateCode } from 'src/machines/App/provider'

export const Editor = () => {
	const appContext = useContext(AppContext)

	return (
		<AceEditor
			mode="typescript"
			theme="monokai"
			editorProps={{ $blockScrolling: true }}
			value={appContext.editorCode}
			onChange={value => updateCode(value)}
			setOptions={{ tabSize: 2 }}
			width="100%"
			height="100%"
		/>
	)
}
