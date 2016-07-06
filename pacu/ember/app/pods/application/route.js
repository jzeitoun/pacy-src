import Ember from 'ember';

export default Ember.Route.extend({
  actions: {
    toggleFullscreen() {
      this.fullscreen.toggle();
    },
    toastInfo(title, detail) {
      this.toast.info(detail, title);
    },
    toastWarning(title, detail) {
      this.toast.warning(detail, title);
    }
  },
  model() {
    return Ember.Object.create({
      routes: [
        {
          content: 'Andor Camera Controller',
          linkTo: 'andor',
          icon: 'camera',
        },
        {
          content: 'Scanimage Data Controller',
          linkTo: 'sci-analyses',
          icon: 'crosshairs',
        },
        {
          content: 'Scanbox Data Controller',
          linkTo: 'sbx-analyses',
          icon: 'cube',
        },
        {
          content: 'Trajectory Data Controller',
          linkTo: 'trj-analyses',
          icon: 'paw',
        },
        {
          content: 'PsychoPy Controller',
          linkTo: 'psychopy',
          icon: 'unhide',
        },
      ]
    })
  }
});