const state = {
  /** 所有聊天对话 */
  allChatSessions: [],
};

const mutations = {
  INIT_CHAT_SESSIONS(state, { allChatSessions = [] }) {
    state.allChatSessions = allChatSessions;
  },
};

export default {
  state,
  mutations,
};
