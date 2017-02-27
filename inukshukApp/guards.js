import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Navigator,
} from 'react-native';

/*import * as EmailValidator from 'email-validator';*/

export default class Guards extends Component {

    validateNotEmpty(input) {
        return input === "";
    }

    validateAccountInfo(userName, fName, lName, email, phoneNumber) {

        var validUserName = validateNotEmpty(userName);
        var validFname = validateNotEmpty(fName);
        var validLname = validateNotEmpty(lName);

        var validNumber = true ;
        return validUserName && validFname && validLname  && validNumber;
    }

}