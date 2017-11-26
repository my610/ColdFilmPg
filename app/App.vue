<template>
  <div id="app">
    <nav-component></nav-component>
    <div class="container container-wrap">
      <transition name="switch" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
    <footer-component></footer-component>
  </div>
</template>


<script>
  export default {
    name: 'app',
    computed: {
      // The user is automatically set by the feathers-vuex auth module upon login.
      user () {
        return this.$store.state.auth.user
      }
    },
    watch: {
      // When the user is set, redirect to the Chat page.
      user (newVal) {
        if (newVal === undefined) {
          this.$router.replace({name: 'login'})
        } else {
          this.$router.replace({name: 'films'})
        }
      }
    },
    mounted () {
      this.$store.dispatch('auth/authenticate').catch(error => {
        if (!error.message.includes('Could not find stored JWT')) {
          console.error(error)
        }
      })
    }
  }
</script>

<style>
  .switch-enter-active, .switch-leave-active {
    transition: all .2s ease-in-out;
  }

  .switch-enter, .switch-leave-to {
    opacity: 0;
  }

  .container-wrap {
    margin-top: 65px;
  }
</style>
