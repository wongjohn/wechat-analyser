const state = {
  isMultiSelectionMode: false,
  multiSelections: {},
  titleSelection: {},
  lastChatSessionInfo: null,
};

const mutations = {
  MULTI_SELECTION_MODE_ON(state) {
    state.isMultiSelectionMode = true;
  },
  MULTI_SELECTION_MODE_OFF(state) {
    state.isMultiSelectionMode = false;
  },
  MULTI_SELECTION_TOGGLE_SELECTION(state, selection) {
    if (state.multiSelections[selection.id]) {
      state.multiSelections = { ...state.multiSelections };
      delete state.multiSelections[selection.id];
    } else {
      state.multiSelections = { ...state.multiSelections, [selection.id]: selection };
    }
  },
  MULTI_SELECTION_CLEAR_SELECTION(state) {
    state.multiSelections = {};
  },
  MULTI_SELECTION_ADD_TITLE(state, selection) {
    if (state.titleSelection[selection.id]) {
      state.titleSelection = {};
    } else {
      state.titleSelection = { [selection.id]: selection };
    }
  },
  MULTI_SELECTION_CLEAR_TITLE(state) {
    state.titleSelection = {};
  },
  LAST_CHAT_SESSION_INFO(state, chatSession) {
    state.lastChatSessionInfo = chatSession;
  },
};

export default {
  state,
  mutations,
};
