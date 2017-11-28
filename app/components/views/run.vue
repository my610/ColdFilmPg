<template>
  <div class="row">
    <div class="col-md-12">
      <button class="btn btn-block btn-default" @click="checkCategories">Проверка новых категорий</button>
      <button class="btn btn-block btn-default" @click="checkTranslation">Проверка переводов</button>
      <button class="btn btn-block btn-default" @click="checkSeries">Проверка новых серий</button>

      <div class="form-inline" style="margin-top: 20px;">
        <div class="form-group">
          <input v-model="category" type="number" class="form-control" id="categories" placeholder="Categories">
        </div>
        <button type="submit" class="btn btn-default" @click="addCategory">Добавить категорию</button>
      </div>

    </div>
  </div>
</template>
<script>
  import { mapActions } from 'vuex'

  export default {
    data () {
      return {
        name: 'rum',
        category: 0
      }
    },
    methods: {
      async checkCategories () {
        await this.getService('checkCategories')
      },
      async checkTranslation () {
        await this.getService('checkTranslation')
      },
      async checkSeries () {
        await this.getService('checkSeries')
      },
      async addCategory () {
        await this.getService(['addCategory', {query: {id: this.category}}])
      },
      ...mapActions('run-service', {getService: 'get'})
    }
  }
</script>
