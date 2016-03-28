import Ember from 'ember';

function upsertROI(roi) {
  const data = roi.getProperties(
    'polygon', 'neuropil', 'id', 'invalidated', 'npEnabled');
  this.get('wsx').invoke('upsert_roi', data).then(data => {
    roi.setProperties(data);
  });
}
export default {
  didTransition() {
    this.controllerFor('application').set(
      'current-feature', 'Scanimage Data Analysis');
  },
  willTransition: function(transition) {
    this.wsx.dnit();
    this.wsx = null;
  },
  fetchROI(roi) {
    if (roi.get('busy')) { return; }
    roi.set('busy', true);
    return this.get('wsx').invoke('make_response', roi.get('id')).gateTo(
      this.currentModel, 'roiFetching'
    ).then(data => {
      roi.setProperties(data);
      roi.setProperties({error: null});
    }).catch(err => {
      this.toast.error(err.title, err.detail);
      roi.set('error', err);
    }).finally(() => {
      roi.set('busy', false);
    });
  },
  insertROI(rois, roi) {
    upsertROI.call(this, rois.pushObject(roi));
  },
  updateROI(roi) {
    roi.invalidate();
    upsertROI.call(this, roi);
  },
  updateAndFetchROI(roi) {
    this.send('updateROI', roi);
    this.send('fetchROI', roi);
    roi.toggleProperty('active');
  },
  removeROI(rois, roi) {
    rois.removeObject(roi);
    if (Ember.isPresent(roi.id)) {
      this.get('wsx').invoke('session.roi.remove', roi.id);
    }
  },
  deriveROI(rois, roi) {// derive makes original ROI primitive state.
    return rois.pushObject(roi.derive());
  },
  exclToggleROI(rois, roi) {
    for (let one of rois) {
      if (Em.isEqual(one, roi)) {
        if (roi.toggleProperty('active')) {
          if (one.get('invalidated')) {
            this.send('fetchROI', roi);
          }
        }
      } else {
        one.set('active', false);
      }
    }
  },
  exclActivateROI(rois, roi) {
    for (let one of rois) {
      if (Em.isEqual(one, roi)) {
        roi.set('active', true);
        if (roi.get('invalidated')) {
          this.send('fetchROI', roi);
        }
      } else {
        one.set('active', false);
      }
    }
  },
  insertPoint(roi, point) {
    const newPoint = {x: point.x, y: point.y};
    roi.polygon.insertAt(roi.polygon.indexOf(point), newPoint);
    return newPoint;
  },
  removePoint(roi, point) {
    roi.polygon.removeObject(point);
    this.send('updateROI', roi);
  },
  cancelPoint(roi, point) {
    roi.polygon.removeObject(point);
  },
  openROIModal(rois, roi) {
    this.currentModel.set('roiOnDetail', roi);
    Ember.run.later(this, 'send', 'exclActivateROI', rois, roi, 500);
  },
  sfrequencyIndexChanged(index) {
    this.get('wsx').invoke('set_sfrequency_index', index).then(data => {
      const roi = this.currentModel.get('curROI');
      this.currentModel.get('rois').forEach(roi => roi.invalidate());
      if (Ember.isPresent(roi)) {
        roi.set('active', true);
        this.send('fetchROI', roi);
      }
    });
  }
}
