import {RESTCollection} from './RESTCollection';
import {CyptoJS} from 'meteor/jparker:crypto-md5';

export class RESTSearch {
    private data:Object;
    private collection:RESTCollection;

    private running:boolean;
    private _limit:Object;
    private cursor:ReactiveArray;

    constructor(collection:RESTCollection, data:Object, limit:Object) {
        this.collection = collection;
        this.data = data;
        this.running = false;
        this.cursor = new ReactiveArray();
        this._limit = limit;
    }

    public getHash():string {
        return CryptoJS.MD5(JSON.stringify({search: this.data, limit: this._limit}));
    }

    public execute(cb?):ReactiveArray {

        var self = this;
        if (!this.running) {

            this.running = true;

            $.get(this.collection.getEndPoint(), {search:this.data,limit:this._limit}, function (data) {
                self.cursor.clear();
                self.collection._count.set(data.count);
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
