import * as React from 'react'
import { StateChartNode } from '.'
import TestRenderer from 'react-test-renderer'
import { Machine, interpret } from 'xstate'

const simpleMachine = Machine({
	id: 'light',
	initial: 'green',
	states: {
		green: {
			on: { TIMER: 'yellow' },
		},
		yellow: {
			on: { TIMER: 'red' },
		},
		red: {
			on: { TIMER: 'green' },
		},
	},
})

const simpleMachineService = interpret(simpleMachine).start().state

describe('StateChartNode', () => {
	it('should render', () => {
		const stateChartNode = TestRenderer.create(
			<StateChartNode
				stateNode={simpleMachine}
				current={simpleMachineService}
				onEvent={() => null}
				onPreEvent={() => null}
				onExitPreEvent={() => null}
				toggled={false}
				onToggle={() => null}
				toggledStates={{}}
			/>,
		).toJSON()

		expect(stateChartNode).toBeDefined()
	})
})
