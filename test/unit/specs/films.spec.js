import Vue from 'vue'
import films from '@/components/views/films'

describe('films.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(films)
    const vm = new Constructor().$mount()
    expect(vm.$el.querySelector('.films h1').textContent)
      .to.equal('Films')
  })
})
