<template>
  <div>
    <div class="row">
      <div class="col-md-3 col-sm-5 col-xs-12" style="padding-bottom: 5px;">
        <small-pagination
          :current="currentPage"
          :total="totalItems"
          :perPage="perPage"
          @page-changed="loadItems"
        ></small-pagination>
      </div>
      <div class="col-md-9 col-sm-7 col-xs-12">
        <small><p class="text-info pull-right">Total tasks: {{ totalItems }}</p></small>
      </div>
    </div><!-- .row -->

    <hr style="margin-top: 5px;">

    <div class="row">
      <div class="col-md-12">
        <div v-show="isEmpty" class="text-center">Нет данных для отображения...</div>

        <div v-if="!isEmpty" class="table-responsive">
          <table id="films" class="table table-hover table-striped table-condensed">
            <tr>
              <th width="25" class="text-center">#</th>
              <th class="text-center">Название</th>
              <th class="text-center col-md-2">Дата</th>
              <th width="25"></th>
            </tr>
            <tbody>
            <tr v-for="(item, index) in films" :key="item.id">
              <td>{{item.id}}</td>
              <td><a :href="getUrlFilm(item.id)" target="_blank" :title="item.payload.title">{{ item.payload.title
                }} {{ itemInfo(item) }}</a>
              </td>
              <td class="text-center">{{ getFormatDate(item.payload.date) }}</td>
              <td class="text-center">
                <a type="button" title="Удалить" aria-label="Удалить" @click="deleteFilm(index, item.id)"
                   class="btn btn-xs btn-danger text-danger">
                  <span class="glyphicon glyphicon-trash" aria-hidden="true"></span>
                </a>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div><!-- .row -->
  </div>
</template>
<script>
  import { mapActions } from 'vuex'

  export default {
    data () {
      return {
        loading: false,
        films: [],
        totalItems: 0,
        perPage: 25,
        currentPage: 1,
        film: null
      }
    },
    mounted: function () {
      this.loadItems(this.currentPage)
    },
    computed: {
      isEmpty () {
        return this.films.length === 0 && !this.loading
      }
    },
    methods: {
      ...mapActions('film-translated', {findFilmTranslated: 'find'}),
      ...mapActions('film-translated', {patchFilmTranslated: 'patch'}),
      async loadItems (page) {
        this.loading = true

        const options = {
          '$skip': (page - 1) * this.perPage,
          '$limit': this.perPage,
          status: 1
        }
        try {
          const res = await this.findFilmTranslated({query: options})
          this.films = res.data
          this.loading = false
          this.totalItems = res.total
          this.currentPage = page
        } catch (e) {
          console.error(e.message)
          this.loading = false
        }
      },
      getUrlFilm (id) {
        return `http://coldfilm.ru/news/2017-02-28-${id}`
      },
      async deleteFilm (index, id) {
        try {
          await this.patchFilmTranslated([id, {status: 0}])
          this.films.splice(index, 1)
          this.totalItems -= 1
        } catch (e) {
          console.log(e.message)
        }
      },
      itemInfo (item) {
        return `${item.payload.season} сезон ${item.payload.series} серия`
      },
      getFormatDate (value) {
        let info = value.match(/(\d+)-(\d+)-(\d+)/i)
        if (info) {
          return `${info[3]}.${info[2]}.${info[1]}`
        }
      }
    }
  }
</script>
