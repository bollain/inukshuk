/**
 * Created by paul on 28/03/17.
**/
import 'react-native'
import React from 'react'
import Start from '../Start'
import renderer from 'react-test-renderer'

ti('Renders correctly', () =>{
    const tree = renderer.create(
        <Start />
    ).toJSON();
    expect(tree).toMatchSnapshot();
});