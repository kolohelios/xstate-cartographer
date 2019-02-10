import { friendlyEventName } from '.'

describe('utils:friendlyEventName', () => {
  it('should handle an "after" event', () => {
    const result = friendlyEventName('xstate.after(3000)')
    expect(result).toBe('after 3000ms')
  })
})
