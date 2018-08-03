const state = {
  contacts: [],
  contactsHashObject: {},
  contactsUserNameMapObject: {},
};

const mutations = {
  INIT_CONTACTS(state, { contacts = [], contactsHashObject = {}, contactsUserNameMapObject = {} }) {
    state.contacts = contacts;
    state.contactsHashObject = contactsHashObject;
    state.contactsUserNameMapObject = contactsUserNameMapObject;
  },
};

export default {
  state,
  mutations,
};
