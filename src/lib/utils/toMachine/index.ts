import { StateNode, Machine, interpret } from 'xstate'
import { ModuleKind, transpileModule } from 'typescript'
import * as XState from 'xstate'

export function toMachine(machine: StateNode<any> | string): StateNode<any> {
	if (typeof machine !== 'string') {
		return machine
	}

	const machineWithoutExport = machine.replace(/export /g, '')

	const transpiledOutput = transpileModule(machineWithoutExport, {
		compilerOptions: { module: ModuleKind.CommonJS },
	})

	const transpiledString = transpiledOutput.outputText

	const createMachine = new Function(
		'Machine',
		'interpret',
		'XState',
		transpiledString,
	)

	let resultMachine: StateNode<any>

	const machineProxy = (config: any, options: any) => {
		resultMachine = Machine(config, options)

		return resultMachine
	}

	createMachine(machineProxy, interpret, XState)

	return resultMachine! as StateNode<any>
}
