import * as React from 'react'
import { StateChart } from '.'
import TestRenderer from 'react-test-renderer'
import { toMachine } from 'src/lib/utils'

// mocking react-ace or we get a warning from brace/index.js:3999, "Could not load worker TypeError: URL.createObjectURL is not a function"
jest.mock('react-ace')
jest.mock('src/sampleMachines/defaultMachine.js.txt', () => {})

const simpleStateChart = `
const lightMachine = Machine({
  id: "light",
  initial: "green",
  states: {
    green: {
      on: { TIMER: "yellow" }
    },
    yellow: {
      on: { TIMER: "red" }
    },
    red: {
      on: { TIMER: "green" }
    }
  }
});
`

describe('StateChart', () => {
	it('should render', () => {
		const stateChart = TestRenderer.create(
			<StateChart machine={toMachine(simpleStateChart)} />,
		).toJSON()

		expect(stateChart).toBeDefined()
	})
})
