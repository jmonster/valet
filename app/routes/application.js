import Ember from 'ember';
import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';

export default Ember.Route.extend(ApplicationRouteMixin, {
  actions: {
    login: function(provider) {
      return this.get('session')
        .authenticate('simple-auth-authenticator:torii', 'firebase', {
          authWith: provider
        });
    },

    logout: function() {
      return this.get('session').invalidate();
    },

    sessionAuthenticationSucceeded: function() {
      let store = this.get('store');
      let uid   = this.get('session.uid');

      return store.find('user', uid)
        .then((/*user*/) => {

        })
        .catch(() => {
          let user = store.createRecord('user', {
            id: uid,
            handle: this._handleFor(this.get('session.content'))
          });

          user.save().then((/*user*/) => {

          });
        });
    }
  },


  _handleFor: function(authorization) {
    if (authorization.github) {
      return authorization.github.username;
    } else if (authorization.facebook) {
      return authorization.facebook.displayName;
    } else if (authorization.twitter) {
      return authorization.twitter.displayName;
    } else if (authorization.google) {
      return authorization.google.displayName;
    } else {
      throw new Error('couldn\'t find a username!');
    }
  }
});
