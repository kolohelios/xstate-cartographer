import { AppMachine } from '.'
import { interpret } from 'xstate'

jest.mock(
	'src/sampleMachines/defaultMachine.js.txt',
	() => 'mocked default code',
)

// TODO check machineCode values in tests
const testSuccessfulRootMachine = AppMachine.withConfig({
	services: {
		getMachines: () =>
			new Promise((fulfilled, rejected) => {
				fulfilled('some code')
			}),
	},
})

const testFailedRootMachine = AppMachine.withConfig({
	services: {
		getMachines: () =>
			new Promise((fulfilled, rejected) => {
				rejected('some error')
			}),
	},
})

describe('RootMachine', () => {
	it('should have no code while loading', done => {
		interpret(testSuccessfulRootMachine)
			.onTransition(state => {
				if (state.matches('loading')) {
					expect(state.context.editorCode).toBe('')
					expect(state.context.machineCode).toBe('')
					done()
				}
			})
			.start()
	})

	it('should have loaded code after loading success', done => {
		interpret(testSuccessfulRootMachine)
			.onTransition(state => {
				if (state.matches('ready')) {
					expect(state.context.editorCode).toBe('some code')
					expect(state.context.machineCode).toBe('some code')
					done()
				}
			})
			.start()
	})

	it('should have default code after loading failure', done => {
		interpret(testFailedRootMachine)
			.onTransition(state => {
				if (state.matches('ready')) {
					expect(state.context.editorCode).toBe('mocked default code')
					expect(state.context.machineCode).toBe('mocked default code')
					done()
				}
			})
			.start()
	})
})
