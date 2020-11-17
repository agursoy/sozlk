export const state = () => ({
  search: null,
})

export const getters = {
  search: (state) => state.search,
}

export const actions = {
  setSearch: (context, text) => {
    context.commit('SET_SEARCH', text)
  },
}

export const mutations = {
  SET_SEARCH(state, text) {
    state.search = text
  },
}
