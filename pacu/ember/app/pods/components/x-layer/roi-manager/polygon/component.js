import Ember from 'ember';
import computed from 'ember-computed-decorators';
import interaction from 'pacu/utils/interaction';
// this controls ROI polygon attributes (e.g. fill opacity) (JZ)
export default Ember.Component.extend({
  tagName: 'polygon',
  classNames: ['focus-responder'],
  classNameBindings: ['roi.active'],
  attributeBindings: ['points', 'style'],
  @computed('color') style(c) {
    return Ember.String.htmlSafe(`stroke: ${c}; fill: ${c}; fill-opacity: 0;`);
  },
  @computed('roi.polygon.@each.{x,y}') points(pg=[]) {
    return pg.map(p => `${p.x},${p.y}`).join(' ');
  },
  mouseDown(e) {
    const $target = this.parentView.$();
    const polygon = this.get('roi.polygon');
    return interaction.bindOnce.call(this, $target, e, polygon);
  },
  leaving() { return this.get('onPolygonDoubled')(); },
  moving(origin, offset, polygon) {
    const dest = polygon.map(p => { return {
      x: p.x - (origin.x - offset.x),
      y: p.y - (origin.y - offset.y)
    };});
    this.set('roi.polygon', dest);
  },
//  movingWithout() {
//    console.log('move polygon with', ...arguments);
//  },
//  movingWith() {
//    console.log('move polygon with', ...arguments);
//  },
  moved() { this.get('onPolygonUpdated')(); },
  shot() { this.get('onPolygonDeleted')(); },
  poked() { this.get('onPolygonClicked')(this); },
  click() { return false; },
  focusHit() { }
});
