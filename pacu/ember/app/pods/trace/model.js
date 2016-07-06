import Ember from 'ember';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  created_at: attr('epoch'),
  array: attr(),
  color: attr('string'),
  category: attr('string'),
  roi: belongsTo('roi'),
  action(name, ...args) {
    if (this.get('inAction')) { return; }
    this.set('inAction', true);
    const prom = this.actions[name].apply(this, args).finally(() => {
      this.set('inAction', false);
    });
  },
  actions: {
    fetch() {
      return this.store.createRecord('action', {
        model_name: 'Trace',
        model_id: this.id,
        action_name: 'refresh',
      }).save().then((data) => {
        this.reload();
      });
    }
  }
});