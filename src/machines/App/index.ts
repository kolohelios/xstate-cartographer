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
const defaultMachine = rawText.default as string

export enum AppMachineEvents {
	UpdateCode = 'UPDATE_CODE',
	UpdateStateChart = 'UPDATE_STATE_CHART',
}

export interface AppMachineStateSchema {
	states: {
		loading: {}
		ready: {}
		checkCode: {}
		valid: {}
		invalid: {}
	}
}

export interface AppMachineContext {
	editorCode: string
	machineCode: string
	stagedMachineCode: string
	codeIsValid: boolean
}

export type AppMachineEvent =
	| { type: AppMachineEvents.UpdateCode; value: string }
	| { type: AppMachineEvents.UpdateStateChart }

const getMachines = () =>
	// this isn't asynchronous (yet), but it lets us use onDone/onError
	new Promise<string>((fulfilled, rejected) => {
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
			const isEmpty = event.value === ''
			if (isEmpty) {
				rejected('isEmpty')
			}

			// TODO: this is a pretty naive approach to cleaning up the text editor's state machine
			const removedLineBreaks = event.value.replace(/[\n\r]/g, '')
			let machineBody = removedLineBreaks.match(/Machine\(([\w\W]+)\)/)
			machineBody = machineBody[0].replace('Machine(', '')
			machineBody = machineBody.substring(0, machineBody.length - 1)

			if (!machineBody) {
				rejected({
					error: 'isNotValidMachine',
					detail: 'unable to parse Machine from text',
				})
			}

			// TODO: make this safer; this function should probably return a machine, though we'll also have to be careful of activities and actions
			const createObjectFromString = (machineString: string) => {
				return eval(`(function () { return ${machineString}; })()`)
			}

			const objectified = createObjectFromString(machineBody)
			const trialMachine = toMachine(objectified)

			// TODO: make this check for a machine more robust, maybe by interpreting it and checking some properties
			const isMachine = Boolean(trialMachine.initial)
			if (isMachine) {
				fulfilled('isValid')
			} else {
				rejected({
					error: 'isNotValidMachine',
					detail: 'did not match instanceof StateNode',
				})
			}
		} catch (error) {
			rejected({ error: 'isNotValidJavaScriptOrTypeScript', detail: error })
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
		codeIsValid: true,
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
							editorCode: (context, event) => event.data,
							machineCode: (context, event) => event.data,
							stagedMachineCode: (context, event) => event.data,
							codeIsValid: _ => true,
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
							codeIsValid: _ => false,
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
								context,
								// TODO HACK we need typing for events where we can pass it a specific type of event so we don't use any here
								event,
							) => {
								console.log({ context, event })
								return event.value
							},
						}),
					],
				},
				[AppMachineEvents.UpdateStateChart]: {
					target: 'ready',
					actions: [
						assign({
							machineCode: context => context.stagedMachineCode,
							// machineCode: context => context.stagedMachineCode,
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
					target: 'invalid',
					actions: [
						(context: AppMachineContext, event: any) => {
							console.log('invalid code', context, event)
						},
					],
				},
			},
		},
		valid: {
			always: [
				{
					target: 'ready',
					actions: [
						assign({ stagedMachineCode: context => context.editorCode, codeIsValid: _ => true }),
					],
				},
			],
		},
		invalid: {
			always: [
				{
					target: 'ready',
					actions: [
						assign({ codeIsValid: _ => false }),
					]
				},
			],
		},
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
