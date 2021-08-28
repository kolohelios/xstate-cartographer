import React, { createContext } from 'react'
import { StateChartWrapper } from './components/StateChart'
import { Layout } from './components/Layout'
import { useInterpret } from '@xstate/react'
import { AppMachine, AppMachineContext, AppMachineEvent } from './machines/App'
import {
	ToolPanelMachine,
	ToolPanelMachineContext,
	ToolPanelMachineStateSchema,
	ToolPanelMachineEvent,
} from './machines/ToolPanel'
import { Interpreter } from 'xstate'

interface GlobalState {
	appMachineService: Interpreter<
		AppMachineContext,
		any,
		AppMachineEvent,
		{ value: any; context: AppMachineContext }
	>
	toolPanelMachineService: Interpreter<
		ToolPanelMachineContext,
		ToolPanelMachineStateSchema,
		ToolPanelMachineEvent,
		{
			value: any
			context: ToolPanelMachineContext
		}
	>
}

export const GlobalStateContext = createContext<Partial<GlobalState>>({})

export const App = () => {
	const appMachineService = useInterpret(AppMachine)
	const toolPanelMachineService = useInterpret(ToolPanelMachine)

	return (
		<GlobalStateContext.Provider
			value={{ appMachineService, toolPanelMachineService }}>
			<Layout>
				<StateChartWrapper height={'calc(100vh - 70px)'} />
			</Layout>
		</GlobalStateContext.Provider>
	)
}
