import DS from 'ember-data';

export default DS.Model.extend({

  nickname:    DS.attr('string'),
  parkedAt:    DS.attr('date'),
  unParkedAt:  DS.attr('date'),
  priceToPark: DS.attr('number'),
  car:         DS.belongsTo('car'),
  location:    DS.belongsTo('location')
});
