Package.describe({
    name: 'dasdeck:restcollection',
    version: '0.0.1',
    summary: 'a rest service resambling a collection',
    git: '',
    documentation: 'README.md'
});

var pack = function (api) {
    api.versionsFrom('1.3');

    api.use('underscore');
    api.use('jquery');
    
    api.use('reactive-var@1.0.10');

    api.use('ecmascript@0.5.8');
    api.use('barbatus:typescript@0.4.1');

    api.use('jparker:crypto-md5@0.1.1');
    api.use('aldeed:simple-schema@1.5.3');


    api.addFiles('RESTObject.ts');
    api.addFiles('RESTCollection.ts');
    api.addFiles('RESTSearch.ts');
    api.addFiles('Converter.ts');
    api.addFiles('SchemaExtension.ts');
    api.addFiles('CollectionExtender.ts');

    api.addFiles('export.js');

    api.mainModule('export.js');

};
Package.onUse(pack);

Package.onTest(function (api) {

    pack(api);
    
    api.use('practicalmeteor:mocha@2.4.5_6');
    api.use('practicalmeteor:chai@2.1.0_1');
    api.mainModule('test.js');

});
