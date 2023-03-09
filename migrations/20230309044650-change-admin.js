const ObjectId = require('mongodb').ObjectId; 
module.exports = {
  async up(db, client) {
    // TODO write your migration here.
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
    await db.collection('usermodels').updateOne({_id: ObjectId("63fc79d60c09fbb2a4fed174")}, {$set: { role: "admin"}});
    console.log('migration is up')
  },

  async down(db, client) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    await db.collection('usermodels').updateOne({_id: ObjectId("63fc79d60c09fbb2a4fed174")}, {$set: { role: 'user'}});
    console.log('migration is down');
  }
};
