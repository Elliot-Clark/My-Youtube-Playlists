import React, { Component } from 'react';
import './SearchBar.css';
import fakeData from '../Fakedata';
import axios from '../axios';

class SearchBar extends Component {
  state = {
    videoURL: "",
    signedIn: false,
    userName: "",
    userId: "",
  };

  componentDidMount() {
    window.gapi.load("client:auth2", function () {
      window.gapi.auth2.init({
        client_id:
          "919481705400-7p953qn73d595rhqab1eqsid3ph4dbpr.apps.googleusercontent.com",
      });
    });
  }

  authenticate = () => {
    return window.gapi.auth2
      .getAuthInstance()
      .signIn({ scope: "https://www.googleapis.com/auth/youtube.force-ssl" })
      .then(
        (result) => {
          this.props.dataFetch(result.Ea);
          this.setState({
            userName: result.Tt.Bd,
            userId: result.Ea,
            signedIn: true,
          });
          this.loadClient();
        },
        function (err) {
          console.error("Error signing in", err);
        }
      );
  };

  initSearch = () => {
    return window.gapi.auth2.getAuthInstance().then(this.loadClient);
  };

  loadClient = () => {
    window.gapi.client.setApiKey("AIzaSyC5I9Tv_CUW-WSSMQnMvWfX4J4oSxVjuSk");
    return window.gapi.client
      .load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
      .then(
        function () {},
        function (err) {
          console.error("Error loading GAPI client for API", err);
        }
      );
  };

  execute = (searchValue) => {
    console.log(searchValue);
    if (searchValue) {
    //   return window.gapi.client.youtube.search.list({
    //     "part": "snippet",
    //     "maxResults": 5,
    //     "q": searchValue
    //   })
    //   .then((response) => {
    //     this.setState({ videoURL: response.result.items[0].id.videoId });
    //   },
    //   function(err) { console.error("Execute error", err); });
    //   this.setState({ videoURL: fakeData.result.items[0].id.videoId });
      this.props.toggleVideoURL(fakeData.result.items[0].id.videoId);
    }
  };

  search = (event) => {
    if (event.key === "Enter") {
      this.execute(document.getElementById("searchBar").value);
    }
  };
  render() {
    return (
      <>
        <div className="searchBar">
          <input
            id="searchBar"
            type="search"
            placeholder="Search..."
            size="20"
            onKeyDown={this.search}
            onFocus={this.initSearch}
          ></input>
          <input type="submit" value="Submit" onClick={this.execute}></input>
          {this.state.signedIn ? (
            ""
          ) : (
            <button onClick={this.authenticate}>Sign In</button>
          )}
        </div>
      </>
    );
  }
}

export default SearchBar