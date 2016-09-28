/**
 * Created by jms on 20/08/16.
 */
import {SimpleSchema} from 'meteor/aldeed:simpleschema';
import {_} from 'meteor/underscore';

export class Converter {
    public static convertSimpleSchemaToQueryBuilder(schema:SimpleSchema, type:string = 'all') {
        const map = {
            'Number': 'double',
            'String': 'string',
            'Date': 'datetime'

        };

        var res = [];
        var all = [];
        _.each(schema._schema, function (data, id) {
            var field = {
                id: id,
                label: data.label,
                type: map[data.type.name]
            };

            all.push(field)
            if(data.autoForm && data.autoForm.viewSets && (data.autoForm.viewSets[type] || data.autoForm.viewSets['all'])) {
                res.push(field);
            }
        });

        return res.length ? res : all;
    }

}
