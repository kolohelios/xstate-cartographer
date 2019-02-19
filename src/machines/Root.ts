import { interpret, Machine, MachineConfig, MachineOptions } from 'xstate'
import { ToolPanelMachine } from './ToolPanel'
import { AppMachine } from './App'

interface RootMachineContext {}

interface RootMachineStateSchema {
  states: {
    toolPanel: {}
    app: {}
  }
}

type RootMachineEvent = { type: 'none' }

const rootMachineConfig: MachineConfig<
  RootMachineContext,
  RootMachineStateSchema,
  RootMachineEvent
> = {
  id: 'root',
  type: 'parallel',
  states: {
    toolPanel: {
      invoke: {
        src: 'toolPanelMachine',
      },
    },
    app: {
      invoke: {
        src: 'appMachine',
      },
    },
  },
}

const rootMachineOptions: MachineOptions<
  RootMachineContext,
  RootMachineEvent
> = {
  services: {
    appMachine: AppMachine,
    toolPanelMachine: ToolPanelMachine,
  },
}

export const RootMachine = Machine<
  RootMachineContext,
  RootMachineStateSchema,
  RootMachineEvent
>(rootMachineConfig, rootMachineOptions)

export const rootMachineService = interpret(RootMachine)
