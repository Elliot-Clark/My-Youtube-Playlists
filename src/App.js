import React, { Component } from "react";
import "./App.css";
import axios from "./axios";
import VideoFeed from "./VideoFeed";
import LeftBar from "./leftbar/LeftBar";
import RightBar from "./rightbar/RightBar"
import Modal from "./UI/Modal";
import SerchBar from "./searchbar/SearchBar";

class App extends Component {
  state = {
    videoTitle: "",
    videoURL: "",
    signedIn: false,
    modal: false,
    playCount: 0,
    playingVideos: [],
    searchResultURLs: [],
    searchResultTitles: [],

    userName: "",
    userId: "",
    autostart: 1,
    videoWidth: 0.8,
    videoHeight: 0.8,

    playlists: {
      playlistTitle: "My First Playlist...",
      dateCreated: "",
      playlistDescription: "",
      videoTitles: [],
      videoURLs: [],
      videoStartTimes: [],
    },
  };

  dataFetch = (userId) => {
    const fetch = axios
      .get("user-data.json")
      .then((res) => {
        let userNumber = "User" + userId;
        if (res.data[userNumber]) {
          //Existing User - Database entry exists under that ID. Set the state with their data
          console.log("Existing User");
          let fetchedUserSettings = res.data[userNumber];
          console.log(res.data[userNumber].Playlists.playlistTitle);
          this.setState((prevState) => ({
            autostart: fetchedUserSettings.autostart, 
            userId: userId,
            playlists: {
              ...prevState.playlists,
              dateCreated: res.data[userNumber].Playlists.dateCreated,
              playlistTitle: res.data[userNumber].Playlists.playlistTitle,
              playlistDescription: res.data[userNumber].Playlists.playlistDescription,
              videoTitles: res.data[userNumber].Playlists.videoTitles,
              videoURLs: res.data[userNumber].Playlists.videoURLs,
              videoStartTimes: res.data[userNumber].Playlists.videoStartTimes
            },
          }));
        } else {
          //New User - Save default data under their ID
          console.log("New user");
          this.setState({ userId: userId });
          this.defaultDataPost();
        }
      })
      .catch((error) => console.log(error));
  };

  defaultDataPost = () => {
    const defaultUserData = {
      userName: this.state.userName,
      userId: this.state.userId,
      autostart: this.state.autostart,
    };
    console.log(this.state.userId);
    axios.put("user-data/User" + this.state.userId + ".json", defaultUserData);
    const PLACEHOLDERDATA = 0;
    const defaultUserPlaylistData = {
      playlistTitle: "My First Playlist",
      dateCreated: "",
      playlistDescription: "",
      videoTitles: [PLACEHOLDERDATA, PLACEHOLDERDATA],
      videoURLs: [PLACEHOLDERDATA, PLACEHOLDERDATA],
      videoStartTimes: [PLACEHOLDERDATA, PLACEHOLDERDATA],
    };
    this.setState((prevState) => ({
      playlists: {
        ...prevState.playlists,
        videoTitles: [PLACEHOLDERDATA, PLACEHOLDERDATA],
        videoURLs: [PLACEHOLDERDATA, PLACEHOLDERDATA],
        videoStartTimes: [PLACEHOLDERDATA, PLACEHOLDERDATA]
      },
    }));
    axios
      .put("user-data/User" + this.state.userId + "/Playlists.json", defaultUserPlaylistData)
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  };

  toggleAutostart = () => {
    if (this.state.autostart) {
      this.setState({ autostart: 0 });
    } else {
      this.setState({ autostart: 1 });
    }
  };

  toggleSignIn = () => {
    this.setState({ signedIn: true });
  };

  toggleVideo = (URL, title, searchResultURLs, searchResultTitles) => {
    console.log(URL, title, searchResultURLs, searchResultTitles);
    this.setState({ videoURL: URL});
    if (searchResultURLs) {
      this.setState({
        videoTitle: title,
        searchResultTitles: searchResultTitles,
        searchResultURLs, searchResultURLs
      });
    }
   
  }

  openModal = () => {
    this.setState({ modal: true });
  };

  closeModal = () => {
    this.setState({ modal: false });
  };

  changePlaylistTitle = () => {
    const input = document.getElementById("playlistNameInput").value;
    const update = {
      playlistTitle: input
    }
    axios.patch("user-data/User" + this.state.userId + "/Playlists.json", update);
    this.setState((prevState) => ({
      playlists: {
        ...prevState.playlists,
        playlistTitle: input,
      },
    }));
  };

  changePlaylistDescription = () => {
    const input = document.getElementById("playlistDescriptionInput").value;
    const update = {
      playlistDescription: input
    }
    axios.patch("user-data/User" + this.state.userId + "/Playlists.json", update);
    this.setState((prevState) => ({
      playlists: {
        ...prevState.playlists,
        playlistDescription: input,
      },
    }));
  };

  addVideoToPlaylist = () => {
    if (!this.state.playlists.dateCreated) {
      //No videos, creating a new playlist
      console.log("No videos. Creating new playlist...");
      let date = new Date();
      date = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
      const update = {
        dateCreated: date
      }
      axios.patch("user-data/User" + this.state.userId + "/Playlists.json", update);
      this.setState((prevState) => ({
        playlists: {
          ...prevState.playlists,
          dateCreated: date,
        },
      }));
    } 
    console.log("Adding to existing playlist and posting data");
    const count = this.state.playlists.videoURLs.length;
    console.log(count);
    let header = {};
    header[count] = this.state.videoURL;
    axios.patch("user-data/User" + this.state.userId + "/Playlists/videoURLs.json", header)
    .then (() => {
      header[count] = this.state.videoTitle;
      axios.patch("user-data/User" + this.state.userId + "/Playlists/videoTitles.json", header)
      .then(() => {
        header[count] = 0;
        axios.patch("user-data/User" + this.state.userId + "/Playlists/videoStartTimes.json", header);
      })
    })
    .catch((error) => {console.log(error)});

    let newVideoURLs = this.state.playlists.videoURLs.concat(this.state.videoURL);
    let newVideoTitles = this.state.playlists.videoTitles.concat(this.state.videoTitle)
    this.setState((prevState) => ({
      playlists: {
        ...prevState.playlists,
        videoURLs: newVideoURLs,
        videoTitles: newVideoTitles
      },
    }));
    
  }

  removeVideoFromPlaylist = (index) => {
    console.log(index);
    console.log(this.state.playlists);
    console.log(this.state.playlists.videoURLs);
    axios.delete("user-data/User" + this.state.userId + "/Playlists/videoStartTimes/" + index + ".json");
    axios.delete("user-data/User" + this.state.userId + "/Playlists/videoTitles/" + index + ".json");
    axios.delete("user-data/User" + this.state.userId + "/Playlists/videoURLs/" + index + ".json");
    console.log(index);
    let a = this.state.playlists.videoStartTimes;
    a.splice(index, 1, null);
    let b = this.state.playlists.videoURLs;
    b.splice(index, 1, null);
    let c = this.state.playlists.videoTitles;
    c.splice(index, 1, null);

    this.setState((prevState) => ({
      playlists: {
        ...prevState.playlists,
        videoStartTimes: a,
        videoURLs: b,
        videoTitles: c
      },
    }));
    console.log(this.state.playlists.videoURLs);
    if (this.state.playlists.videoURLs.every(element => element === null)) {
      let a = {
        dateCreated: ""
      };
      axios.put("user-data/User" + this.state.userId + "/Playlists.json", a);
      this.setState((prevState) => ({
        playlists: {
          ...prevState.playlists,
          dateCreated: ""
        },
      }));
    }
  }

  playPlaylist = (videoArray) => {
    //Receive array of URLS to play
    if (videoArray) {
      //Executes when the play button is pressed in the playlist menu
      //Sets the array of upcoming videos, and plays the first one in the list
      this.setState({ playingVideos: videoArray, videoURL: videoArray[0]});
      this.closeModal();
    } else {
      //Executes at the end of each playlist video
      this.setState({ videoURL: this.state.playingVideos[this.state.playCount]});
      this.closeModal();
    }
  }

  playCount = () => {
    this.setState({ playCount: this.state.playCount += 1});
    this.playPlaylist();
  }

  resetPlayCount = () => {
    this.setState({ playCount: 0});
  }

  render() {
    return (
      <>

        <SerchBar
          dataFetch={this.dataFetch}
          toggleVideo={this.toggleVideo}
          toggleSignIn={this.toggleSignIn}
          signedIn={this.state.signedIn}
        />

        <LeftBar
          signedIn={this.state.signedIn}
          toggleAutostart={this.toggleAutostart}
          dateCreated={this.state.playlists.dateCreated}
          autostart={this.state.autostart}
          videoURL={this.state.videoURL}
          openModal={this.openModal}
          addVideoToPlaylist={this.addVideoToPlaylist}
        />

        {this.state.searchResultTitles.length ? (
          <RightBar 
            searchResultURLs={this.state.searchResultURLs}
            searchResultTitles={this.state.searchResultTitles}
            toggleVideo={this.toggleVideo}
          />
        ) : (
          ""
        )}

        <Modal
          playlists={this.state.playlists}
          playPlaylist={this.playPlaylist}
          resetPlayCount={this.resetPlayCount}
          closeModal={this.closeModal}
          modal={this.state.modal}
          changePlaylistTitle={this.changePlaylistTitle}
          changePlaylistDescription={this.changePlaylistDescription}
          removeVideoFromPlaylist={this.removeVideoFromPlaylist}
        />

        {this.state.videoURL ? (
          <VideoFeed
            playCount={this.playCount}
            videoURL={this.state.videoURL}
            videoWidth={this.state.videoWidth}
            videoHeight={this.state.videoHeight}
            autostart={this.state.autostart}
          />
        ) : (
          ""
        )}
      </>
    );
  }
}

export default App;
