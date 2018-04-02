import zh from './zh_CN'

class Strings {
    constructor() {
        this.setLocale('zh-CN')
        this.getLocalStrings()
    }

    getLocalStrings() {
        // const language = navigator.language || navigator.browserLanguage;
    }

    setLocale(locale) {
        if (locale === 'en-US') {
            this.locale = 'en-US'
            this.stringSet = en
        } else {
            this.locale = 'zh-CN'
            this.stringSet = zh
            this.currency = 'CNY'
        }
    }

    getLocale() {
        return this.locale
    }

    getString(key) {
        return this.stringSet[key] || key
    }

    getCurrency(value) {
        return value.toLocaleString(this.locale, {style: 'currency', currency: this.currency})
    }
}

const strings = new Strings()
export default strings