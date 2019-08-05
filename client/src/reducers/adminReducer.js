const initState = {
	users: null,
	oneUser: null
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
		default: return state;
	}
}

export default adminReducer;