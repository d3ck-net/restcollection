import {RESTCollection} from './RESTCollection';
import {CyptoJS} from 'meteor/jparker:crypto-md5';

/**
 * internal class to handle RESTCollection searches
 */
export class RESTSearch {
    private data:Object;
    private collection:RESTCollection;

    private running:boolean;
    private _limit:Object;
    private cursor:ReactiveArray;

    /**
     *
     * @param collection
     * @param data
     * @param limit
     */
    constructor(collection:RESTCollection, data:Object, limit:Object) {
        this.collection = collection;
        this.data = data;
        this.running = false;
        this.cursor = new ReactiveArray();
        this._limit = limit;
    }

    /**
     *
     * @returns {any}
     */
    public getHash():string {
        return CryptoJS.MD5(JSON.stringify({search: this.data, limit: this._limit}));
    }

    /**
     * 
     * @param cb
     * @returns {any}
     */
    public execute(cb?):ReactiveArray {

        var self = this;
        if (!this.running) {

            this.running = true;

            $.get(this.collection.getEndPoint(), ({search:this.data,limit:this._limit}), function (data) {

                data = self.collection.mapDataResult(data);
                self.cursor.clear();
                self.collection._count.set(data.count ? data.count : data.data.length);
                $.each(data.data, function (i, o) {
                    
                    
                    var data = self.collection.transform(o);
                    self.cursor.push(data);
                });
                if (cb) {
                    cb(self.cursor);
                }

                //self.running = false;
            }, 'json');
        }

        return self.cursor.list();
    }
}
