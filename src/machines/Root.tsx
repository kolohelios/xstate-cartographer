import * as React from 'react'
import {
  interpret,
  Machine,
  assign,
  StateNode,
  MachineConfig,
  MachineOptions,
} from 'xstate'
import { toMachine } from 'src/lib/utils'

import * as rawText from '../sampleMachines/defaultMachine.js.txt'
const defaultMachine = rawText.default

enum RootMachineEvents {
  UpdateCode = 'UPDATE_CODE',
}

interface RootMachineStateSchema {
  states: {
    loading: {}
    ready: {}
    checkCode: {}
    valid: {}
    invalid: {}
  }
}

type RootMachineEvent = { type: RootMachineEvents.UpdateCode; data: string }

interface RootMachineContext {
  editorCode: string
  machineCode: string
}
const getMachines = () =>
  // this isn't asynchronous (yet), but it lets us use onDone/onError
  new Promise((fulfilled, rejected) => {
    try {
      const serializedMachines = localStorage.getItem('machines')
      const machines = JSON.parse(serializedMachines || `["${defaultMachine}"]`)
      fulfilled(machines[0])
    } catch (error) {
      rejected(error)
    }
  })

const checkCode = (context: RootMachineContext, event: any) =>
  // this isn't asynchronous, and probably never will be, but it lets us use onDone/onError
  new Promise((fulfilled, rejected) => {
    try {
      const isEmpty = event.data === ''
      if (isEmpty) {
        rejected('isEmpty')
      }
      const isMachine = toMachine(event.data) instanceof StateNode
      if (isMachine) {
        fulfilled('isValid')
      } else {
        rejected('isNotValidMachine')
      }
    } catch (error) {
      rejected('isNotValidJavaScriptOrTypeScript')
    }
  })

const rootMachineConfig: MachineConfig<
  RootMachineContext,
  RootMachineStateSchema,
  RootMachineEvent
> = {
  id: 'app',
  context: {
    editorCode: '',
    machineCode: '',
  },
  initial: 'loading',
  states: {
    loading: {
      invoke: {
        src: 'getMachines',
        onDone: {
          target: 'ready',
          actions: [
            assign({
              editorCode: (context: RootMachineContext, event: any) =>
                event.data,
              machineCode: (context: RootMachineContext, event: any) =>
                event.data,
            }),
          ],
        },
        onError: {
          target: 'ready',
          actions: [
            assign({
              editorCode: () => defaultMachine,
              machineCode: () => defaultMachine,
            }),
          ],
        },
      },
    },
    ready: {
      on: {
        UPDATE_CODE: {
          target: 'checkCode',
          actions: [
            assign({
              editorCode: (
                context: RootMachineContext,
                // TODO HACK we need typing for events where we can pass it a specific type of event so we don't use any here
                event: any
              ) => {
                console.log(context, event)
                return event.data
              },
            }),
          ],
        },
      },
    },
    checkCode: {
      invoke: {
        src: 'checkCode',
        onDone: 'valid',
        onError: {
          target: 'ready',
          actions: [
            (context: RootMachineContext, event: any) => {
              console.log(context, event)
            },
          ],
        },
      },
    },
    valid: {
      on: {
        '': {
          target: 'ready',
          actions: [
            assign({ machineCode: (context: any) => context.editorCode }),
          ],
        },
      },
    },
    invalid: {},
  },
}

const rootMachineOptions: MachineOptions<
  RootMachineContext,
  RootMachineEvent
> = {
  services: {
    getMachines,
    checkCode,
  },
}

export const RootMachine = Machine<
  RootMachineContext,
  RootMachineStateSchema,
  RootMachineEvent
>(rootMachineConfig, rootMachineOptions)

const rootMachineService = interpret(RootMachine).start()

export const updateCode = (updatedCode: string) =>
  rootMachineService.send({
    type: RootMachineEvents.UpdateCode,
    data: updatedCode,
  })

export const RootContext = React.createContext(RootMachine.initialState.context)

interface Props {
  children: React.ReactNode
}

export const RootProvider = (props: Props) => {
  const [state, setState] = React.useState(RootMachine.initialState.context)
  rootMachineService.onTransition(newState => {
    setState(newState.context)
  })

  return (
    <RootContext.Provider value={state}>{props.children}</RootContext.Provider>
  )
}
