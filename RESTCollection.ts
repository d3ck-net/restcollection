import {RESTObject} from './RESTObject';
import {RESTSearch} from './RESTSearch';
import {Converter} from './Converter';
import {Tracker} from 'meteor/tracker';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {_} from 'meteor/underscore';
import {$} from 'meteor/jquery';

export class RESTCollection {

    private _name:string;
    private _endpoint:string;
    private _schema:ReactiveVar;
    private _count:ReactiveVar = new ReactiveVar(1000);

    private _searchSchema:Array<Object>;
    private _type:Function;
    private _preFilter:Object;
    private _preLimit:Object;
    private _tableSchema:Array<Object>;

    private _collectionDependency:Tracker.Dependency = new Tracker.Dependency();
    private _preSettingsDependency:Tracker.Dependency = new Tracker.Dependency();
    private _lastPrefilter:string;

    // static  
    constructor(endpoint:string, type:Function) {
        this._endpoint = endpoint;
        this._type = type ? type : RESTObject;

        this._schema = new ReactiveVar();

        this._name = type.name + 's';

        // RESTCollection.collections[]
    }

    public setPreFilter(search:Object, limit:Object) {


        this._preFilter = search ? search : this._preFilter;
        this._preLimit = limit ? limit : this._preLimit;

        var preFitlerString = JSON.stringify([this._preFilter, this._preLimit]);

        if (this._lastPrefilter !== preFitlerString) {
            this._lastPrefilter = preFitlerString;
            this._preSettingsDependency.changed();
        }
    }

    public getEndPoint():string {
        return "/API/" + this._endpoint;
    }

    public transform(data:Object) {

        var restObject = new this._type(this, data);
        return restObject;
    }

    public simpleSchema():SimpleSchema {
        return RESTCollection.convertApiToSimpleSchema(this._schema.get());
    }

    public getSchema():Array<Object> {
        var filters = Converter.convertSimpleSchemaToQueryBuilder(this.simpleSchema());

        if (this.alterFilters) {
            this.alterFilters(filters);
        }

        return filters;
    }

    public setAPISchema(data:Object) {
        this._schema.set(data);
    }

    public getTableSchema():Array<Object> {
        if (this._tableSchema) {
            return this._tableSchema;
        }

    }

    public setSearchSchema(data:Array<Object>) {
        this._searchSchema = data;
    }

    public getSearchSchema():Array<Object> {
        return this._searchSchema ? this._searchSchema : this.getTableSchema();
    }


    public setTableSchema(data:Array) {
        var res = [];
        _.each(data, function (data, i) {

            if (typeof data === 'string') {
                data = {id: data, label: data};
            }
            res.push(data)
        });

        this._tableSchema = res;
    }

    public static getTypeFromName(name) {
        var type = window[name.substr(1)];

        return
    }

    public static convertApiToSimpleSchema(data:Object):SimpleSchema {
        const map = {
            'INT': Number,
            'TEXT': String,
            'BIGTEXT': String,
            'DATETIME': Date
        }

        var res = {};

        _.each(data.Fields, function (field, i) {
            // debugger;

            var type = map[field.Type];
            var data = {
                type: type ? type : String,
                label: field.Description ? field.Description : field.NameDbField,
                optional: true
            }

            if (field.Parent) {
                var type = RESTCollection.getTypeFromName(field.Parent.Class);
                if (type && type instanceof RESTCollection) {

                }
            }

            res[field.NameDbField] = data;

        });

        return new SimpleSchema(res);
    }


    public count(filter:Object) {
        this._preSettingsDependency.depend();

        return this._count.get();
    }

    public insert(data:Object, callback:Function) {
        var self = this;
        $.post(this.getEndPoint(), data, function (data) {

            self._collectionDependency.changed();
            if (callback) {
                callback(null, data);
            }
        }).fail(function () {
            if (callback) {
                callback("error");
            }
        });

    }

    public find(filter:Object, limit:Object) {

        this._preSettingsDependency.depend();
        this._collectionDependency.depend();

        var filterer = filter ? filter : this._preFilter;
        var limiter = limit ? limit : this._preLimit;

        if (this._preFilter && search) {
            _.extend(filterer, this._preFilter)
        }

        if (this._preLimit && limit) {
            _.extend(limiter, this._preLimit);
        }

        var search = new RESTSearch(this, filterer, limiter);
        var hash = search.getHash();

        if (!this.searches[hash]) {
            this.searches[hash] = search;
        }

        return this.searches[hash].execute();
    }

    public findOne(filter:Object, limit:Object) {
        var res = this.find(filter, limit);
        return res[0];
    }

    private searches:Object = {};
}
