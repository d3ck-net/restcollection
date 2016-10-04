import {RESTObject} from './RESTObject';
import {RESTSearch} from './RESTSearch';
import {Tracker} from 'meteor/tracker';
import {ReactiveVar} from 'meteor/reactive-var';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {_} from 'meteor/underscore';
import {$} from 'meteor/jquery';
import {CollectionExtender} from "./CollectionExtender";
/**
 * the RESTCollection is a class to mimic the behaviour of Mongo Collections for REST calls.
 * there is of course no reactivity when it comes to changes on the data on the server
 */
export class RESTCollection extends CollectionExtender {

    private _name:string;
    private _endpoint:string;
    private _schema:ReactiveVar;
    private _count:ReactiveVar = new ReactiveVar(1000);


    private _type:Function;
    private _preFilter:Object;
    private _preLimit:Object;

    private _collectionDependency:Tracker.Dependency = new Tracker.Dependency();
    private _preSettingsDependency:Tracker.Dependency = new Tracker.Dependency();
    private _lastPrefilter:string;

    /**
     *
     * @param endpoint the url to your rest endpoint
     * @param type options type to create entities from (must inherit RESTObject)
     */
    constructor(endpoint:string, type?:Function) {
        this._endpoint = endpoint;
        this._type = type ? type : RESTObject;

        this._schema = new ReactiveVar();

        this._name = this._type.name + 's';

    }

    /**
     * set an additional filter that will be added to all find, findOne and count calls.
     * this is similar to filtering on a subscritpion
     * @param search
     * @param limit
     */
    public setPreFilter(search:Object, limit:Object) {

        this._preFilter = search ? search : this._preFilter;
        this._preLimit = limit ? limit : this._preLimit;

        var preFitlerString = JSON.stringify([this._preFilter, this._preLimit]);

        if (this._lastPrefilter !== preFitlerString) {
            this._lastPrefilter = preFitlerString;
            this._preSettingsDependency.changed();
        }
    }

    /**
     * returns the REST endpoint set while construction
     * @returns {string}
     */
    public getEndPoint():string {
        return this._endpoint;
    }

    /**
     * this method is called when an entity is retireved from the server
     * this will transform the entity to its specific type or RESTObject if no type is set
     * @param data
     * @returns {RESTObject}
     */
    protected transform(data:Object):RESTObject {

        var restObject = new this._type(this, data);
        return restObject;
    }


    /**
     * this will get the constructor for a type name
     * @param name
     * @returns {any}
     */
    public static getTypeFromName(name) {
        var type = window[name.substr(1)];
        return type;
    }

    /**
     * attach a SimpleSchema to this collection
     * this is supposed to behave similar ot this package:
     * https://github.com/aldeed/meteor-simple-schema
     * @param schema
     */
    public attachSchema(schema:SimpleSchema) {
        this._schema.set(schema);
    }

    /**
     * returns the currently attached SimpleSchema
     * @returns {SimpleSchema}
     */
    public simpleSchema():SimpleSchema {
        return this._schema.get();
    }

    /**
     * this will return the total count of entires in this collection
     * @see also preFilter
     *
     * @param filter
     * @returns {Number}
     */
    public count() {
        this._preSettingsDependency.depend();
        return this._count.get();
    }

    /**
     *
     */
    public collectionChanged() {
        this._collectionDependency.changed();
        this.searches = {};
    }

    /**
     * this is supposed to mimic the insert function of:
     * http://docs.meteor.com/api/collections.html#Mongo-Collection-insert
     * @param data
     * @param callback
     */
    public insert(data:Object, callback?:Function) {
        var self = this;
        $.post(this.getEndPoint(), (data), function (data) {

            self.collectionChanged();
            if (callback) {
                callback(null, data);
            }
        }).fail(function () {
            if (callback) {
                callback("error");
            }
        });
    }

    /**
     * this is supposed to mimic the update function of:
     * http://docs.meteor.com/api/collections.html#Mongo-Collection-update
     * @param selector
     * @param modifier
     * @param options
     * @param callback
     */
    public update(selector:Object, modifier:Object, options?:Object, callback?:Function) {
        var self = this;

        $.put(this.getEndPoint(), ({selector: selector, modifier: modifier, options: options}), function (data) {
            self.collectionChanged();

            if (callback) {
                callback(null, data);
            }
        }).fail(function () {
            if (callback) {
                callback('error');
            }
        });

    }

    /**
     *
     * this is supposed to mimic the remove function of:
     * http://docs.meteor.com/api/collections.html#Mongo-Collection-remove
     * @param selector
     * @param callback
     * @returns {RESTObject}
     */
    public remove(selector:Object, callback?:Function) {
        var self = this;

        $.delete(this.getEndPoint(), ({selector: selector}), function (data) {
            self.collectionChanged();

            if (callback) {
                callback();
            }
        }).fail(function () {
            if (callback) {
                callback('error');
            }
        });
    }

    /**
     * this is supposed to mimic the find function of:
     * http://docs.meteor.com/api/collections.html#Mongo-Collection-find
     *
     * @param filter
     * @param limit
     * @returns {ReactiveArray}
     */
    public find(filter?:Object, limit?:Object):ReactiveArray {

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

    /**
     *
     * this is supposed to mimic the findOne function of:
     * http://docs.meteor.com/api/collections.html#Mongo-Collection-findOne
     * @param filter
     * @param limit
     * @returns {RESTObject}
     */
    public findOne(filter:Object, limit:Object) {
        var res = this.find(filter, limit);
        return res[0];
    }


    /**
     * maps results from the server to a proper result array
     * @param data
     * @returns {Object}
     */
    protected mapDataResult(data:Object) {
        return data;
    }


    private searches:Object = {};
}
