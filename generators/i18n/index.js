const path = require('path'),
    requiredPath = require('required-path');

function generateI18n(langs, files) {
    const strLang = (file, lang) => `
        if (process.env.BEM_LANG ? process.env.BEM_LANG === '${lang}' : 'ru' === '${lang}') {
            return core()
                .decl(require('${requiredPath(path.join(file.path, lang))}'))
                    ('${file.cell.entity.id}');
        }`;
    return files
        .reduce((acc, file) => {
            return acc.concat(langs.map(lang => strLang(file, lang)));
        }, [
            '(function() {',
            `var core = require('${requiredPath(path.join(__dirname, "core"))}');`
        ])
        .concat([
            'process.env.BEM_LANG?',
            'console.error(\'bemLoader option langs should include\', "\'" + process.env.BEM_LANG + "\'"):',
            'console.error(\'Define process.env.BEM_LANG\');',
            'return function(){};\n})()'
        ])
        .join('\n');
}

module.exports = {
    generate : function(langs) {
        return generateI18n.bind(null, langs);
    }
};
