import { StateNode, TransitionDefinition } from 'xstate'
import { flatten } from '..'

export function transitions(
	stateNode: StateNode,
): TransitionDefinition<any, any>[] {
	return flatten(
		stateNode.ownEvents.map(event => {
			return stateNode.definition.on[event]
		}),
	)
}
