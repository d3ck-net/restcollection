import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {Mongo} from 'meteor/mongo';
import {_} from 'meteor/underscore';
import {Converter} from "./Converter";

export class CollectionExtender {

    private _primaryKey:string = "_id";

    public getSchema(type:string):Array<Object> {
        var filters = Converter.convertSimpleSchemaToQueryBuilder(this.simpleSchema(), type);

        if (this.alterFilters) {
            this.alterFilters(filters);
        }

        return filters;
    }

    public setPrimaryKey(newKey:string) {
        this._primaryKey = newKey;
    }

    public getPrimaryKey():string {
        return this._primaryKey;
    }
}

_.extend(Mongo.Collection.prototype, new CollectionExtender());