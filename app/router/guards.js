import feathers from '../feathers-client-rest'

// Restrict to authenticated users
export function restrictToAuthenticated (to, from, next) {
  feathers.authenticate()
    .then(() => {
      next()
    })
    .catch(() => {
      next('/login?redirect=' + to.path)
    })
}

// Restrict to unauthenticated users
export function restrictToUnauthenticated (to, from, next) {
  feathers.authenticate()
    .then(() => {
      next(false)
    })
    .catch(() => {
      next()
    })
}
