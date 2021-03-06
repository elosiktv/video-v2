import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { DateTime } from 'luxon';
import { Helmet } from 'react-helmet';

import { getUsers } from '../../actions/userAction';
import { getVideos } from '../../actions/videoAction';
import { clearVideosProfile, clearUserProfile } from '../../actions/clearAction';

import Videos from './Videos';
import Playlists from './Playlists';
import Informations from './Informations';

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

	@media (max-width: 1490px) {
		width: 80%;
	}
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
	font-size: 16px;
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

	&:focus {
		background: #E1E1E1;
	}
`

class User extends Component {
	constructor() {
		super();
		this.state = {
			page: 1
		}
	}
	componentDidMount() {
		this.props.getUsers({ nick: this.props.match.params.user, page: 1, limit: 1 }, true);
		document.addEventListener('scroll', this.trackScrolling);
	}

	componentDidUpdate(prevProps) {
		if (prevProps.match.params.user !== this.props.match.params.user) {
			this.props.clearUserProfile();
			this.props.clearVideosProfile();
			this.props.getUsers({ nick: this.props.match.params.user, page: 1, limit: 1 }, true);
		}
		if (prevProps.videosProfile !== this.props.videosProfile) {
			document.addEventListener('scroll', this.trackScrolling);
		}
	}

	componentWillUnmount() {
		this.props.clearUserProfile();
		this.props.clearVideosProfile();
		document.removeEventListener('scroll', this.trackScrolling);
	}

	trackScrolling = () => {
		if (this.props.match.params.page === undefined) {
			const videosWrapper = document.getElementById('videos-wrapper');
			if (videosWrapper.getBoundingClientRect().bottom <= window.innerHeight) {
				document.removeEventListener('scroll', this.trackScrolling);
				this.setState({
					page: this.state.page + 1
				}, () => {
					this.props.getVideos({ author: this.props.userProfile[0]._id, page: this.state.page, limit: 20, sort: 'newest' }, false, 'profile', true);
				})
			}
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
				return <Videos videos={props.videos} />
			case 'playlists':
				return <Playlists playlists={props.playlists} user={props.user}/>
			case 'informations':
				return <Informations description={props.description} />
			default: return null;
		}
	}

	render() {
		let { userProfile, match, videosProfile } = this.props;
		if (userProfile) {
			userProfile[0].profile.joined = new Date( Number(userProfile[0].profile.joined) );
			userProfile[0].profile.joined = DateTime.fromJSDate( userProfile[0].profile.joined );
		}

		return (
			<UserContainer>
				<Helmet>
					<title>{ userProfile ? `${userProfile[0].nick} - Video v2` : 'Loading... - Video v2'}</title>
				</Helmet>
				{
					userProfile && (
						<>
							<UserBackground backgroundImg={userProfile[0].profile.background}/>
							<UserMenuBackground />
							<UserWrapper>
								<UserMenuContainer>
									<UserInfoWrapper>
										<UserAvatar alt="" src={userProfile[0].profile.avatar} />
										<UserInfo>
											<UserNick>{userProfile[0].nick}</UserNick>
											<UserDate>{userProfile[0].profile.joined.toString().split('T')[0]}</UserDate>
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
									this.returnPageComponent(match.params.page, { videos: videosProfile, playlists: userProfile[0].playlists, user: match.params.user, description: userProfile[0].profile.description })
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
		userProfile: state.userReducer.userProfile,
		videosProfile: state.videoReducer.videosProfile
	}
}

export default connect(mapStateToProps, { getUsers, clearUserProfile, clearVideosProfile, getVideos })(User);