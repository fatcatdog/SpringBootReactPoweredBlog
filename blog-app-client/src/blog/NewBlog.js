import React, { Component } from 'react';
import { createBlog } from '../util/APIUtils';
import { BLOG_TITLE_MAX_LENGTH, BLOG_CONTENT_MAX_LENGTH } from '../constants';
import './NewBlog.css';
import { Form, Input, Button, Icon, Select, Col, notification } from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input

class NewBlog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: {
                text: ''
            },
            content: {
                text: ''
            }
        };
      this.handleTitleChange = this.handleTitleChange.bind(this);
      this.handleContentChange = this.handleContentChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        const blogData = {
            title: this.state.title.text,
            content: this.state.content.text
        };

        createBlog(blogData)
        .then(response => {
            this.props.history.push("/");
        }).catch(error => {
            if(error.status === 401) {
                this.props.handleLogout('/login', 'error', 'You have been logged out. Please login create blog.');
            } else {
                notification.error({
                    message: 'Blogging App',
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                });
            }
        });
    }

    validateTitle = (titleText) => {
        if(titleText.length === 0) {
            return {
                validateStatus: 'error',
                errorMsg: 'Please enter your title!'
            }
        } else if (titleText.length > BLOG_TITLE_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Title is too long (Maximum ${BLOG_TITLE_MAX_LENGTH} characters allowed)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null
            }
        }
    }

    validateContent = (contentText) => {
        if(contentText.length === 0) {
            return {
                validateStatus: 'error',
                errorMsg: 'Please enter your content!'
            }
        } else if (contentText.length > BLOG_CONTENT_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Content is too long (Maximum ${BLOG_CONTENT_MAX_LENGTH} characters allowed)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null
            }
        }
    }

    handleTitleChange(event) {
        const value = event.target.value;
        this.setState({
            title: {
                text: value,
                ...this.validateTitle(value)
            }
        });
    }

    handleContentChange(event) {
        const value = event.target.value;
        this.setState({
            content: {
                text: value,
                ...this.validateContent(value)
            }
        });
    }

    isFormInvalid() {
        if(this.state.title.validateStatus !== 'success') {
            return true;
        }
    }

    render() {

        return (
            <div className="new-blog-container">
                <h1 className="page-title">Create Blog</h1>
                <div className="new-blog-content">
                    <Form onSubmit={this.handleSubmit} className="create-blog-form">
                        <FormItem validateStatus={this.state.title.validateStatus}
                            help={this.state.title.errorMsg} className="blog-form-row">
                        <TextArea
                            placeholder="Enter your title"
                            style = {{ fontSize: '16px' }}
                            autosize={{ minRows: 3, maxRows: 6 }}
                            name = "title"
                            value = {this.state.title.text}
                            onChange = {this.handleTitleChange} />
                        </FormItem>

                        <FormItem validateStatus={this.state.content.validateStatus}
                            help={this.state.content.errorMsg} className="blog-form-row">
                        <TextArea
                            placeholder="Enter your content"
                            style = {{ fontSize: '16px' }}
                            autosize={{ minRows: 3, maxRows: 6 }}
                            name = "title"
                            value = {this.state.content.text}
                            onChange = {this.handleContentChange} />
                        </FormItem>

                        <FormItem className="blog-form-row">
                            <Button type="primary"
                                htmlType="submit"
                                size="large"
                                disabled={this.isFormInvalid()}
                                className="create-blog-form-button">Create Blog</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}

export default NewBlog;
