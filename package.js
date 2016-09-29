Package.describe({
    name: 'dasdeck:restcollection',
    version: '0.0.1',
    summary: 'a rest service resambling a collection',
    git: '',
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('1.3');
    api.use('ecmascript');
    api.use('barbatus:typescript');

    api.use('jparker:crypto-md5');
    api.use('manuel:reactivearray');
    api.use('aldeed:simple-schema');
    api.use('underscore');
    api.use('jquery');


    api.addFiles('RESTObject.ts');
    api.addFiles('RESTCollection.ts');
    api.addFiles('RESTSearch.ts');
    api.addFiles('Converter.ts');
    api.addFiles('SchemaExtension.ts');
    api.addFiles('CollectionExtender.ts');

    api.addFiles('export.js');

    api.mainModule('export.js');

});

Package.onTest(function (api) {

    // api.use('dasdeck:restcollection');
    // api.use('practicalmeteor:mocha');
    //api.mainModule('test.js');

});
