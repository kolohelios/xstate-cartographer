import { conditionToString } from '.'

describe('conditionToString', () => {
  it('should return a string unchanged', () => {
    const returnedResult = conditionToString('this string is the same')
    expect(returnedResult).toBe('this string is the same')
  })
})
