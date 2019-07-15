import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { DateTime } from 'luxon';

import { getUsers } from '../../actions/userAction';
import { getVideos } from '../../actions/videoAction';

import Videos from './Videos';

const UserContainer = styled.div`
	width: calc(100% - 250px);
	min-height: calc(100vh - 80px);	
	margin-left: 250px;
	margin-top: 80px;
	font-family: 'Lato';
	position: relative;
	display: flex;
	flex-direction: column;

	@media (max-width: 920px) {
		width: 100%;
		margin-left: 0px;
	}
`

const UserBackground = styled.div`
	width: 100%;
	height: 260px;
	background: ${({backgroundImg}) => `url("${backgroundImg}")`};
	background-repeat: no-repeat;
	background-size: cover;
	background-position: fixed;
`

const UserMenuBackground = styled.div`
	width: 100%;
	height: 130px;
	background: #F5F5F5;
	position: absolute;
	top: 260px;
`

const UserWrapper = styled.div`
	width: 1200px;
	margin: 0 auto;
	z-index: 1;
`

const UserMenuContainer = styled.div`
	width: 100%;
	height: 130px;
	display: flex;
	flex-direction: column;
`

const UserInfoWrapper = styled.div`
	display: flex;
	align-items: Center;
	margin-top: 20px;
`

const UserAvatar = styled.img`
	border-radius: 10px;
	width: 54px;
	height: 54px;
`

const UserInfo = styled.div`
	margin-left: 15px;
`

const UserNick = styled.p`
	margin: 0;
	font-size: 18px;
	font-weight: bold;
`

const UserDate = styled.p`
	font-size: 12px;
	margin: 0;
`

const UserMenuList = styled.ul`
	display: flex;
	margin: 0;
	padding: 0;
	list-style: none;
	margin-top: auto;
`

const UserMenuItem = styled.li`

`

const UserMenuButton = styled.button`
	font-size: 14px;
	font-family: 'Lato';
	text-transform: uppercase;
	padding: 10px 30px;
	border: none;
	background: none;
	cursor: pointer;
	outline: none;
	font-weight: bold;
	letter-spacing: -1px;
	color: ${({isActive}) => isActive ? '#606060' : ' #727272'};
	border-bottom: ${({isActive}) => isActive && '2px solid #606060'};
`

class User extends Component {
	componentDidMount() {
		this.props.getUsers({ nick: this.props.match.params.user, page: 1, limit: 1 }, true);
	}

	componentDidUpdate(prevProps) {
		if (prevProps.users !== this.props.users) {
			this.props.getVideos({ author: this.props.users[0]._id, page: 1, limit: 20, sort: 'newest' });
		}
	}

	updatePage = page => {
		if (page !== undefined) {
			this.props.history.push(`/user/${this.props.match.params.user}/${page}`);
		} else {
			this.props.history.push(`/user/${this.props.match.params.user}`);
		}
	}

	returnPageComponent = (page, props) => {
		switch(page) {
			case undefined:
				return <Videos {...props} />
			default: return null;
		}
	}

	render() {
		let { users, match, videos } = this.props;
		if (users) {
			users[0].profile.joined = new Date( Number(users[0].profile.joined) );
			users[0].profile.joined = DateTime.fromJSDate( users[0].profile.joined );
		}

		return (
			<UserContainer>
				{
					users && (
						<>
							<UserBackground backgroundImg={users[0].profile.background}/>
							<UserMenuBackground />
							<UserWrapper>
								<UserMenuContainer>
									<UserInfoWrapper>
										<UserAvatar alt="" src={users[0].profile.avatar} />
										<UserInfo>
											<UserNick>{users[0].nick}</UserNick>
											<UserDate>{users[0].profile.joined.toString().split('T')[0]}</UserDate>
										</UserInfo>
									</UserInfoWrapper>
									<UserMenuList>
										<UserMenuItem>
											<UserMenuButton isActive={match.params.page === undefined} onClick={() => this.updatePage(undefined)}>Videos</UserMenuButton>
										</UserMenuItem>
										<UserMenuItem>
											<UserMenuButton isActive={match.params.page === 'playlists'} onClick={() => this.updatePage('playlists')}>Playlists</UserMenuButton>
										</UserMenuItem>
										<UserMenuItem>
											<UserMenuButton isActive={match.params.page === 'informations'} onClick={() => this.updatePage('informations')}>Informations</UserMenuButton>
										</UserMenuItem>
									</UserMenuList>
								</UserMenuContainer>
								{
									this.returnPageComponent(match.params.page, { videos: videos })
								}
							</UserWrapper>
						</>
					)
				}
			</UserContainer>
		);
	}
}

const mapStateToProps = state => {
	return {
		users: state.userReducer.users,
		videos: state.videoReducer.videos
	}
}

export default connect(mapStateToProps, { getUsers, getVideos })(User);