
// stores the mocked apiCalls

const existingUser = {
  id: 30,
  firstName: 'John',
  lastName: 'McAfee',
  email: 'jmcafee@mcafee.com',
  phoneNumber: '3710011111'
 };

const newUser = {
 id: 1000,
 firstName: 'Ashley',
 lastName: 'Mandison',
 email: 'amadison@am.com',
 phoneNumber: '8188328876'
 };

// mocked updateUser that gives back a fake promise
export default function updateUser(user) {
  return new Promise((resolve, reject) => {
    const userId = user.id;
    process.nextTick (
    () => (userId === existingUser.id) ? resolve(existingUser): reject({ error: 'Can not reach server'})
    )}
    )
  }