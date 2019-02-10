export function friendlyEventName(event: string) {
  let match = event.match(/^xstate\.after\((\d+)\)/)

  if (match) {
    return `after ${match[1]}ms`
  }

  match = event.match(/^done\.state/)

  if (match) {
    return `(done)`
  }

  if (event === '') {
    return '?'
  }

  return event
}
