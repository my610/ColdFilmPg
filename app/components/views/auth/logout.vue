<template>
  <div id="logout"></div>
</template>

<script>
  import {mapActions} from 'vuex'

  export default {
    mounted () {
      this.logout()
        .then(() => {
          console.log('Goodbye! :)')
          this.$router.replace('/')
        })
        .catch((e) => {
          console.log('Error:', e.message)
        })
    },
    methods: {
      ...mapActions('auth', ['logout'])
    }
  }
</script>
