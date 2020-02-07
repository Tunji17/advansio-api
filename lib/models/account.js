const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  number: { type: Number },
  type: { type: String, enum: ['CURRENT', 'SAVINGS'] },
  balance: { type: Number },
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
}, { timestamps: true });

AccountSchema.index({
  owner: 1,
});

// AccountSchema.statics.findByOrganisation = function findByOrg(organisation, projectIds) {
//   return this.find({ organisation, _id: { $in: projectIds }, deletedAt: null });
// };

// AccountSchema.statics.findByProjectId = function findByProject(id) {
//   return this.findOne({ _id: id, deletedAt: null });
// };


module.exports = mongoose.model('Account', AccountSchema);
