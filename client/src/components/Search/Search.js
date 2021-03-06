import React, { Component } from 'react';
import styled from 'styled-components';
import queryString from 'query-string';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { getVideos, cancelVideosRequest } from '../../actions/videoAction';
import { getUsers, cancelUsersRequest } from '../../actions/userAction';
import { clearVideos, clearUsers } from '../../actions/clearAction';

import NormalVideo from '../../shared/NormalVideo/NormalVideo';
import User from './User';

const SearchConintaner = styled.div`
	width: calc(100% - 250px);
	min-height: calc(100vh - 80px);	
	margin-left: 250px;
	margin-top: 80px;
	font-family: 'Lato';

	@media (max-width: 920px) {
		width: 100%;
		margin-left: 0px;
	}
`

const SearchOptionsWrapper = styled.div`
	display: flex;
	align-items: center;
	height: 40px;
	margin-left: 40px;
`

const SearchOptionsInput = styled.input`
	cursor: pointer;
`

const SearchOptionsLabel = styled.label`
	display: flex;
	align-items: center;
	margin-right: 5px;
	cursor: pointer;
`

const SearchOptionsLine = styled.div`
	width: 1px;
	height: 100%;
	background: #e7e7e7;
	margin: 0px 5px;
`

const VideosWrapper = styled.div`
	width: 1565px;
	height: 100%;
	margin: auto;
	display: flex;
	flex-wrap: wrap;

	@media (max-width: 1550px) {
		width: 90%;
	}
`

class Search extends Component {
	constructor() {
		super();
		this.state = {
			title: '',
			searchtype: 'videos',
			searchsort: 'popular',
			page: 1
		}
	}

	getUsersFunction = parsed => {
		delete parsed.type;
		parsed.nick = parsed.title;
		delete parsed.title;
		delete parsed.sort;
		this.props.getUsers(parsed);
	}

	getVideosFunction = parsed => {
		delete parsed.type;
		this.props.getVideos(parsed);
	}

	componentDidMount() {
		document.addEventListener('scroll', this.trackScrolling);
		let parsed = queryString.parse(window.location.search);

		document.getElementById(`type-${parsed.type}`).checked = true;
		if (document.getElementById(`sort-${parsed.sort}`)) {
			document.getElementById(`sort-${parsed.sort}`).checked = true;
		}

		this.setState({
			title: parsed.title
		});

		parsed.page = 1;
		parsed.limit = 15;
		if (parsed.type === 'videos') {
			this.getVideosFunction(parsed);
		} else if (parsed.type === 'users') {
			this.getUsersFunction(parsed);
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.location.pathname === '/search') {
			let parsedPrev = queryString.parse(prevProps.location.search);
			let parsed = queryString.parse(window.location.search);
			if (parsed.title) {
				if (parsedPrev.title !== parsed.title || parsedPrev.type !== parsed.type || parsedPrev.sort !== parsed.sort) {
					this.setState({
						title: parsed.title,
						page: 1
					});
					parsed.page = 1;
					parsed.limit = 15;
					if (parsed.type === 'videos') {
						if (parsedPrev.type === 'users') this.props.cancelUsersRequest();
						this.getVideosFunction(parsed);
						document.getElementById(`sort-${parsed.sort}`).checked = true;
					} else if (parsed.type === 'users') {
						if (parsedPrev.type === 'videos') this.props.cancelVideosRequest();
						this.getUsersFunction(parsed);
					}
				}
			} else {
				this.props.history.push('/');
			}
		}
		if (prevProps.videos !== this.props.videos) {
			document.addEventListener('scroll', this.trackScrolling);
		}
	}

	trackScrolling = () => {
		const searchWrapper = document.getElementById('search-wrapper');
		if (searchWrapper.getBoundingClientRect().bottom <= window.innerHeight) {
			document.removeEventListener('scroll', this.trackScrolling);
			this.setState({
				page: this.state.page + 1
			}, () => {
				if (this.state.searchtype === 'videos') {
					this.props.getVideos({ page: this.state.page, limit: 15, title: this.state.title, sort: this.state.searchsort }, false, false, true);
				}
			});
		}
	}

	componentWillUnmount() {
		this.props.clearVideos();
		this.props.clearUsers();
		document.removeEventListener('scroll', this.trackScrolling);
	}

	handleOptionChange = (searchtype, value) => {
		if (searchtype === 'searchsort') {
			if (value === this.state.searchsort) return false;
		}
		this.props.clearVideos();
		this.props.clearUsers();
		this.setState({
			[searchtype]: value,
			page: 1
		}, () => {
			this.props.history.push(`/search?title=${this.state.title}&sort=${this.state.searchsort}&type=${this.state.searchtype}`)
		});
	}

	render() {
		const { videos, users } = this.props;
		return (
			<SearchConintaner>
				<Helmet>
					<title>Search - Video v2</title>
				</Helmet>
				<SearchOptionsWrapper>
					<SearchOptionsLabel>
						<SearchOptionsInput onClick={() => this.handleOptionChange('searchtype', 'videos')} id="type-videos" type="radio" name="search-type"/>
						Videos
					</SearchOptionsLabel>
					<SearchOptionsLabel>
						<SearchOptionsInput onClick={() => this.handleOptionChange('searchtype', 'users')} id="type-users" type="radio" name="search-type"/>
						Users
					</SearchOptionsLabel>
					<SearchOptionsLine />
					{
						this.state.searchtype === 'videos' && (
							<>
								<SearchOptionsLabel>
									<SearchOptionsInput onClick={() => this.handleOptionChange('searchsort', 'popular')} id="sort-popular" type="radio" name="search-sort"/>
									Popular
								</SearchOptionsLabel>
								<SearchOptionsLabel>
									<SearchOptionsInput onClick={() => this.handleOptionChange('searchsort', 'newest')} id="sort-newest" type="radio" name="search-sort"/>
									Newest
								</SearchOptionsLabel>
								<SearchOptionsLabel>
									<SearchOptionsInput onClick={() => this.handleOptionChange('searchsort', 'oldest')} id="sort-oldest" type="radio" name="search-sort"/>
									Oldest
								</SearchOptionsLabel>
							</>
						)
					}
				</SearchOptionsWrapper>
				<VideosWrapper id="search-wrapper">
					{
						videos && (
							videos.map((item, index) => {
								return (
									<NormalVideo key={index} title={item.title} id={item._id} miniature={item.miniature} author={item.author.nick} createdAt={item.createdAt} views={item.views} length={item.length} />
								)
							})
						)
					}
					{
						users && (
							users.map((item, index) => {
								return (
									<User key={index} avatar={item.profile.avatar} nick={item.nick} id={item.id} />
								)
							})
						)
					}
				</VideosWrapper>
			</SearchConintaner>
		);
	}
}

const mapStateToProps = state => {
	return {
		videos: state.videoReducer.videos,
		users: state.userReducer.users
	}
}

export default connect(mapStateToProps, { getVideos, clearVideos, cancelVideosRequest, getUsers, clearUsers, cancelUsersRequest })(withRouter(Search));