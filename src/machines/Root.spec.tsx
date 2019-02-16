import { RootMachine } from './Root'
import { interpret } from 'xstate'

jest.mock(
  'src/sampleMachines/defaultMachine.js.txt',
  () => 'mocked default code'
)

// TODO check machineCode values in tests
const testSuccessfulRootMachine = RootMachine.withConfig({
  services: {
    getMachines: () =>
      new Promise((fulfilled, rejected) => {
        fulfilled('some code')
      }),
  },
})

const testFailedRootMachine = RootMachine.withConfig({
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
          done()
        }
      })
      .start()
  })
})
