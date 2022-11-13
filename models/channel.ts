const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const channelSchema = new Schema({
    osu_username: {
        type: String,
        required: true,
        unique: true
    },

    twitch_username: {
        type: String,
    },

    requests_enabled: {
        type: Boolean,
        default: true
    },

    map_requirements: {
        MAX_SR: {
            type: Number,
            default: 0
        },

        MIN_SR: {
            type: Number,
            default: 0
        },

        MAX_LENGTH: {
            type: Number,
            default: 0
        },

        map_blacklist: {
            type: [Number],
            default: []
        },
    },
    
    viewer_blacklist: {
        type: [String],
        default: []
    }
});

module.exports = mongoose.model('Channel', channelSchema);
