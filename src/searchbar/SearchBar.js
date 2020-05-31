import React, { Component } from 'react';
import './SearchBar.css';
import fakeData from '../Fakedata';

class SearchBar extends Component {
    state = {

    }
    render () {
        return (
            <>
                <div className="searchBar">
                    <input id="searchBar" type="search" placeholder="Search..." size="20" onKeyDown={this.search} onFocus={this.initSearch}></input>
                    <input type="submit" value="Submit" onClick={this.execute}></input>
                    { this.state.signedIn ? '' : <button onClick={this.authenticate}>Sign In</button> }
                </div>
            </>
        )
    }
}

export default SearchBar