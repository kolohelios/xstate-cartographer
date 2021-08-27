import * as React from 'react'
import { StateChartWrapper } from './components/StateChart'
import { Layout } from './components/Layout'
import { rootMachineService } from './machines/Root'

rootMachineService.start()

export const App = () => (
	<Layout>
		<StateChartWrapper height={'calc(100vh - 70px)'} />
	</Layout>
)
