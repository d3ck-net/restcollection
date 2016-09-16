import {RESTCollection} from './RESTCollection';
import {$} from 'meteor/jquery';
import {_} from 'meteor/underscore';

export class RESTObject {

    private collection:RESTCollection;

    constructor(collection:RESTCollection, data:Object) {
        this.collection = collection;
        $.extend(this, data);

        // this._id = (this._id && this._id._str? this._id._str : undefined);
    }

    public save(cb:Function) {
        if(this.isSaved()) {
            $.put(this.collection.getEndPoint(), [this], cb);
        }
        else
        {
            $.post(this.collection.getEndPoint(), [this], cb);
        }
    }
    
    public isSaved()
    {
        return this._id;
    }
    
    
}