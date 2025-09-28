export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('fetch:before', ({ options }) => {
    const auth = useAuthStore()
    if (auth.token) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${auth.token}`
      }
    }
  })
})
