import {RESTCollection} from './RESTCollection';
import {$} from 'meteor/jquery';
import {_} from 'meteor/underscore';

/**
 * base object to 
 */
export class RESTObject {

    private collectionName:RESTCollection;

    /**
     *
     * @param collection
     * @param data
     */
    constructor(collection:RESTCollection, data:Object) {
        this.collectionName = collection._name;
        $.extend(this, data);


        this.saveDebounced = _.debounce(this.save,100);

    }

    /**
     * returns the data of this object as a plain Object, removing internal references
     * @returns {{}}
     */
    public getData() {
        var data = {};
        var self = this;
        _.each(this.getCollection().simpleSchema()._schema, function (o, name) {

            if (self[name] !== undefined && name !== self.getIdKey()) {
                data[name] = self[name];
            }
        });

        // data[this.getIdKey()] = this.getId();

        return data;
    }

    /**
     *
     * @returns {RESTCollection}
     */
    public getCollection():RESTCollection {
        return window[this.getCollectionName()];
    }

    /**
     *
     * @returns {RESTCollection}
     */
    public getCollectionName():string
    {
        return this.collectionName;
    }

    /**
     * the key on witch this collection is referenced / indexed by
     * @returns {string}
     */
    public getIdKey():string {
        return "_id"
    }

    /**
     * stores the current state of the object to the server
     * @param cb
     */
    public save(cb?:Function) {

        var data = this.getData();

        if (this.isSaved()) {
            this.getCollection().update(this.getId(),data,{},cb);
        }
        else {
            this.getCollection().insert(data,cb);
        }
    }

    /**
     *
     * @returns {any}
     */
    public getId() {
        return this[this.getIdKey()];
    }

    /**
     *
     * @returns {boolean}
     */
    public isSaved() {
        return this.getId() !== undefined;
    }

}