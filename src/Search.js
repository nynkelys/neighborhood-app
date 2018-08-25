import React, { Component } from 'react';
import PropTypes from 'prop-types'
import './App.css';

class Search extends Component {

	state = {
		query: '',
	}

	handleSearch = (event) => {
		const query = event.target.value;
		const { search } = this.props;

		search(event.target.value)
		this.setState({query})
	}

	render() {

		const { query } = this.state;
		const { handleSearch } = this;

		return (
			<div>
				<form>
	  				<label>
	    				<input
	    					role="search"
	    					className="inputfield"
		    				type="text"
		    				name="filter"
		    				placeholder="search venue"
		    				value={query}
		    				onChange={handleSearch}
	    				/>
	  				</label>
				</form>
			</div>
		)
	}
}

Search.propTypes = {
	search: PropTypes.func.isRequired
}

export default Search;