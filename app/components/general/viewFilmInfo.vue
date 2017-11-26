<template>
  <div class="row">
    <!-- Film poster style="max-width: 320px" -->
    <div class="col-md-6">
      <a class="btn btn-xs btn-default btn-block col-md-12 btn-page" :href="getColdfilmUrl" target="_blank"
         rel="nofollow">Open to the ColdFilm</a>
    </div>
    <div class="col-md-6">
      <a class="btn btn-xs btn-default btn-block col-md-12 btn-page" :href="getTorampUrl" target="_blank"
         rel="nofollow">
        {{ !film.toramp_id ? 'Search' : 'Open' }} at  Toramp</a>
    </div>
    <hr>
    <div class="col-md-12 text-center">
      <img src="/static/img/loading_spinner.gif"
           v-img="getImgUrl"
           :alt="film.title"
           class="img-thumbnail"
           rel="noreferrer">
    </div>
    <!-- Film information -->
    <div class="col-md-8 col-sm-8 col-xs-12">
      <!--<p><b>Series in a season:</b> </p>-->
      <hr>
      <div class="input-group">
        <b style="padding-right: 20px;">Monitoring:</b>

        <div class="btn-group">
          <transition name="fade" mode="out-in">
            <button :key="film.status"
                    @click="changeStatus(film.id, film.status)"
                    class="btn btn-xs btn-primary"
                    :class="status"
                    style="width: 35px;">
              {{ monBtnText }}
            </button>
          </transition>
        </div>
      </div>
      <hr>

    </div>
  </div>
</template>
<style>
  .not-active {
    color: #3276b1;
    background-color: #fff;
  }

  .fade-enter-active, .fade-leave-active {
    transition: all .1s;
  }

  .fade-enter, .fade-leave-active {
    opacity: 0;
  }

  .fade-enter {
    transform: translateX(15px);
  }

  .fade-leave-active {
    transform: translateX(-15px);
  }

  @media (max-width: 767px) {
    /*xs*/
    .btn-page {
      /*padding: 1px 5px;*/
      /*font-size: 12px;*/
      /*line-height: 1.5;*/
      /*border-radius: 3px;*/

      padding: 6px 12px;
      font-size: 14px;
      line-height: 1.42857143;
      border-radius: 4px;
    }
  }
</style>
<script>
  import { mapActions } from 'vuex'

  export default {
    directives: {
      /* eslint-disable no-extra-bind */
      img (el, url) {
        el.src = '/static/img/loading_spinner.gif'
        let img = new Image()
        img.src = url.value
        img.onload = function () {
          el.src = url.value
        }.bind(this)
      }
    },
    computed: {
      status () {
        return {
          active: this.film.status === 1,
          'not-active': this.film.status === 0
        }
      },
      getTorampUrl () {
        return (this.film.toramp_id === 0)
          ? `http://www.toramp.com/search.php?search=${this.film.title}`
          : `http://www.toramp.com/schedule.php?id=${this.film.toramp_id}`
      },
      getColdfilmUrl () {
        return `http://coldfilm.ru/news/1-0-${this.film.id}`
      },
      monBtnText: function () {
        switch (this.film.status) {
          case 0:
            return 'OFF'
          case 1:
            return 'ON'
        }
      },
      getImgUrl () {
        return (this.film.img.charAt(0) === '/') ? `http://coldfilm.ru${this.film.img}` : this.film.img
      }
    },
    props: {
      film: {
        type: Object,
        required: true
      }
    },
    methods: {
      ...mapActions('season-info', {patchSeasonInfo: 'patch'}),
      async setMonitoring (id, status) {
        try {
          const res = await this.patchSeasonInfo([id, {status}])
          this.film.status = res.status
        } catch (e) {
          console.error(e.message)
        }
      },
      changeStatus (id, status) {
        this.setMonitoring(id, status === 0 ? 1 : 0)
      }
    }
  }
</script>

