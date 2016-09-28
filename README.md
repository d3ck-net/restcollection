The aim of this package is to wrap REST calls to a server in a fashion that it resambles the behaviour of regular MongoDB
collections in the Meteor environment.
While not all behaviour is matched, it is enough to provide an interface to drive the data-list package.

It also tries to incorporate into the infrastructure provided by the packages:

NPM:
mongo-entity

Athmosphere:


usage:
```
import {RESTObject,RESTCollection} from 'meteor/dasdeck:restcollection';

//otpionally create a dedicated RESTObject to add custom methods to your intities
class Hat extends RESTObject
{

}

var Hats = new RESTCollection('/api/hat',Hat);

var hats = Hats.find();
```

api:

RESTCollection.find();