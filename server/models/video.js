import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const videoSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: false
	},
	views: {
		type: Number,
		required: false,
		default: 0
	},
	likes: {
		type: Number,
		required: false,
		default: 0
	},
	miniature: {
		type: String,
		required: false,
		default: 'https://beamimagination.com/wp-content/uploads/2017/09/video-placeholder.png'
	},
	status: {
		type: String,
		required: true,
		default: 'public'
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	comments: [{
		author: {
			type: Schema.Types.ObjectId,
			ref: 'User'
		},
		text: String,
	}],
	createdAt: {
		type: Date,
		required: true,
		default: Date.now
	},
	path: {
		type: String,
		required: true
	}
})

videoSchema.plugin( require('mongoose-paginate-v2') );

module.exports = mongoose.model('Video', videoSchema, 'videos');