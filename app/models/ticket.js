import DS from 'ember-data';

export default DS.Model.extend({

  message:  DS.attr('string'),
  price:    DS.attr('number'),
  dueBy:    DS.attr('date'),   // 2014-05-27T12:54:01
  penalty:  DS.attr('number'), // additional cost if delinquent
  car:      DS.belongsTo('car'),  // offending car
  location: DS.belongsTo('location')
});
