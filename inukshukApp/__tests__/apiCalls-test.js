import { localIp, handleErrors, loginMock, createUser, updateUser, postTrip, cancelTrip, completeTrip, extendTrip} from '../scripts/aipCalls.js';

var fetchMock = require('fetch-mock');
var makeRequest = require('./make-request');