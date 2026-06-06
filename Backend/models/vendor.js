const mongoose = require('mongoose')


const vendorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    businessName: {
        type: String,
        required: true
    },
     businessType:{
        type: String,
        required: true
     },

  experience: {
        type: String
    },

  address: {
        type: String,
        required: true
    },
  city: {
        type: String,
        required: true
    },
  state: {
        type: String,
        required: true
    },
  pincode: {
        type: String,
        required: true
    },

  aadhaarNumber: {
        type: String,
        // required: true
    },
  panNumber: {
        type: String,
        // required: true
    },

  aadhaarImage: {
        type: String,
        required: true
    },
  panImage: {
        type: String,
        required: true
    },

  status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
        required: true
    }, 
    radius: {
        type: Number,
        default: 10,
        
    }
},
{
    timestamps: true,
}

)

module.exports = mongoose.model('Vendor', vendorSchema)