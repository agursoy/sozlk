export const actions = {
  async nuxtServerInit({ dispatch }, { route }) {
    if (route.params && route.params.slug) {
      await dispatch('site/setSearch', route.params.slug)
    }
  },
}
