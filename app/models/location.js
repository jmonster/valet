import DS from 'ember-data';

export default DS.Model.extend({
  xCoord: DS.attr('number'),
  yCoord: DS.attr('number')
});
