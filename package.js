Package.describe({
    name: 'dasdeck:restcollection',
    version: '0.0.1',
    // Brief, one-line summary of the package.
    summary: 'a rest service resambling a collection',
    // URL to the Git repository containing the source code for this package.
    git: '',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('1.3');
    api.use('ecmascript');
    api.use('meteortypescript:compiler');

    api.use('jparker:crypto-md5');
    api.use('aldeed:simple-schema');
    api.use('underscore');
    api.use('jquery');


    api.addFiles('RESTObject.ts');
    api.addFiles('RESTCollection.ts');
    api.addFiles('RESTSearch.ts');
    api.addFiles('Converter.ts');
    api.addFiles('export.js');

    api.mainModule('export.js');


    // api.export('RESTObject');
    // api.export('RESTCollection');

    // api.mainModule('RESTCollection.ts');
    // api.mainModule('RESTSearch.ts');
    // api.mainModule('Converter.ts');
});

Package.onTest(function (api) {
    //api.use('ecmascript');
    //api.use('tinytest');
    //api.use('mongo-object');
    //api.addFiles('mongo-object-tests.js');
});
