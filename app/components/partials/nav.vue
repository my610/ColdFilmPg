<template>
  <!-- Static navbar -->
  <nav class="navbar navbar-default navbar-fixed-top">
    <div class="container">
      <div class="navbar-header">
        <!-- navbar-toggle -->
        <button type="button" :class="[opened ? '' : 'collapsed', 'navbar-toggle']" @click="opened = !opened">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <router-link class="navbar-brand" to="/">
          <span class="glyphicon glyphicon-home" aria-hidden="true"></span>
        </router-link>
      </div>
      <transition name="fade">
        <div v-show="opened" id="navbar" :class="[opened ? 'in' : '', 'navbar-collapse', 'collapse']">
          <ul class="nav navbar-nav">
            <router-link v-if="isAuth" @click.native="opened=false" tag="li" to="/tasks">
              <a>Задачи</a>
            </router-link>

            <router-link v-if="isAuth" @click.native="opened=false" tag="li" to="/run">
              <a>Выполнить</a>
            </router-link>
          </ul>
          <ul class="nav navbar-nav navbar-right">
            <!--<li v-if="!isAuth"><a v-link="{ path: '/auth/register' }">Register</a></li>-->
            <router-link v-if="!isAuth" @click.native="opened=false" tag="li" to="/login">
              <a>Вход</a>
            </router-link>
            <router-link v-if="isAuth" @click.native="opened=false" tag="li" to="/logout">
              <a>Выход{{ exitText }}</a>
            </router-link>
          </ul>
        </div>
      </transition>
    </div>
  </nav>
</template>


<script>
  import {mapState} from 'vuex'

  export default {
    name: 'header',
    data () {
      return {
        opened: false
      }
    },
    computed: {
      ...mapState('auth', ['user', 'accessToken']),
      exitText () {
        return this.user !== undefined ? ` (${this.user.email})` : ''
      },
      isAuth () {
        return this.accessToken !== undefined
      }
    },
    created () {
//      if (!this.user) {
//        return this.$router.replace({name: 'login'})
//      }
    }
  }
</script>

<style>
  .fade-enter-active {
    transition: all .3s ease-in;
  }

  .fade-leave-active {
    transition: all .1s ease-out;
  }

  .fade-enter, .fade-leave-to, .fade-leave
    /* .slide-fade-leave-active для <2.1.8 */
  {
    opacity: 0;
  }

  .navbar-default .navbar-toggle:focus, .navbar-default .navbar-toggle:hover {
    background-color: #18bc9c;
  }

  .navbar-default .navbar-toggle {
    border-color: #18bc9c;
  }

  .navbar-default .navbar-nav > li > a:hover, .navbar-default .navbar-nav > li > a:focus {
    color: #18bc9c;
    background-color: transparent;
  }

  .navbar-default .navbar-nav > li > a {
    color: #fff;
  }

  .navbar-default .navbar-brand:hover, .navbar-default .navbar-brand:focus {
    color: #18bc9c;
    background-color: transparent;
  }

  .navbar-default .navbar-brand {
    color: #ffffff;
  }

  a:hover, a:focus {
    color: #18bc9c;
    text-decoration: underline;
  }

  .navbar-default .navbar-nav > .active > a, .navbar-default .navbar-nav > .active > a:hover, .navbar-default .navbar-nav > .active > a:focus {
    color: #18bc9c;
    background-color: #1a242f;
  }

  .navbar-default {
    background-color: #2c3e50;
  }

</style>
