import { Machine, MachineConfig } from 'xstate'

export enum ToolPanelMachineEvents {
	ShowDefinition = 'SHOW_DEFINITION',
	ShowState = 'SHOW_STATE',
	ToggleVisibility = 'TOGGLE_VISIBILITY',
}

export interface ToolPanelMachineStateSchema {
	states: {
		hidden: {}
		shown: {
			states: {
				definition: {}
				state: {}
			}
		}
	}
}

export type ToolPanelMachineEvent =
	| { type: ToolPanelMachineEvents.ShowDefinition }
	| { type: ToolPanelMachineEvents.ShowState }
	| { type: ToolPanelMachineEvents.ToggleVisibility }

export interface ToolPanelMachineContext {}

const toolPanelMachineConfig: MachineConfig<
	ToolPanelMachineContext,
	ToolPanelMachineStateSchema,
	ToolPanelMachineEvent
> = {
	id: 'toolPanel',
	context: {},
	initial: 'shown',
	states: {
		hidden: {
			on: {
				[ToolPanelMachineEvents.ToggleVisibility]: 'shown',
			},
		},
		shown: {
			initial: 'definition',
			on: {
				[ToolPanelMachineEvents.ToggleVisibility]: 'hidden',
			},
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
		},
	},
}

export const ToolPanelMachine = Machine<
	ToolPanelMachineContext,
	ToolPanelMachineStateSchema,
	ToolPanelMachineEvent
>(toolPanelMachineConfig)
