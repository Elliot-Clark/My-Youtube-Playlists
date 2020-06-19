import React, { Component } from 'react';
import './SearchBar.css';
import fakeData from '../Fakedata';

class SearchBar extends Component {
  state = {
    videoTitle: "",
    videoURL: "",
    userName: "",
    userId: "",
  };

  componentDidMount() {
    window.gapi.load("client:auth2", function () {
      window.gapi.auth2.init({
        client_id:
          process.env.REACT_APP_CLIENT_ID,
      });
    });
  }

  authenticate = () => {
    return window.gapi.auth2
      .getAuthInstance()
      .signIn({ scope: "https://www.googleapis.com/auth/youtube.force-ssl" })
      .then(
        (result) => {
          console.log(result);
          this.props.dataFetch(result.Ea);
          this.setState({
            userName: result.Qt.Bd,
            userId: result.Ea,
          });
          this.props.toggleSignIn();
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
    window.gapi.client.setApiKey(process.env.REACT_APP_API_KEY);
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
    // if (searchValue) {
    //   return window.gapi.client.youtube.search.list({
    //     "part": "snippet",
    //     "maxResults": 6,
    //     "q": searchValue
    //   })
    //   .then((response) => {
    //     this.setState({ videoURL: response.result.items[0].id.videoId });
    //     this.props.toggleVideo(response.result.items[0].id.videoId, response.result.items[0].snippet.title );
    //     this.setState({ videoURL: response.result.items[0].id.videoId, response.result.items[0].snippet.title });
    //   },
      
    //   function(err) { console.error("Execute error", err); });
    // }
      this.props.toggleVideo(
        fakeData.result.items[0].id.videoId, 
        fakeData.result.items[0].snippet.title,
        [fakeData.result.items[1].id.videoId, fakeData.result.items[2].id.videoId, fakeData.result.items[3].id.videoId, fakeData.result.items[4].id.videoId],
        [fakeData.result.items[1].snippet.title, fakeData.result.items[2].snippet.title, fakeData.result.items[3].snippet.title, fakeData.result.items[4].snippet.title]
        );

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
          {this.props.signedIn ? (
            " "
          ) : (
            <button onClick={this.authenticate}>Sign In</button>
          )}
        </div>
      </>
    );
  }
}

export default SearchBar