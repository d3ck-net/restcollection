import {SimpleSchema} from 'meteor/aldeed:simple-schema';

/**
 * this class provides convenient methods to process schemas
 */
class SchemaExtension {

    /**
     * sets field visibility for a given context
     * predefined contets are: table, edit, add
     * @param fields
     * @param view
     * @param visible
     */
    public setFieldVisiblity(fields:Array<string|Object>, view:string, visible:boolean = true) {
        let schema:SimpleSchema = this._schema;
        // debugger;
        _.each(fields, function (field, index) {

            let fieldName = field;
            let type = "string";

            if (typeof fieldName !== "string") {
                fieldName = fieldName.name;
            }

            let fieldData = schema[fieldName];

            if (fieldData) {
                if (!fieldData.autoForm) {
                    fieldData.autoForm = {};
                }
                else if (fieldData.autoForm.type) {
                    type = fieldData.autoForm.type;
                }

                if (!fieldData.autoForm.viewSets) {
                    fieldData.autoForm.viewSets = {};
                }

                if (field.type) {
                    type = field.type;
                }

                fieldData.autoForm.viewSets[view] = type;
            }
        });
    }
}

_.extend(SimpleSchema.prototype, new SchemaExtension());