import React, { Component } from 'react';
import './SearchBar.css';

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
    if (searchValue) {
      return window.gapi.client.youtube.search.list({
        "part": "snippet",
        "maxResults": 6,
        "q": searchValue
      })
      .then((response) => {
        console.log(response);
        let ytSearch = response.result.items[0];
        //Youtube API searchs can sometimes return nonvideos as the first result. Usually channels with no videoID
        //This will filter out that first result if that is the case.
        if (!ytSearch.id.videoId) {
          ytSearch = response.result.items[1];
        }
        const convertText = (text) => {
          //The Youtube API tends to return certain strings with special characters. This function converts it back to normal
          return text.replace(/&amp;/g, "&").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
        }
        this.props.toggleVideo(
          ytSearch.id.videoId, 
          convertText(ytSearch.snippet.title),
          null,
          [response.result.items[1].id.videoId, response.result.items[2].id.videoId, response.result.items[3].id.videoId, response.result.items[4].id.videoId],
          [convertText(response.result.items[1].snippet.title), convertText(response.result.items[2].snippet.title), convertText(response.result.items[3].snippet.title), convertText(response.result.items[4].snippet.title)]
        );
      },
      function(err) { console.error("Execute error", err); });
    }
  };

  search = (event) => {
    if (event.key === "Enter") {
      this.execute(document.getElementById("search").value);
    }
  };
  render() {
    return (
      <>
        <div className="searchBar">
          <input
            id="search"
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