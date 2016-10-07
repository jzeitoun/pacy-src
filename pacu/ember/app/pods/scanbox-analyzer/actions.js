import Ember from 'ember';
import download from 'pacu/utils/download';

function importROIFileChanged(e) { // `this` is the current route
  const input = e.target;
  const route = this;
  const file = e.target.files[0];
  const fr = new FileReader();
  fr.onload = (e) => {
    const data = JSON.parse(fr.result);
    try {
      data.rois.forEach(r => {
        const roi = route.store.createRecord('roi', r.attrs);
        roi.set('workspace', route.currentModel.workspace);
        roi.save();
      });
    } catch(e) {
      console.log(e);
      this.toast.warning('Invalid file');
    } finally {
      this.toast.info(`${data.rois.length} ROI(s) imported.`);
      $(input).val(null);
    }
  }
  fr.readAsText(file);
}

export default {
  willTransition: function(transition) {
    this.store.unloadAll(); // releasing all data resources. important.
    this.wsx.dnit();
    this.wsx = null;
    $('#roi-import-file').off('change.pacu-roi-import');
  },
  didTransition() {
    Ember.run.schedule('afterRender', () => {
      $('#roi-import-file').on('change.pacu-roi-import', importROIFileChanged.bind(this));
    });
  },
  updateModel(model) {
    return model.save().then(() => {
      const name = model.constructor.modelName;
      const id = model.get('id');
      return this.toast.info(`${name} #${id} updated.`);
    });
  },
  deleteModel(model) {
    return model.destroyRecord().then(() => {
      const name = model.constructor.modelName;
      const id = model.get('id');
      return this.toast.info(`${name} #${id} deleted.`);
    });
  },
  roiClicked(roi) {
    this.currentModel.rois.setEach('active', false);
    roi.set('active', true);
  },
  exportROIs() {
    this.toast.info('Export ROIs...');
    const url = '/api/json/scanbox_manager/rois_exported';
    const name = this.currentModel.name;
    Ember.$.get(url, name).then(data => {
      const ts = +(new Date);
      download.fromByteString(data, `${ts}-${name.io}-${name.ws}-rois.json`, 'application/json');
    });
  },
  importROIs() {
    $('#roi-import-file').click();
  }
}
