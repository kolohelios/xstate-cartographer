import { StateNode, Machine, interpret } from 'xstate'
import * as XState from 'xstate'

export function toMachine(machine: StateNode<any> | string): StateNode<any> {
  if (typeof machine !== 'string') {
    return machine
  }

  const createMachine = new Function('Machine', 'interpret', 'XState', machine)

  let resultMachine: StateNode<any>

  const machineProxy = (config: any, options: any) => {
    resultMachine = Machine(config, options)

    return resultMachine
  }

  createMachine(machineProxy, interpret, XState)

  return resultMachine! as StateNode<any>
}
