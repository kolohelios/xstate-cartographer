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
    valid: {}
    invalid: {}
  }
}

type RootMachineEvent = { type: RootMachineEvents.UpdateCode; data: string }

interface RootMachineContext {
  code: string
}
const getMachines = () =>
  new Promise((fulfilled, rejected) => {
    try {
      const serializedMachines = localStorage.getItem('machines')
      const machines = JSON.parse(serializedMachines || `["${defaultMachine}"]`)
      fulfilled(machines[0])
    } catch (error) {
      rejected(error)
    }
  })

const rootMachineConfig: MachineConfig<
  RootMachineContext,
  RootMachineStateSchema,
  RootMachineEvent
> = {
  id: 'app',
  context: {
    code: '',
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
              code: (context: RootMachineContext, event: any) => event.data,
            }),
          ],
        },
        onError: {
          target: 'ready',
          actions: [
            assign({
              code: () => defaultMachine,
            }),
          ],
        },
      },
    },
    ready: {
      on: {
        UPDATE_CODE: {
          actions: [
            assign({
              code: (
                context: RootMachineContext,
                // TODO HACK we need typing for events where we can pass it a specific type of event so we don't use any here
                event: any
              ) => {
                console.log(context, event)
                try {
                  const isEmpty = event.data === ''
                  if (isEmpty) {
                    console.info('is empty')
                    return defaultMachine
                  }
                  const isMachine = toMachine(event.data) instanceof StateNode
                  if (isMachine) {
                    console.info('is a valid machine')
                    return event.data
                  } else {
                    console.info('is not a valid machine')
                    return defaultMachine
                  }
                } catch (error) {
                  console.info('invalid JavaScript or TypeScript')
                  return defaultMachine
                }
              },
            }),
          ],
        },
      },
    },
    valid: {},
    invalid: {},
  },
}

const rootMachineOptions: MachineOptions<
  RootMachineContext,
  RootMachineEvent
> = {
  services: {
    getMachines,
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
