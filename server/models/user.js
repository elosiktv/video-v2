import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	nick: {
		type: String,
		required: true
	},
	isAdmin: {
		type: Boolean,
		required: true,
		default: false
	},
	rules: {
		canUpload: {
			type: Boolean,
			required: true,
			default: true
		},
		canComment: {
			type: Boolean,
			required: true,
			default: true
		},
		canUseSettings: {
			type: Boolean,
			required: true,
			default: true
		},
		canEditVideos: {
			type: Boolean,
			required: true,
			default: true
		}
	},
	profile: {
		background: {
			type: String,
			required: true,
			default: '/backgrounds/default.jpg'
		},
		avatar: {
			type: String,
			required: true,
			default: '/avatars/default.png'
		},
		description: {
			type: String,
			required: false,
			default: ''
		},
		joined: {
			type: Date,
			required: true,
			default: Date.now
		}
	},
	history: {
		videos: [{
			type: Schema.Types.ObjectId,
			ref: 'Video',
		}],
		search: [{
			type: String,
			required: false
		}]
	},
	likedVideos: [{
		type: Schema.Types.ObjectId,
		ref: 'Video',
	}],
	playlists: [{
		status: String,
		name: String,
		videos: [{
			type: Schema.Types.ObjectId,
			ref: 'Video',
		}]
	}],
	uploadedVideos: [{
		type: Schema.Types.ObjectId,
		ref: 'Video',
	}]
})

userSchema.plugin( require('mongoose-paginate-v2') );

module.exports = mongoose.model('User', userSchema, 'users');