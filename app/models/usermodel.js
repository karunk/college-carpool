var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;
var bcrypt          = require('bcrypt-nodejs');
 
var UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
    },
    rollno: {
        type: String,
        required: true
    },
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'College'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    carpoolers: [{
      addedAt: {type: Date, default: Date.now},
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }],
    carpool_requests: [{
      request_sent: {type: Boolean},
      read: {type: Boolean},
      addedAt: {type: Date, default: Date.now},
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }],
    isAdmin: {
      type: Boolean,
      default: false
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    geo : {
      type: [Number],
      index: '2d'
    },
    isVehicleOwner: {
      type: Boolean,
      default: false
    },
    vehicleCapacity: {
      type: Number,
      default: 0
    }

});
UserSchema.index({rollno:1, college:1}, { unique: true });
UserSchema.pre('save', function(callback) {
  var user = this;

  // Break out if the password hasn't changed
  if (!user.isModified('password')) return callback();

  // Password changed so we need to hash it
  bcrypt.genSalt(5, function(err, salt) {
    if (err) return callback(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return callback(err);
      user.password = hash;
      callback();
    });
  });


});

UserSchema.methods.comparePassword = function(password) {
    var user = this;

    return bcrypt.compareSync(password, user.password);
};

module.exports = mongoose.model('User', UserSchema);






