import DS from 'ember-data';

export default DS.Model.extend({

  licensePlate: DS.attr('string'),
  color:        DS.attr('string'),
  make:         DS.attr('string'),
  model:        DS.attr('string'),
  spots:        DS.hasMany('spot')
});
