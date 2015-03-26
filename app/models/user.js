import DS from 'ember-data';

export default DS.Model.extend({

  handle:   DS.attr('string'),
  email:    DS.attr('string'),
  password: DS.attr('string'),     // not returned by the server, but (set+save) to change it
  cars:     DS.hasMany('car'),
  tickets:  DS.hasMany('ticket'),
  spots:    DS.hasMany('spot'),   // places the user has parked
});
