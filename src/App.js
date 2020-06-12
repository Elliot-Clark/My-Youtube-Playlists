import React, { Component } from "react";
import "./App.css";
import axios from "./axios";
import VideoFeed from "./VideoFeed";
import LeftBar from "./leftbar/LeftBar";
import Modal from "./UI/Modal";
import SerchBar from "./searchbar/SearchBar";

class App extends Component {
  state = {
    videoTitle: "",
    videoURL: "",
    signedIn: false,
    modal: false,

    userName: "",
    userId: "",
    autostart: 1,
    videoWidth: 0.8,
    videoHeight: 0.8,

    playlists: {
      playlistTitle: "My First Playlist",
      dateCreated: "",
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
          console.log(res.data[userNumber].Playlists.videoTitles);
          this.setState((prevState) => ({
            autostart: fetchedUserSettings.autostart, 
            userId: userId,
            playlists: {
              ...prevState.playlists,
              dateCreated: res.data[userNumber].Playlists.dateCreated,
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

  toggleVideo = (URL, Title) => {
    console.log(Title);
    this.setState({ videoURL: URL, videoTitle: Title });
  }

  openModal = () => {
    this.setState({ modal: true });
  };

  closeModal = () => {
    this.setState({ modal: false });
  };

  changePlaylistTitle = () => {
    let input = document.getElementById("playlistNameInput").value;
    this.setState((prevState) => ({
      playlists: {
        ...prevState.playlists,
        playlistTitle: input,
      },
    }));

    console.log(this.state.playlists);
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

  render() {
    return (
      <>
        <SerchBar
          dataFetch={this.dataFetch}
          toggleVideo={this.toggleVideo}
          toggleSignIn={this.toggleSignIn}
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

        <Modal
          playlists={this.state.playlists}
          closeModal={this.closeModal}
          modal={this.state.modal}
          changePlaylistTitle={this.changePlaylistTitle}
          removeVideoFromPlaylist={this.removeVideoFromPlaylist}
        />

        {this.state.videoURL ? (
          <VideoFeed
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
