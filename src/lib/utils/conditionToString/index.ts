import { TransitionDefinition } from 'xstate'

// TODO reinstate more specific types (instead of using any for the type of condition)
export function conditionToString(condition: any) {
	if (typeof condition === 'function') {
		return condition
			.toString()
			.replace(/\n/g, '')
			.match(/\{(.*)\}/)![1]
			.trim()
	}

	return condition
}
