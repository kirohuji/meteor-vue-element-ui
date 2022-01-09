import getters from './getters'
import app from './modules/app'
import errorLog from './modules/errorLog'
import permission from './modules/permission'
import settings from './modules/settings'
import tagsView from './modules/tagsView'
import user from './modules/user'
import account, { plugin as AccountPlugin } from './modules/account';
const store ={
  plugins: [AccountPlugin], // Connects Meteor's reactive user state to the store using Tracker
  modules: {
    app,
    errorLog,
    permission,
    settings,
    tagsView,
    user,
    account
  },
  getters
}

export default store
