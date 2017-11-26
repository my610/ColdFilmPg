<template>
  <div class="row">
    <div class="panel panel-default">
      <div class="panel-heading">
        <h3 class="panel-title">Пожалуйста, авторизуйтесь</h3>
      </div>
      <div class="panel-body">
        <form method="post" @submit.prevent="onSubmit(email, password)">

          <div v-if="error" class="alert alert-warning alert-dismissible" role="alert">
            <button type="button" class="close" aria-label="Close" @click.prevent="dismissError">
              <span aria-hidden="true">&times;</span>
            </button>
            <span>{{ error.message }}</span>
          </div>

          <fieldset>
            <div class="form-group ">
              <label for="email">Email</label>
              <input class="form-control input-sm" v-model="email" name="email" type="text" id="email">
            </div>

            <div class="form-group">
              <label for="password">Пароль</label>
              <input class="form-control input-sm" v-model="password" name="password" type="password" value=""
                     id="password">
            </div>
            <div class="form-group">
              <button class="btn btn-block btn-sm btn-success" type="submit">Вход</button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState, mapMutations, mapActions } from 'vuex'

  export default {
    data () {
      return {
        email: null,
        password: null,
        error: ''
      }
    },
    computed: {
      ...mapState(['route'])
    },
    methods: {
      dismissError () {
        this.error = undefined
        this.clearAuthenticateError()
      },
      onSubmit (email, password) {
        this.authenticate({strategy: 'local', email, password})
          .catch(error => {
            let type = error.className
            error = Object.assign({}, error)
            error.message = (type === 'not-authenticated')
              ? 'Incorrect email or password.' : 'An error prevented login.'
            this.error = error
          })
      },
      ...mapMutations('auth', {
        clearAuthenticateError: 'clearAuthenticateError'
      }),
      ...mapActions('auth', ['authenticate'])
    }
  }
</script>
