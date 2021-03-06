const initState = {
	users: null,
	oneUser: null,
	history: null,
	videos: null,
	oneVideo: null,
	deleteVideoStatus: null,
	settings: null
}

const adminReducer = (state = initState, action) => {
	switch(action.type) {
		case 'UPDATE_USERS':
			return {
				...state,
				users: action.data
			}
		case 'UPDATE_ONE_USER':
			return {
				...state,
				oneUser: action.data[0]
			}
		case 'UPDATE_ONE_USER_PROFILE':
			return {
				...state,
				oneUser: {
					...state.oneUser,
					profile: action.data
				}
			}
		case 'CLEAR_ONE_USER':
			return {
				...state,
				oneUser: null
			}
		case 'UPDATE_HISTORY':
			return {
				...state,
				history: action.data
			}
		case 'CLEAR_HISTORY':
			return {
				...state,
				history: null
			}
		case 'UPDATE_VIDEOS':
			return {
				...state,
				videos: action.data
			}
		case 'ADD_VIDEOS':
			return {
				...state,
				videos: [...state.videos, ...action.data]
			}
		case 'UPDATE_ONE_VIDEO':
			return {
				...state,
				oneVideo: action.data
			}
		case 'UPDATE_ONE_VIDEO_INFO':
			return {
				...state,
				oneVideo: {...state.oneVideo, ...action.data}
			}
		case 'CLEAR_VIDEOS':
			return {
				...state,
				videos: null	
			}
		case 'CLEAR_ONE_VIDEO':
			return {
				...state,
				oneVideo: null
			}
		case 'REMOVE_VIDEO_ADMIN':
			return {
				...state,
				deleteVideoStatus: Math.random()
			}
		case 'UPDATE_SETTINGS':
			return {
				...state,
				settings: action.data
			}
		default: return state;
	}
}

export default adminReducer;