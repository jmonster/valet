import Ember from 'ember';
import Firebase from 'firebase';
import config from '../config/environment';

let handleFor = function(authorization) {

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
};

let injectSession = function(application, session) {

  application.register('auth:main', session);
  application.inject('controller', 'session', 'auth:main');
  application.inject('route', 'session', 'auth:main');

  application.advanceReadiness();
};

export default {
  name: 'firebase-session',
  after: 'store',
  initialize: function(container, application) {

    application.deferReadiness();

    let store = container.lookup('store:main');
    let firebase = new Firebase(config.firebase);
    let authData = firebase.getAuth();

    let session = Ember.Object.extend({
      firebase: firebase,
      isAuthenticated: Ember.computed.bool('currentUser'),
      currentUser: null,

      authenticate: function(provider) {

        // it's possible we have a User record in memory
        // that does not exist on the server
        store.unloadAll('user');

        // handler for successful authentication
        let firebase = this.get('firebase');
        let didAuth = (authData) => {

          let handle = handleFor(authData);
          store.find('user', authData.uid).then((user) => {

            this.set('currentUser', user);
          }).catch((/*error*/) => {

            let user = store.recordForId('user', authData.uid);
            user.loadedData();
            user.setProperties({ handle: handle });

            return user.save()
                .then(() => {

                  this.set('currentUser', user);  // remember the new user
                });
          });
        };

        firebase.authWithOAuthPopup(provider, (error, authData1) => {
          if (error) {
            if (error.code === "TRANSPORT_UNAVAILABLE") {
              // fall-back to browser redirects, and pick up the session
              // automatically when we come back to the origin page
              firebase.authWithOAuthRedirect(provider, (error, authData2) => {
                if (error) { throw error; }
                else       { didAuth(authData2); }
              });
            }
          } // > error

          didAuth(authData1);
        });
      },

      invalidate: function() {

        this.set('currentUser', null);
        this.get('firebase').unauth();
      }
    });

    // first visit
    if (!(authData && authData.uid)) { return injectSession(application, session); }

    // returning user
    store
      .find('user', authData.uid)
      .then((user) => {

        injectSession(application, session.extend({ currentUser: user }));
      })
      .catch((/*error*/) => {

        let user = store.recordForId('user', authData.uid);
        user.loadedData();
        user.setProperties({ handle: handleFor(authData) });

        return user.save()
            .then(() => {

              // remember the new user
              injectSession(application, session.extend({ currentUser: user }));
            });
      });
  }
};
