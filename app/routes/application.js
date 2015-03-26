import Ember from 'ember';
// import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';
import Firebase from 'firebase';
import config from '../config/environment';

export default Ember.Route.extend({
  actions: {
    login: function(provider) {

      return this.get('session').authenticate(provider);
    },

    logout: function() {

      return this.get('session').invalidate();
    }
  }
});
