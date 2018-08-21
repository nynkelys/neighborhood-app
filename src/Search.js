import React, { Component } from 'react';


class Search extends Component {

	state = {
		query: '',
	}

	handleSearch = (event) => {
		const query = event.target.value;
		this.props.search(event.target.value)
		this.setState({query})
	}

	render() {
		return (
			<div>
				<form>
	  				<label>
	    				<input
		    				type="text"
		    				name="filter"
		    				placeholder="Search"
		    				value={this.state.query}
		    				onChange={this.handleSearch}
	    				/>
	  				</label>
				</form>
			</div>
		)
	}
}

export default Search;