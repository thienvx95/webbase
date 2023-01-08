module.exports = {
  async up(db, client) {
    await db
      .collection('roles')
      .insertOne({
        _id: 'Test',
        description: 'Test',
        isActive: true,
        roleType: 'Admin',
      });
  },

  async down(db, client) {
    await db.collection('roles').deleteOne({ _id: 'Test' });
  },
};
