import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    login: function() {
      this.get('session').authenticate('simple-auth-authenticator:torii', 'firebase', {
        authWith: 'twitter'
      });
    },
    logout: function() {
      this.get('session').invalidate();
    }
  }
});
