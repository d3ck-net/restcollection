import {SimpleSchema} from 'meteor/aldeed:simple-schema';
import {Mongo} from 'meteor/mongo';
import {_} from 'meteor/underscore';
import {Converter} from "./Converter";

export class CollectionExtender {


    public getSchema(type:string):Array<Object> {
        var filters = Converter.convertSimpleSchemaToQueryBuilder(this.simpleSchema(), type);

        if (this.alterFilters) {
            this.alterFilters(filters);
        }

        return filters;
    }
}

_.extend(Mongo.Collection.prototype, new CollectionExtender());