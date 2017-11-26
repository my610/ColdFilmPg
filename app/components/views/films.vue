<template>
  <div>
    <div class="row">
      <div class="col-md-3 col-sm-4 hidden-xs" style="padding-bottom: 5px;">
        <small-pagination
          :current="currentPage"
          :total="totalItems"
          :perPage="perPage"
          @page-changed="loadItems"
        ></small-pagination>
      </div>

      <div class="col-md-2 col-sm-4 col-xs-12" style="padding-bottom: 15px;">
        <div class="btn-group col-xs-12" role="group" aria-label="...">
          <button type="button" @click="setNewState(null)" class="btn btn-xs btn-page col-xs-4"
                  :class="status === null ? 'btn-info active':'btn-default'">Все
          </button>
          <button type="button" @click="setNewState(1)" class="btn btn-xs btn-page col-xs-4"
                  :class="status === 1 ? 'btn-info active':'btn-default'">Вкл.
          </button>
          <button type="button" @click="setNewState(0)" class="btn btn-xs btn-page col-xs-4"
                  :class="status === 0 ? 'btn-info active':'btn-default'">Выкл.
          </button>
        </div>
      </div>

      <div class="col-md-7 col-sm-12 col-xs-12">
        <vue-instant :suggestion-attribute="suggestionAttribute"
                     v-model="value"
                     :disabled="false"
                     @input="changed"
                     @selected="selected"
                     @clear="clear"
                     @escape="clear"
                     :show-autocomplete="true"
                     :autofocus="false"
                     :suggestions="suggestions"
                     name="customName"
                     placeholder="Название фильма..."
                     type="custom"></vue-instant>
      </div>
    </div><!-- .row -->

    <hr style="margin-top: 5px;">

    <div class="row">
      <div class="col-md-4">
        <div v-if="film === null" class="jumbotron jumbotron-error-notfound">
          <h5 class="lead">
            Please select a movie from the list to continue.
          </h5>
        </div>
        <viewer-film-info v-else :film="film"></viewer-film-info>
      </div>
      <div class="col-md-8">

        <div class="table-responsive">
          <table id="films" class="table table-hover table-striped table-condensed">
            <tr>
              <th width="25" class="text-center">#</th>
              <th>Название</th>
              <th width="75" class="text-center">Сезон</th>
              <th width="75" class="text-center">Серия</th>
              <th width="75" class="text-center">Всего</th>
              <th width="75" class="text-center">Toramp</th>
              <th width="55">Статус</th>
            </tr>
            <tbody>
            <tr v-for="(item, index) in films" :key="item.id">
              <td>{{ item.id }}</td>
              <td><a @click="film = item" style="cursor: pointer;">{{ item.title }}</a>
              </td>
              <td class="text-center">{{ item.season }}</td>
              <td class="text-center">{{ item.last_series }}</td>


              <td class="text-center" :class="{editing: index === edited.id && edited.key === 0}">
                <div class="view">
                  <label @click="editItem(index, 0)">{{ getTitleSeries(item.series_count) }}</label>
                </div>
                <input class="edit" type="number"
                       v-model="item.series_count"
                       v-focus="index === edited.id && edited.key === 0"
                       @blur="doneEdit(item)"
                       @keyup.enter="doneEdit(item)"
                       @keyup.esc="cancelEdit(item)">

              </td>

              <td class="text-center" :class="{editing: index === edited.id && edited.key === 1 }">

                <div class="view">
                  <label @click="editItem(index, 1)">{{ item.toramp_id }}</label>
                </div>
                <input class="edit" type="number"
                       v-model="item.toramp_id"
                       v-focus="index == edited.id && edited.key == 1"
                       @blur="doneEdit(item)"
                       @keyup.enter="doneEdit(item)"
                       @keyup.esc="cancelEdit(item)">

              </td>
              <td class="text-center">
                <toggle-button @change="changeStatus(index)"
                               :value="item.status === 1"
                               :sync="true"
                               :labels="true"
                               :key="item.id"
                ></toggle-button>

              </td>
            </tr>
            </tbody>
          </table>
        </div> <!-- .table-responsive -->

      </div>
    </div>

  </div>
</template>

<style>
  label.vue-js-switch {
    margin-bottom: 0px;
  }

  .edit {
    position: relative;
    margin: 0;
    width: 100%;
    border: 0;
    outline: none;
    border: 1px solid #999;
    box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
  }

  td.editing .edit {
    display: block;
    text-align: center;
  }

  td.editing .view {
    display: none;
  }

  td .edit {
    display: none;
  }

  td label {
    white-space: pre-line;
    word-break: break-all;
    display: block;
    transition: color 0.4s;
    font-weight: normal;
  }

  .vue-instant__suggestions li.highlighted__custom {
    /*background-color: #ff0000;*/
    color: #18BC9C;
  }
  .vue-instant__suggestions li:hover {
    background-color: #F5F8FA;
    color: #18BC9C;
  }
  .vue-instant__suggestions {
    margin-top: 0;
  }

  .sbx-custom {
    display: inline-block;
    position: relative;
    width: 100%;
    height: 27px;
    white-space: nowrap;
    box-sizing: border-box;
    font-size: 12px;
    margin-top: -12px;
  }

  .sbx-custom__wrapper {
    width: 100%;
    height: 100%;
  }

  .sbx-custom__input-placeholder, .sbx-custom__input {
    display: inline-block;
    transition: box-shadow .4s ease, background .4s ease;
    border: 0;
    border-radius: 5px;
    box-shadow: inset 0 0 0 1px #ccc;
    /*background: #F5F8FA;*/
    padding: 0;
    padding-right: 46px;
    padding-left: 10px;
    width: 100%;
    height: 100%;
    vertical-align: middle;
    white-space: normal;
    font-size: inherit;
    appearance: none;
  }

  .sbx-custom__input::-webkit-search-decoration, .sbx-custom__input::-webkit-search-cancel-button, .sbx-custom__input::-webkit-search-results-button, .sbx-custom__input::-webkit-search-results-decoration {
    display: none;
  }

  .sbx-custom__input:hover {
    box-shadow: inset 0 0 0 1px #b3b3b3;
  }

  .sbx-custom__input:focus, .sbx-custom__input:active {
    outline: 0;
    box-shadow: inset 0 0 0 1px #18BC9C;
    background: #FFFFFF;
  }

  .sbx-custom__input::placeholder {
    color: #9AAEB5;
  }

  .sbx-custom__submit {
    position: absolute;
    top: 0;
    right: 0;
    left: inherit;
    margin: 0;
    border: 0;
    border-radius: 0 4px 4px 0;
    background-color: rgba(62, 130, 247, 0);
    padding: 0;
    width: 27px;
    height: 100%;
    vertical-align: middle;
    text-align: center;
    font-size: inherit;
    user-select: none;
  }

  .sbx-custom__submit::before {
    display: inline-block;
    margin-right: -4px;
    height: 100%;
    vertical-align: middle;
    content: '';
  }

  .sbx-custom__submit:hover, .sbx-custom__submit:active {
    cursor: pointer;
  }

  .sbx-custom__submit:focus {
    outline: 0;
  }

  .sbx-custom__submit svg {
    width: 13px;
    height: 13px;
    vertical-align: middle;
    fill: #18BC9C;
  }

  .sbx-custom__reset {
    display: none;
    position: absolute;
    top: 4px;
    right: 27px;
    margin: 0;
    border: 0;
    background: none;
    cursor: pointer;
    padding: 0;
    font-size: inherit;
    user-select: none;
    fill: rgba(0, 0, 0, 0.5);
  }

  .sbx-custom__reset:focus {
    outline: 0;
  }

  .sbx-custom__reset svg {
    display: block;
    margin: 4px;
    width: 11px;
    height: 11px;
  }

  .sbx-custom__input:valid ~ .sbx-custom__reset {
    display: block;
    animation-name: sbx-reset-in;
    animation-duration: .15s;
  }

  @keyframes sbx-reset-in {
    0% {
      transform: translate3d(-20%, 0, 0);
      opacity: 0;
    }
    100% {
      transform: none;
      opacity: 1;
    }
  }
</style>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex'

  export default {
    data () {
      return {
        name: 'Films',
        loading: false,
        films: [],
        totalItems: 0,
        perPage: 25,
        currentPage: 1,
        film: null,
        edited: {
          id: null,
          key: null
        },
        metaInfo: {
          title: 'Films'
        },
        status: 1,
        value: '',
        suggestionAttribute: 'fullTitle',
        suggestions: [],
        selectedEvent: ''
      }
    },
    mounted () { this.loadItems(this.currentPage) },
    computed: {
      isEmpty () { return this.films.length === 0 && !this.loading },
      ...mapState('auth', ['user']),
      ...mapGetters('season-info', {listSeasonInfo: 'list'}),
      ...mapGetters('season-info', {getSeasonInfo: 'get'})
    },
    methods: {
      loadItems (page) {
        this.loading = true

        const options = {
          $skip: (page - 1) * this.perPage,
          $limit: this.perPage,
          status: this.status,
          '$sort[id]': -1
        }

        if (this.status === null) {
          delete options.status
        }
        this.findSeasonInfo({query: options})
          .then(response => {
            this.films = response.data
            this.loading = false
            this.totalItems = response.total
            this.currentPage = page
          })
          .catch(error => {
            console.log(error)
            this.loading = false
          })
      },
      clear () {
        this.film = null
      },
      selected (selected) {
        this.film = selected || null
      },
      async changed () {
        const component = this
        this.suggestions = []

        const options = {
          $limit: 10,
          status: this.status,
          title: {$iLike: `%${this.value}%`}
        }
        if (this.status === null) { delete options.status }
        try {
          const res = await this.findSeasonInfo({query: options})
          for (const elem of res.data) {
            elem.fullTitle = `${elem.title} ${elem.season} сезон`
            component.suggestions.push(elem)
          }
        } catch (e) { console.error(e.message) }
      },
      changeStatus (index) {
        const state = this.films[index].status === 0 ? 1 : 0
        this.films[index].status = state

        this.patchSeasonInfo([this.films[index].id, {status: state}])
          .then(res => {
            this.films[index].status = res.status
          })
          .catch(error => {
            this.films[index].status = state === 0 ? 1 : 0
            console.error(error)
          })
      },
      setNewState (status) {
        this.status = status
        this.loadItems(this.currentPage)
      },
      editItem (id, key) {
        let item = {series: this.films[id].series_count, toramp: this.films[id].toramp_id}
        this.edited = {id, key, item}
      },
      doneEdit (item) {
        if (!this.edited.item) {
          return
        }

        let params = {}

        switch (this.edited.key) {
          case 0:
            if (this.edited.item.series !== item.series_count) {
              params.series_count = item.series_count
            } else return
            break
          case 1:
            if (this.edited.item.toramp !== item.toramp_id) {
              params.toramp_id = item.toramp_id
            } else return
            break
        }

        this.edited = {index: null, key: null}
        console.log('doneEdit', this.edited)

        this.patchSeasonInfo([item.id, params])
          .then(res => {
            console.log('setSeasonInfo', res)
            if (res.toramp_id) {
              this.films[this.edited.id].toramp_id = res.toramp_id
            } else if (res.series_count) {
              this.films[this.edited.id].series_count = res.series_count
            }
          })
          .catch(error => {
            console.log(error)
          })
      },
      cancelEdit () {
        this.edited = {index: null, key: null}
      },
      isEdited (id, col) {
        if (!this.edited) {
          return false
        }
        return !!this.edited && id === this.edited.id && this.edited.key === col
      },
      getTitleSeries (count) {
        return count === 255 ? '??' : count
      },
      ...mapActions('season-info', {findSeasonInfo: 'find'}),
      ...mapActions('season-info', {patchSeasonInfo: 'patch'})
    },

    // a custom directive to wait for the DOM to be updated
    // before focusing on the input field.
    // http://vuejs.org/guide/custom-directive.html
    directives: {
      'focus': function (el, binding) {
        if (binding.value) {
          el.focus()
        }
      }
    }

  }
</script>
