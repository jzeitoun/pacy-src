import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('x-layer/roi-manager/circle', 'Integration | Component | x layer/roi manager/circle', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{x-layer/roi-manager/circle}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#x-layer/roi-manager/circle}}
      template block text
    {{/x-layer/roi-manager/circle}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
