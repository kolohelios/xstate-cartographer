import { friendlyEventName } from '.'

describe('utils:friendlyEventName', () => {
  it('should handle an "after" event', () => {
    const result = friendlyEventName('xstate.after(3000)')
    expect(result).toBe('after 3000ms')
  })

  it('should handle an empty string event', () => {
    const result = friendlyEventName('')
    expect(result).toBe('?')
  })

  it('should handle a "done" event', () => {
    const result = friendlyEventName('done.state')
    expect(result).toBe('(done)')
  })

  it('should return any unhandled event', () => {
    const result = friendlyEventName('this is not a handled event')
    expect(result).toBe('this is not a handled event')
  })
})
