import { toMachine } from '.'
import { Machine, StateNode } from 'xstate'

const testMachine = Machine({
	id: 'light',
	initial: 'idle',
	states: {
		idle: {},
	},
})

const testMachineJavaScriptString = `
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
const testMachineTypeScriptString = `
interface LightStateSchema {
  states: {
    green: {}
    yellow: {}
    red: {}
  }
}

const lightMachine = Machine<{}, LightStateSchema>({
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

describe('toMachine', () => {
	it('should return a StateNode when passed a Machine', () => {
		const toMachineResult = toMachine(testMachine)
		expect(toMachineResult instanceof StateNode).toBeTruthy()
	})

	it('should return a StateNode when passed a string of JavaScript code', () => {
		const toMachineResult = toMachine(testMachineJavaScriptString)
		expect(toMachineResult instanceof StateNode).toBeTruthy()
	})

	it('should return a StateNode when passed a string of TypeScript code', () => {
		const toMachineResult = toMachine(testMachineTypeScriptString)
		expect(toMachineResult instanceof StateNode).toBeTruthy()
	})
})
