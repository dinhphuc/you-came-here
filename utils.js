class Util {
    static replaceTemplateWithParams(template, params) {
        let replaced = template || '';

        Object.entries(params || {}).forEach(([key, val]) => {

            if (params.hasOwnProperty(key)) {
                replaced = replaced.replace(new RegExp(`{{${key}}}`, 'g'), val !== null ? val : '');
            }
        });
        return replaced;
    }
}
module.exports = Util;