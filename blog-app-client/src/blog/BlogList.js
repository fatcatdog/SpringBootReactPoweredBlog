import React, { Component } from 'react';
import { getAllBlogs, getUserCreatedBlogs } from '../util/APIUtils';
import Blog from './Blog';
import { castVote } from '../util/APIUtils';
import LoadingIndicator  from '../common/LoadingIndicator';
import { Button, Icon, notification } from 'antd';
import { BLOG_LIST_SIZE } from '../constants';
import { withRouter } from 'react-router-dom';
import './BlogList.css';

class BlogList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            blogs: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            isLoading: false
        };
        this.loadBlogList = this.loadBlogList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
    }

    loadBlogList(page = 0, size = BLOG_LIST_SIZE) {
        let promise;
        if(this.props.username) {
            if(this.props.type === 'USER_CREATED_BLOGS') {
                promise = getUserCreatedBlogs(this.props.username, page, size);
            }
        } else {
            promise = getAllBlogs(page, size);
        }

        if(!promise) {
            return;
        }

        this.setState({
            isLoading: true
        });

        promise
        .then(response => {
            const blogs = this.state.blogs.slice();

            this.setState({
                blogs: blogs.concat(response.content),
                page: response.page,
                size: response.size,
                totalElements: response.totalElements,
                totalPages: response.totalPages,
                last: response.last,
                isLoading: false
            })
        }).catch(error => {
            this.setState({
                isLoading: false
            })
        });

    }

    componentWillMount() {
        this.loadBlogList();
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.isAuthenticated !== nextProps.isAuthenticated) {
            // Reset State
            this.setState({
                blogs: [],
                page: 0,
                size: 10,
                totalElements: 0,
                totalPages: 0,
                last: true,
                isLoading: false
            });
            this.loadBlogList();
        }
    }

    handleLoadMore() {
        this.loadBlogList(this.state.page + 1);
    }

    render() {
        const blogViews = [];
        this.state.blogs.forEach((blog, blogIndex) => {
            blogViews.push(<Blog
                key={blog.id}
                blog={blog} />)
        });

        return (
            <div className="blogs-container">
                {blogViews}
                {
                    !this.state.isLoading && this.state.blogs.length === 0 ? (
                        <div className="no-blogs-found">
                            <span>No Blogs Found.</span>
                        </div>
                    ): null
                }
                {
                    !this.state.isLoading && !this.state.last ? (
                        <div className="load-more-blogs">
                            <Button type="dashed" onClick={this.handleLoadMore} disabled={this.state.isLoading}>
                                <Icon type="plus" /> Load more
                            </Button>
                        </div>): null
                }
                {
                    this.state.isLoading ?
                    <LoadingIndicator />: null
                }
            </div>
        );
    }
}

export default withRouter(BlogList);
