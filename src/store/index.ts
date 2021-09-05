import { createStore } from 'vuex';

export default createStore({
  state: {
    user: null,
    modal: null,
  },
  mutations: {
    SET_USER: (state, user) => {
      state.user = user;
    },
    DISCARD_USER: (state) => {
      state.user = null;
    },
    SET_MODAL: (state, modal) => {
      state.modal = modal;
    },
    DISCARD_MODAL: (state) => {
      state.modal = null;
    },
  },
  actions: {
    setUser: ({ commit }, user) => {
      commit('SET_USER', user);
    },
    discardUser: ({ commit }) => {
      commit('DISCARD_USER');
    },
    setModal: ({ commit }, modal) => {
      commit('SET_MODAL', modal);
    },
    discardModal: ({ commit }) => {
      commit('DISCARD_MODAL');
    },
  },
});
