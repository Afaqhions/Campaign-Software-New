import mongoose, { mongo } from 'mongoose'

const verficationSchema = new mongoose.Schema({
    campaignName: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Campaign"
        }
    ],
    serviceMan: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'ServiceMan'
        }
    ],
    serviceManLocation:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PicByServiceMan'
        }
    ],
    boardLiveLocation:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BoardLiveLocation'
        }
    ],
    status:{
        type: String,
        enum: ['Pending', 'Verified'],
        default: 'Pending',
        required: true
    }
})