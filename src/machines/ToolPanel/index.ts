import { Machine, MachineConfig, interpret } from 'xstate'

export enum ToolPanelMachineEvents {
  ShowDefinition = 'SHOW_DEFINITION',
  ShowState = 'SHOW_STATE',
}

interface ToolPanelMachineStateSchema {
  states: {
    definition: {}
    state: {}
  }
}

type ToolPanelMachineEvent =
  | { type: ToolPanelMachineEvents.ShowDefinition }
  | { type: ToolPanelMachineEvents.ShowState }

interface ToolPanelMachineContext {}

const toolPanelMachineConfig: MachineConfig<
  ToolPanelMachineContext,
  ToolPanelMachineStateSchema,
  ToolPanelMachineEvent
> = {
  id: 'toolPanel',
  context: {},
  initial: 'definition',
  states: {
    definition: {
      on: {
        [ToolPanelMachineEvents.ShowState]: 'state',
      },
    },
    state: {
      on: {
        [ToolPanelMachineEvents.ShowDefinition]: 'definition',
      },
    },
  },
}

export const ToolPanelMachine = Machine<
  ToolPanelMachineContext,
  ToolPanelMachineStateSchema,
  ToolPanelMachineEvent
>(toolPanelMachineConfig)

export const toolPanelMachineService = interpret(ToolPanelMachine).start()
