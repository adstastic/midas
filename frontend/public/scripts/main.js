/*global React, ReactDOM, marked */

var Comment = React.createClass({
  rawMarkup: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return { __html: rawMarkup };
  },

  render: function() {
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.name}
        </h2>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
      </div>
    );
  }
});

var CommentBox = React.createClass({
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  handleCommentSubmit: function(comment) {
    var comments = this.state.data;
    comment.id = Date.now();
    var newComments = comments.concat([comment]);
    this.setState({data: newComments});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        // this.setState({data: comments});
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
});

var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(comment) {
      var fullname = comment.fname + ' ' + comment.lname;
      return (
        <Comment name={fullname} key={comment.id}>
          {comment.email}
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var CommentForm = React.createClass({
  getInitialState: function() {
    return {fname: '', lname: '', email: '', pass: ''};
  },
  handleFNameChange: function(e) {
    this.setState({fname: e.target.value});
  },
  handleLNameChange: function(e) {
    this.setState({lname: e.target.value});
  },
  handleEmailChange: function(e) {
    this.setState({email: e.target.value});
  },
  handlePassChange: function(e) {
    this.setState({pass: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var fname = this.state.fname.trim();
    var lname = this.state.lname.trim();
    var email = this.state.email.trim();
    var pass = this.state.pass;
    if (!fname || !lname || !email || !pass) {
      return;
    }
    this.props.onCommentSubmit({fname: fname, lname: lname, email: email, pass: pass});
    this.setState({fname: '', lname: '', email: '', pass: ''});
  },
  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input
          type="text"
          placeholder="First name"
          value={this.state.fname}
          onChange={this.handleFNameChange}
        />
        <input
          type="text"
          placeholder="Last name"
          value={this.state.lname}
          onChange={this.handleLNameChange}
        />
        <input
          type="text"
          placeholder="Email"
          value={this.state.email}
          onChange={this.handleEmailChange}
        />
        <input
          type="text"
          placeholder="Password"
          value={this.state.pass}
          onChange={this.handlePassChange}
        />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

ReactDOM.render(
  <CommentBox url="api/people.json" pollInterval={2000} />,
  document.getElementById('content')
);
