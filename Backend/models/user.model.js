const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    phoneNumber:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['organizer' , 'attendee'],
        default:'attendee'
    },
    fcmToken: {
        type: String,
    },
    profile:{
        profilePhoto: {
            type: String,
            default: ""
        },
        bio: {
            type: String,
            maxlength: 300,
            default: ""
        },
        interests: [{
            type: String
        }],
    },
    savedEvents:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Event"
        }
    ]

},{timestamps:true});

module.exports = mongoose.model('User', UserSchema);