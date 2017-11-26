<template>
  <div id="register" class="card text-xs-center container">
    <div class="card-block">
      <h1 class="card-title">Create an account</h1>
      <div v-if="error" class="alert alert-danger">
        <span>{{ error }}</span>
      </div>
      <div class="card-text">
        <label for="email" class="sr-only">Email address</label>
        <input v-model="email" id="email" class="form-control" placeholder="Email address" required="" autofocus=""
               type="email">
        <label for="password" class="sr-only">Password</label>
        <input v-model="password" @keyup.enter="register" id="password" class="form-control" placeholder="Password"
               required="" type="password">
      </div>
      <button @click="register" class="btn btn-lg btn-primary w-100">Register</button>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        email: '',
        password: '',
        error: ''
      }
    },
    methods: {
      register () {
        this.$store.dispatch('register', {email: this.email, password: this.password})
          .then(() => {
            let url = require('url')
            let redirect = url.parse(this.$router.currentRoute.fullPath, true).query.redirect
            /* eslint no-unneeded-ternary: off */
            this.$router.replace(redirect ? redirect : '/')
          })
          .catch((err) => {
            this.error = err.message
          })
      }
    }
  }
</script>
