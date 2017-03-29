import * as user from '../User';
import * as signup from '../SignUp';

jest.mock('../../scripts/apiCalls');

// test updateUser()
it ('works with promise',  ()=> {
  return expect(user.updateUser()).resolves.toEqual({
   id: 30,
   firstName: 'John',
   lastName: 'McAfee',
   email: 'jmcafee@mcafee.com',
   phoneNumber: '3710011111'
  });
 })

// test createUser()