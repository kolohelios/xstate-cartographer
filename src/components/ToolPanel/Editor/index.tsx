import * as React from 'react'
import { useContext } from 'react'
import AceEditor from 'react-ace'
import 'brace/theme/monokai'
import 'brace/mode/typescript'
import { useActor } from '@xstate/react'
import { AppMachineEvents } from 'src/machines/App'
import { GlobalStateContext } from 'src/App'

export const Editor = () => {
	const globalServices = useContext(GlobalStateContext);
	const [state, send] = useActor(globalServices.appMachineService!);

	const updateCode = (value: string) => send({ type: AppMachineEvents.UpdateCode, value })

	return (
		<AceEditor
			mode="typescript"
			theme="monokai"
			editorProps={{ $blockScrolling: true }}
			value={state.context.editorCode}
			onChange={updateCode}
			setOptions={{ tabSize: 2 }}
			width="100%"
			height="100%"
		/>
	)
}
