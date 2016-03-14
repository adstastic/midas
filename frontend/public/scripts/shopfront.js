/*global React, ReactDOM, marked */

var Item = React.createClass({
    render: function() {
        return (
            <div className="Item" class="col-sm-4 col-lg-4 col-md-4">
                <div class="thumbnail">
                    <img src={this.props.image} alt="" />
                    <div class="caption">
                        <h4 class="pull-right">$64.99</h4>
                        <h4><a href="#">{this.props.name}</a>
                        </h4>
                        <p>{this.props.desc}</p>
                    </div>
                    <div class="ratings">
                        <p class="pull-right">{this.props.reviews}</p>
                        <p>{this.props.rating}</p>
                    </div>
                </div>
            </div>
        );
    }
});

var ItemList = React.createClass({
    render: function() {
        var items = this.props.data.map(function(item) {
            return (
                <Item 
                    image={item.image} 
                    name={item.name}
                    desc={item.desc}
                    reviews={item.reviews.length}
                    rating={item.rating}
                />
            );
        });
        return (
            <div>{items}</div>
        );
    }
});

var ItemBox = React.createClass({
    loadFromServer: function() {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            cache: false,
            success: function(data) {
                console.log(data);
                this.setState({data: data});
                }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
                }.bind(this)
        });
    },
    getInitialState: function() {
        return {data: []};
    },
    componentDidMount: function() {
        this.loadFromServer();
        setInterval(this.loadFromServer, this.props.pollInterval);
    },
    render: function() {
        return (
            <ItemList data={this.state.data} />
        );
    }
});

ReactDOM.render(
  <ItemBox url="api/items.json" pollInterval={2000} />,
  document.getElementById('item-boxes')
);