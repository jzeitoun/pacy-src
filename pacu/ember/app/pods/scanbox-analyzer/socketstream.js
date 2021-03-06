import Ember from 'ember';
import computed, { on } from 'ember-computed-decorators';

const Image = Ember.Object.extend({
  mpi: false,
  buffer: null,
  curIndex: 0,
  cmap: 'Jet', // added attribute (JZ)
  max: 255, // added to control colormap contrast (JZ)
  min: 0, // added to control colormap contrast (JZ)
  @computed('depth') maxIndex(d) {
    return d - 1;
  },
});

export default Ember.Object.extend({
  print(...fields) { return this.get('wsx').print(...fields); },
  access(...fields) { return this.get('wsx').access(...fields); },
  mirror(...fields) { return this.get('wsx').mirrorTo(this, ...fields); },
  invoke(func, ...args) { return this.get('wsx').invoke(func, ...args); },
  invokeAsBinary(func, ...args) { return this.get('wsx').invokeAsBinary(func, ...args); },
  @computed('ch0Dimension') img(ch) { return Image.create(ch); },
  @on('init') initialize() {
    this.mirror('ch0.dimension', 'ch0.has_maxp');
  },
  // this requests frame from backend (JZ)
  // colormap is determined in backend
  // added cmap argument to select colormap
  requestFrame(index) {
    return this.get('wsx').invokeAsBinary(
        'ch0.request_frame', parseInt(index)).then(buffer => {
      this.set('img.buffer', buffer);
      this.set('img.mpi', false);
    });
  },
  set_cmap(cmap) {
    this.get('wsx').invokeAsBinary(
      'ch0.set_cmap', this.get('img.cmap'))
  },
  set_contrast(min, max) {
    this.get('wsx').invokeAsBinary(
      'ch0.set_contrast', min, max)
  },
  indexChanged: function() {
    this.requestFrame(this.get('img.curIndex'));
  }.observes('img.curIndex'),
  cmapChanged: function() {
    this.set_cmap(this.get('img.cmap')); // added cmap argument JZ
    this.requestFrame(this.get('img.curIndex'));
  }.observes('img.cmap'),
  contrastChanged: function() {
    this.set_contrast(this.get('img.min'), this.get('img.max'));
    Ember.run.debounce(this, () => this.requestFrame(this.get('img.curIndex')), 150);
  }.observes('img.min', 'img.max'),
  @computed() mainCanvasDimension() {
    return { height: 0 };
  },
  overlayMPI() {
    swal({
      title: 'Please specify colormap variables',
      html: `
        <div id="cmap-params" class="ui form">
          <h4 class="ui dividing header">Value range is between 0 and 1</h4>
          <div class="four fields">
            <div class="field">
              <label>X Mid1</label>
              <input type="number" name="xmid1" placeholder="X Mid1" value="0.25">
            </div>
            <div class="field">
              <label>Y Mid1</label>
              <input type="number" name="ymid1" placeholder="Y Mid2" value="0.25">
            </div>
            <div class="field">
              <label>X Mid2</label>
              <input type="number" name="xmid2" placeholder="X Mid2" value="0.75">
            </div>
            <div class="field">
              <label>Y Mid2</label>
              <input type="number" name="ymid2" placeholder="Y Mid2" value="0.75">
            </div>
          </div>
        </div>
      `,
      onOpen: function () {
        $('input[name="xmid1"]').focus();
      }
    }).then(result => {
      const xmid1 = parseFloat($('input[name="xmid1"]').val());
      const ymid1 = parseFloat($('input[name="ymid1"]').val());
      const xmid2 = parseFloat($('input[name="xmid2"]').val());
      const ymid2 = parseFloat($('input[name="ymid2"]').val());
      const cmap = { xmid1, ymid1, xmid2, ymid2 };
      this.get('wsx').invokeAsBinary('ch0.request_maxp', cmap).then(buffer => {
        this.set('img.buffer', buffer);
        this.set('img.mpi', true);
      });
    }).catch(swal.noop)
  },
  requestMPITiff() {
    return this.get('wsx').invokeAsBinary('ch0.request_maxp_tiff');
  }
  // colorMapChanged: function() {
  //   const cmap = this.get('colorMap').toJSON();
  //   this.invoke('channel.update_colormap',
  //     cmap.basename, cmap.xmid1, cmap.ymid1, cmap.xmid2, cmap.ymid2
  //   ).then((data) => {
  //     this.indexChanged();
  //   });
  // }.observes('colorMap.{basename,xmid1,ymid1,xmid2,ymid2}'),
});
