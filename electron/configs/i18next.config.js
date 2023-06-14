const i18n = require('i18next');
const i18nextBackend = require('i18next-fs-backend');
const path = require('path');

const i18nextOptions = {
    fallbackLng: 'en',
    supportedLngs: ['ru', 'en'],
    ns: 'translation',
    backend: {
        // path where resources get loaded from
        loadPath: path.join(__dirname, '../../locales/{{lng}}/{{ns}}.json'),

        // path to post missing resources
        addPath: path.join(__dirname, '../../locales/{{lng}}/{{ns}}.missing.json'),

        // jsonIndent to use when storing json files
        jsonIndent: 2
    },
    interpolation: {
        escapeValue: false
    },
    saveMissing: true,
    react: {
        wait: false
    }
};

i18n.use(i18nextBackend);

// initialize if not already initialized
if (!i18n.isInitialized) {
    i18n.init(i18nextOptions);
}

module.exports = i18n;
