import {Converter} from './Converter';
import {_} from 'meteor/underscore';
export class CollectionWrapper {
    /**
     * gets the filter schema of a collection be it REST or Mongo
     * @param collection
     * @returns {any}
     */
    public static getSchemaOfCollection(collection) {
        if (collection.getSchema) {
            return collection.getSchema();
        }
        else if (collection.simpleSchema) {
            var filters = Converter.convertSimpleSchemaToQueryBuilder(collection.simpleSchema());

            if (collection.alterFilters) {

                collection.alterFilters(filters);
            }

            return filters;

        }
        else
            return [];
    }


    public static getEditSchemaOfCollection(collection) {
        // if(collection.)
    }

    public static getTableSchemaOfCollection(collection) {
        return this.getSchemaOfCollection(collection);
    }

    public static getfullTextSearchFields(collection):Array<String> {
        var fields = [];
        var schema = this.getTableSchemaOfCollection(collection);

        _.each(schema, function (o, i) {
            fields.push(o.id);
        });

        return fields;
    }
}