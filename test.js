import {RESTCollection} from './RESTCollection';

describe('RESTCollection', function () {
    describe('getEndPoint()', function () {
        it('should return the proper endpoint', function () {
            var collection = new RESTCollection('Test');
            var endPoint = collection.getEndPoint();

            chai.assert(endPoint === "Test", "endpoint should be as in constructor");
            // expect(endPoint).toBe("Test");
        });
    });
});