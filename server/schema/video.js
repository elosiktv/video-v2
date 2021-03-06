export default `
	type Video {
		_id: ID
		title: String!
		description: String!
		views: Int!
		likes: Int!
		miniature: String!
		status: String!
		length: String!
		author: User!
		comments: [UserWithComment!]!
		createdAt: String!
		path: String!
	}
	
	type UserWithComment {
		_id: ID!
		text: String!
		author: User!
		createdAt: String!
	}

	type UpdatedViews {
		views: Int!
	}
	
	extend type Query {
		videos(
			page: Int!, 
			limit: Int!,
			author: ID,
			title: String,
			sort: String,
			id: ID,
		): [Video]
		getVideo(
			id: ID!
		): Video
	}

	extend type Mutation {
		createVideo(
			title: String!
			description: String
			miniature: String
			status: String!
			path: String!
			length: String!
			_id: ID!
		): Video
		increaseViews(id: ID!): UpdatedViews
		addComment(videoid: ID!, text: String!): UserWithComment
		changeVideoInfo(id: ID!, title: String, description: String, miniature: String, status: String): Video
		addVideoToHistory(id: ID!): User
		removeVideo(id: ID!): Result
	}
`