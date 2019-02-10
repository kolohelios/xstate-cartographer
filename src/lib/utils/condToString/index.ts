export function condToString(cond: string | Function) {
  if (typeof cond === 'function') {
    console.log(cond.toString())
    return cond
      .toString()
      .replace(/\n/g, '')
      .match(/\{(.*)\}/)![1]
      .trim()
  }

  return cond
}
