export function initialize(container, application) {
  application.inject('route', 'backend', 'service:backend');
}

export default {
  name: 'backend',
  initialize: initialize
};
