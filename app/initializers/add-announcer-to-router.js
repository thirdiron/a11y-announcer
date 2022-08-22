
import { later, cancel } from '@ember/runloop';
import { inject as service } from '@ember/service';
import Router from '../router';

export default {
  name: 'add-announcer-to-router',

  initialize() {

    Router.reopen({
      announcer: service('announcer'),
      intl: service('intl'),

      didTransition() {
        this._super(...arguments);

        this._timerId = later(() => {
          if (this.isDestroying || this.isDestroyed) { return; }

          let pageTitle = document.title.trim();
          let serviceMessage = this.get('announcer.message');
          // Upstream a11y-announcer allowed for customizing the end of the announcement message
          // via announcer.message, we'll just leave any customization to the ember-intl translations
          // file.
          let message = this.get('intl').t(`route_announcement`, {pageTitle});

          this.get('announcer').announce(message, 'polite');
        }, 100);
      },

      willDestroy() {
        cancel(this._timerId);
        this._super();
      }
    });

  }
};
