// your-awesome-utility.js
// fastify.decorate('co')
// module.exports = (domain) => {
//     if (domain.equals === 'google.com') return '216.58.207.238';
//     return '';
//   }
fastify.decorate('conf', {
    db: 'some.db',
    port: 3000
  })