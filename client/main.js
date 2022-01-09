import { Meteor } from 'meteor/meteor'
import createApp from './app'
Meteor.startup(()=>{
    createApp();
})