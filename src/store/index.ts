import { createStore } from 'vuex';

export default createStore({
  state: {
    user: null,
    modal: null,
    commentModal: null,
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
    SET_COMMENT_MODAL: (state, commentModal) => {
      state.commentModal = commentModal;
    },
    DISCARD_COMMENT_MODAL: (state) => {
      state.commentModal = null;
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
    setCommentModal: ({ commit }, commentModal) => {
      commit('SET_COMMENT_MODAL', commentModal);
    },
    discardCommentModal: ({ commit }) => {
      commit('DISCARD_COMMENT_MODAL');
    },
  },
});
