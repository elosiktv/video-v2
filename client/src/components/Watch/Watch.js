import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import { Link } from 'react-router-dom';
import { DateTime } from 'luxon';
import Textarea from 'react-textarea-autosize';

import { getVideoInformations } from '../../actions/videoAction';
import { makeComment } from '../../actions/userAction';

import VideoPlayer from './VideoPlayer';
import WatchError from './WatchError';

const WatchContainer = styled.div`
	width: calc(100% - 250px);
	min-height: calc(200vh - 80px);
	display: block;
	overflow: auto;
	background: #FAFAFA;
	margin-left: 250px;
	margin-top: 80px;
	font-family: 'Lato';

	@media (max-width: 920px) {
		width: 100%;
		height: 100vh;
		margin: 0;
	}
`

const WatchWrapper = styled.div`
	width: 1400px;
	height: 30px;
	margin: auto;
	margin-top: 15px;
	padding: 0px 30px;
	position: relative;

	@media (max-width: 1710px) {
		width: 90%;
	}
`

const VideoTitle = styled.p`
	margin: 0;
	font-size: 26px;
	color: #000;
`

const VideoViews = styled.p`
	margin: 0;
	font-size: 20px;
	color: #000;
	margin-top: 6px;
`

const VideoLine = styled.div`
	width: 100%;
	height: 1px;
	background: #E7E7E7;
	margin-top: 15px;
`

const StyledIcon = styled(FontAwesome)`
	
`

const SaveButton = styled.button`
	background: none;
	border: none;
	cursor: pointer;
	outline: none;
	display: flex;
	justify-content: center;
	align-items: center;
	font-family: 'Lato';
	text-transform: uppercase;
	letter-spacing: -1px;
	float: right;
	font-size: 28px;
	margin-top: -41px;

	&:hover ${StyledIcon} {
		color: #10A074;
	}
`

const LikeButton = styled.button`
	background: none;
	border: none;
	cursor: pointer;
	outline: none;
	display: flex;
	justify-content: center;
	align-items: center;
	font-family: 'Lato';
	font-size: 26px;
	float: right;
	margin-top: -44px;
	margin-right: 40px;

	&:hover {
		color: #10A074;
	}

	&:hover .fa {
		color: #10A074;
	}

	.fa {
		font-size: 24px;
		margin-right: 3px;
		margin-top: -2px;
	}
`

const AuthorLink = styled(Link)`
	text-decoration: none;
	margin-top: 10px;
	display: flex;
	align-items: center;
	width: 140px;
`

const AuthorAvatar = styled.img`
	width: 54px;
	height: 54px;
	border-radius: 50%;
`

const AuthorInfoWrapper = styled.div`
	margin-left: 10px;
`

const AuthorNick = styled.p`
	font-size: 16px;
	margin: 0;
	color: #000;
`

const AuthorDate = styled.p`
	font-size: 12px;
	color: #000;
	margin: 0;
`

const VideoDescription = styled.div`
	margin-left: 65px;
	margin-top: 10px;
	width: 500px;
	min-height: 40px;
	max-height: ${({descMore}) => descMore ? 'auto' : '40px'}; 
	white-space: pre;
	overflow: hidden;
`

const ShowMoreBtn = styled.button`
	margin-left: 60px;
	margin-top: 10px;
	background: none;
	border: none;
	cursor: pointer;
	outline: none;
	font-family: 'Lato';
	font-size: 16px;
	text-transform: uppercase;
`

const UserCommentContainer = styled.div`
	position: relative;
	display: flex;
	min-height: 50px;
	align-items: center;
	flex-wrap: wrap;
	margin-top: 20px;
	width: 660px;
`

const UserAvatarComment = styled.img`
	width: 42px;
	height: 42px;
	border-radius: 50%;
	align-self: flex-start;
`

const CommentTextArea = styled(Textarea)`
	border: none;
	border-bottom: ${({commenterror}) => commenterror ? '1px solid red' : '1px solid black'};
	outline: none;
	width: 600px;
	background: none;
	padding-top: 20px;
	resize: none;
	font-size: 14px;
	margin-top: 10px;
	margin-left: 10px;
	margin-bottom: 17px;
	min-height: 20px;
	padding: 0;
	font-family: 'Lato';
`

const CommentAddButton = styled.button`
	width: 70px;
	height: 30px;
	background: #E7E7E7;
	color: #fff;
	font-family: 'Lato';
	cursor: pointer;
	border: none;
	margin-left: auto;
	margin-right: 7px;
	margin-top: -8px;
	outline: none;
	transition: background .3s;

	&:hover {
		background: #10A074;
	}
`

class Watch extends Component {
	constructor() {
		super();
		this.state = {
			descMore: false,
			typing: false,
			comment: '',
			commentError: false
		}
	}

	componentDidMount() {
		this.props.getVideoInformations({ id: this.props.match.params.id });
	}

	toggleDescription = () => {
		this.setState({
			descMore: !this.state.descMore
		});
	}

	handleCommentTyping = e => {
		this.setState({
			typing: !this.state.typing,
		});
	}

	handleCommentChange = e => {
		this.setState({
			comment: e.target.value
		});
	}

	addComment = () => {
		if (this.state.comment) {
			if (this.state.comment.trim().length > 0) {
				this.setState({
					commentError: false
				});
				this.props.makeComment(this.props.match.params.id, this.state.comment);
			} else {
				this.setState({
					commentError: true
				});
			}
		} else {
			this.setState({
				commentError: true
			});
		}
	}

	render() {
		let { watchVideoError, singleVideo, user } = this.props;
		if (singleVideo) {
			singleVideo.createdAt = new Date( Number(singleVideo.createdAt) );
			singleVideo.createdAt = DateTime.fromJSDate( singleVideo.createdAt );
			console.log(singleVideo.comments);
		}
		return (
			<WatchContainer>
				{
					singleVideo && <VideoPlayer typing={this.state.typing} id={this.props.match.params.id} />
				}
				{
					watchVideoError && <WatchError error={watchVideoError}/>
				}
				{
					singleVideo && (
						<WatchWrapper>
							<VideoTitle>{singleVideo.title}</VideoTitle>
							<VideoViews>{`${singleVideo.views} views`}</VideoViews>
							<VideoLine />
							<SaveButton>
								<StyledIcon name="folder-plus" />
							</SaveButton>
							<LikeButton>
								<StyledIcon name="thumbs-up"/>
								{singleVideo.likes}
							</LikeButton>
							<AuthorLink to={`/user/${singleVideo.author.nick}`}>
								<AuthorAvatar alt="" src={singleVideo.author.profile.avatar}/>
								<AuthorInfoWrapper>
									<AuthorNick>{singleVideo.author.nick}</AuthorNick>
									<AuthorDate>{singleVideo.createdAt.toString().split('T')[0]}</AuthorDate>
								</AuthorInfoWrapper>
							</AuthorLink>
							<VideoDescription descMore={this.state.descMore ? 1 : 0}>{singleVideo.description}</VideoDescription>
							<ShowMoreBtn onClick={this.toggleDescription}>
								{
									this.state.descMore ? 'Show less' : 'Show more'
								}
							</ShowMoreBtn>
							<VideoLine />
							<UserCommentContainer>
								<UserAvatarComment alt="" src={user.profile.avatar} />
								<CommentTextArea value={this.state.comment} onChange={this.handleCommentChange} commenterror={this.state.commentError ? 1 : 0} placeholder="Add comment..." onBlur={this.handleCommentTyping} onFocus={this.handleCommentTyping}></CommentTextArea>
								<CommentAddButton onClick={this.addComment}>Add</CommentAddButton>
							</UserCommentContainer>
						</WatchWrapper>	
					)
				}
			</WatchContainer>

		);
	}
}

const mapStateToProps = state => {
	return {
		watchVideoError: state.videoReducer.watchVideoError,
		singleVideo: state.videoReducer.singleVideo,
		user: state.userReducer.user
	}
}

export default connect(mapStateToProps, { getVideoInformations, makeComment })(Watch);