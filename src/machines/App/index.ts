import { toMachine } from 'src/lib/utils'
import {
	MachineConfig,
	StateNode,
	assign,
	MachineOptions,
	Machine,
	interpret,
} from 'xstate'

import * as rawText from '../../sampleMachines/defaultMachine.js.txt'
const defaultMachine = rawText.default

export enum AppMachineEvents {
	UpdateCode = 'UPDATE_CODE',
	UpdateStateChart = 'UPDATE_STATE_CHART',
}

interface AppMachineStateSchema {
	states: {
		loading: {}
		ready: {}
		checkCode: {}
		valid: {}
		invalid: {}
	}
}

interface AppMachineContext {
	editorCode: string
	machineCode: string
	stagedMachineCode: string
}

type AppMachineEvent =
	| { type: AppMachineEvents.UpdateCode; data: string }
	| { type: AppMachineEvents.UpdateStateChart }

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

const checkCode = (context: AppMachineContext, event: any) =>
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

const appMachineConfig: MachineConfig<
	AppMachineContext,
	AppMachineStateSchema,
	AppMachineEvent
> = {
	id: 'app',
	context: {
		editorCode: '',
		machineCode: '',
		stagedMachineCode: '',
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
							editorCode: (context: AppMachineContext, event: any) =>
								event.data,
							machineCode: (context: AppMachineContext, event: any) =>
								event.data,
							stagedMachineCode: (context: AppMachineContext, event: any) =>
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
							stagedMachineCode: () => defaultMachine,
						}),
					],
				},
			},
		},
		ready: {
			on: {
				[AppMachineEvents.UpdateCode]: {
					target: 'checkCode',
					actions: [
						assign({
							editorCode: (
								context: AppMachineContext,
								// TODO HACK we need typing for events where we can pass it a specific type of event so we don't use any here
								event: any,
							) => {
								console.log(context, event)
								return event.data
							},
						}),
					],
				},
				[AppMachineEvents.UpdateStateChart]: {
					target: 'ready',
					actions: [
						assign({
							machineCode: (context: any) => context.stagedMachineCode,
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
						(context: AppMachineContext, event: any) => {
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
						assign({ stagedMachineCode: (context: any) => context.editorCode }),
					],
				},
			},
		},
		invalid: {},
	},
}

// TODO reinstate more specific types (instead of using any for the type of appMachineOptions)
const appMachineOptions: any = {
	services: {
		checkCode,
		getMachines,
	},
}

export const AppMachine = Machine<
	AppMachineContext,
	AppMachineStateSchema,
	AppMachineEvent
>(appMachineConfig, appMachineOptions)

export const appMachineService = interpret(AppMachine).start()
