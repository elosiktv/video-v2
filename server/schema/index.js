import userSchema from './user';
import videoSchema from './video';
import playlistSchema from './playlist';
import adminSchema from './admin';
import settingsSchema from './settings';

const linkSchema = `
	type Query {
		_: Boolean
	}

	type Mutation {
		_: Boolean
	}
`

export default [linkSchema, userSchema, videoSchema, playlistSchema, adminSchema, settingsSchema];