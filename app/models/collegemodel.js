var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;
 
var CollegeSchema = new Schema({
    collegename: {
      type: String,
      required: true
    },
    students: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    geo : {
      type: [Number],
      index: '2d'
    }
});




module.exports = mongoose.model('College', CollegeSchema);






















