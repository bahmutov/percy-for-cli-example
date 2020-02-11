const delay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms))
describe('example', () => {
  it('works A', () => delay())
  it('works B', () => delay())
  it('works C', () => delay())
  it('skips D')
  it('has brackets < and >', () => {
    console.log('hello <there>!')
  })
})
