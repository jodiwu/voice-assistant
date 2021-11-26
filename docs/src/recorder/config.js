import locales from './locales.json';

const defaultConfig = {
  color: '#333',
  tipPosition: 'top',
  tipTextColor: '#f2f2f2',
  tipBackgroundColor: '#4b667d',
  tipShadowColor: 'rgba(0,0,0,.1)',
  interactiveMode: 'press',
  returnMode: 'increment',
  language: 'zh_cn',
  vad_eos: 3000
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  props: {
    appId: 'g9c0a6d5',
    apiKey: '474a8a7f0b333903e40b33505052f14a',
    apiSecret: '9408d43cde1959965dab66552eecf8dc',
    language: 'en_us',
    accent: 'mandarin',
    pd: '',
    rlang: 'zh_cn',
    ptt: 1,
    nunum: 1,
    vad_eos: 10000
  },
  methods: {
    getConfig (key) {
      if (!this.IATConfig) this.IATConfig = {}
      return this[key] || this.IATConfig[key] || defaultConfig[key]
    }
  },
  computed: {
    pressMode () {
      return this.getConfig('interactiveMode') !== 'touch'
    },
    touchMode () {
      return this.getConfig('interactiveMode') === 'touch'
    },
    incrementMode () {
      return this.getConfig('returnMode') === 'increment'
    },
    completeMode () {
      return this.getConfig('returnMode') === 'complete'
    },
    locale () {
      const locale = locales[this.getConfig('language')]
      return locale
    }
  }
}