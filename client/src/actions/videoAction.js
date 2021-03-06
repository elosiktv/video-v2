import axios from 'axios';
import stringifyObject from 'stringify-object';

const CancelToken = axios.CancelToken;
let cancel;

export const cancelVideosRequest = () => {
	return dispatch => {
		cancel();
	}
}

export const getVideos = (args, updatePopular, type, inifiniteScroll) => {
	const argsForGraphql = stringifyObject(args, { singleQuotes: false });
	const query = argsForGraphql.substring(1, argsForGraphql.length - 1);

	return async dispatch => {
		try {
			const result = await axios({
				url: '/graphql',
				method: 'post',
				cancelToken: new CancelToken(function executor(c) {
					cancel = c;
				}),
				headers: {
					'Authorization': localStorage.getItem('token')
				},
				data: {
					query: `
						query {
							videos(${query}) {
								_id
								title
								views
								miniature
								length
								likes
								status
								description
								author {
									nick
								}
								createdAt
							}
						}
					`
				}
			});
			if (result.data.errors) throw (result.data.errors[0].message);

			if (updatePopular) {
				dispatch({
					type: 'UPDATE_POPULAR_VIDEOS',
					data: result.data.data.videos
				});
			} else if (type) {
				switch(type) {
					case 'profile':
						if (inifiniteScroll) {
							if (result.data.data.videos.length !== 0) {
								dispatch({
									type: 'ADD_PROFILE_VIDEOS',
									data: result.data.data.videos
								})
							}
						} else {
							dispatch({
								type: 'UPDATE_PROFILE_VIDEOS',
								data: result.data.data.videos
							});
						}
						break;
					case 'user':
						if (inifiniteScroll) {
							if (result.data.data.videos.length !== 0) {
								dispatch({
									type: 'ADD_USER_VIDEOS',
									data: result.data.data.videos
								});
							}
						} else {
							dispatch({
								type: 'UPDATE_USER_VIDEOS',
								data: result.data.data.videos
							});
						}
						break;
					case 'edit':
						dispatch({
							type: 'UPDATE_EDIT_VIDEO',
							data: result.data.data.videos
						});
						break;
					default: return null;
				}
			} else if (inifiniteScroll) {
				if (result.data.data.videos.length !== 0) {
					dispatch({
						type: 'ADD_NEW_VIDEOS',
						data: result.data.data.videos
					});	
				}
			} else {
				dispatch({
					type: 'UPDATE_VIDEOS',
					data: result.data.data.videos
				});
			}
		} catch (err) {
			if (!axios.isCancel) {
				throw err;
			}
		}
	}
}

export const createVideo = (args) => {
	const argsForGraphql = stringifyObject(args, { singleQuotes: false });
	const modifiedArgs = argsForGraphql.substring(1, argsForGraphql.length - 1);

	return async dispatch => {
		try {
			await axios({
				url: '/graphql',
				method: 'post',
				headers: {
					'Authorization': localStorage.getItem('token')
				},
				data: {
					query: `
						mutation {
							createVideo(${modifiedArgs}) {
								_id
							}
						}
					`
				}
			});

			dispatch({
				type: 'SHOW_ALERT',
				message: 'Video has been created!',
				alertType: 'normal'
			});	

		} catch (err) {
			throw err;
		}
	}
}

export const removeVideo = id => {
	return async dispatch => {
		try {
			const result = await axios({
				url: '/graphql',
				method: 'post',
				headers: {
					'Authorization': localStorage.getItem('token')
				},
				data: {
					query: `
						mutation {
							removeVideo(id: "${id}") {
								result
							}
						}
					`
				}
			});
			if (result.data.errors) throw (result.data.errors[0].message);

			dispatch({
				type: 'SHOW_ALERT',
				message: 'Video has been removed!',
				alertType: 'normal'
			});	
		} catch(err) {
			throw err;
		}		
	}
}

export const editVideo = (args) => {
	const argsForGraphql = stringifyObject(args, { singleQuotes: false });
	const modifiedArgs = argsForGraphql.substring(1, argsForGraphql.length - 1);

	return async dispatch => {
		try {
			const result = await axios({
				url: '/graphql',
				method: 'post',
				headers: {
					'Authorization': localStorage.getItem('token')
				},
				data: {
					query: `
						mutation {
							changeVideoInfo(${modifiedArgs}) {
								_id
							}
						}
					`
				}
			});
			if (result.data.errors) throw (result.data.errors[0].message);

			dispatch({
				type: 'SHOW_ALERT',
				message: 'Video has been edited!',
				alertType: 'normal'
			});	

		} catch (err) {
			if (err === 'You cant edit videos!') {
				dispatch({
					type: 'SHOW_ALERT',
					message: 'You cant edit videos!',
					alertType: 'error'
				});	
			}
		}
	}
}

export const getVideoInformations = (args) => {
	const argsForGraphql = stringifyObject(args, { singleQuotes: false });
	const query = argsForGraphql.substring(1, argsForGraphql.length - 1);

	return async dispatch => {
		try {
			const result = await axios({
				url: '/graphql',
				method: 'post',
				data: {
					query: `
						query {
							getVideo(${query}) {
								title
								_id
								views
								description
								createdAt
								likes
								author {
									nick
									profile {
										avatar
									}
								}
								comments {
									text
									createdAt
									author {
										nick
										profile {
											avatar
										}
									}
								}
							}
						}
					`
				}
			});
			if (result.data.errors) throw (result.data.errors[0].message);

			result.data.data.getVideo.comments.reverse();

			dispatch({
				type: 'UPDATE_SINGLE_VIDEO',
				data: result.data.data.getVideo
			})
		} catch (err) {
			dispatch({
				type: 'UPDATE_WATCH_VIDEO_ERROR',
				data: err
			})
		}
	}
}

export const increaseViews = id => {
	return async dispatch => {
		await axios({
			url: '/graphql',
			method: 'post',
			data: {
				query: `
					mutation {
						increaseViews(id: "${id}") {
							views
						}
					}
				`
			}
		});
	}
}