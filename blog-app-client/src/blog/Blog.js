import React, { Component } from 'react';
import './Blog.css';
import { Avatar, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { getAvatarColor } from '../util/Colors';
import { formatDateTime } from '../util/Helpers';

import { Radio, Button } from 'antd';
const RadioGroup = Radio.Group;

class Blog extends Component {

    render() {
        return (
            <div className="blog-content">
                <div className="blog-header">
                    <div className="blog-creator-info">
                        <Link className="creator-link" to={`/users/${this.props.blog.createdBy.username}`}>
                            <Avatar className="blog-creator-avatar"
                                style={{ backgroundColor: getAvatarColor(this.props.blog.createdBy.name)}} >
                                {this.props.blog.createdBy.name[0].toUpperCase()}
                            </Avatar>
                            <span className="blog-creator-name">
                                {this.props.blog.createdBy.name}
                            </span>
                            <span className="blog-creator-username">
                                @{this.props.blog.createdBy.username}
                            </span>
                            <span className="blog-creation-date">
                                {formatDateTime(this.props.blog.creationDateTime)}
                            </span>
                        </Link>
                    </div>
                    <div className="blog-title">
                        {this.props.blog.title}
                    </div>
                    <div className="blog-content">
                        {this.props.blog.content}
                    </div>
                </div>

                <div className="blog-footer">

                    <span className="separator">•</span>

                </div>
            </div>
        );
    }
}


export default Blog;
