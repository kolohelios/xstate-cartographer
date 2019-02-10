import { StateNode } from 'xstate'

export function isChildOf(
  childState: StateNode,
  parentState: StateNode
): boolean {
  let marker = childState

  while (marker.parent && marker.parent !== parentState) {
    marker = marker.parent
  }

  return marker === parentState
}
