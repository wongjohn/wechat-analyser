const state = {
  isMultiSelectionMode: false,
  multiSelections: {},
  titleSelection: {},
};

const mutations = {
  MULTI_SELECTION_MODE_ON(state) {
    state.isMultiSelectionMode = true;
  },
  MULTI_SELECTION_MODE_OFF(state) {
    state.isMultiSelectionMode = false;
  },
  MULTI_SELECTION_ADD_SELECTION(state, selection) {
    state.multiSelections = { ...state.multiSelections, [selection.id]: selection };
  },
  MULTI_SELECTION_CLEAR_SELECTION(state) {
    state.multiSelections = {};
  },
  MULTI_SELECTION_ADD_TITLE(state, selection) {
    state.titleSelection = { [selection.id]: selection };
  },
  MULTI_SELECTION_CLEAR_TITLE(state) {
    state.titleSelection = {};
  },
};

export default {
  state,
  mutations,
};
