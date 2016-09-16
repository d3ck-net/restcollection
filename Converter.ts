/**
 * Created by jms on 20/08/16.
 */
import {SimpleSchema} from 'meteor/aldeed:simpleschema';
import {_} from 'meteor/underscore';

export class Converter {
    public static convertSimpleSchemaToQueryBuilder(schema:SimpleSchema) {
        const map = {
            'Number': 'double',
            'String': 'string',
            'Date': 'datetime'

        };

        var res = [];
        _.each(schema._schema, function (data, id) {
            res.push({
                id: id,
                label: data.label,
                type: map[data.type.name]
            });
        });

        return res;
    }

}
