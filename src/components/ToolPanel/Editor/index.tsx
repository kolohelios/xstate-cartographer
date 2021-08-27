import * as React from 'react'
import { useContext, useEffect } from 'react'
import AceEditor from 'react-ace'
import 'brace/theme/monokai'
import 'brace/mode/typescript'
import { useMachine } from '@xstate/react'
import { AppMachine, AppMachineEvents } from 'src/machines/App'

export const Editor = () => {
	const [state, send] = useMachine(AppMachine)

	const updateCode = (value: string) => send(AppMachineEvents.UpdateCode, { value })

	return (
		<AceEditor
			mode="typescript"
			theme="monokai"
			editorProps={{ $blockScrolling: true }}
			value={state.context.editorCode}
			onChange={value => updateCode(value)}
			setOptions={{ tabSize: 2 }}
			width="100%"
			height="100%"
		/>
	)
}
