import React, { Component } from "react";
import "./App.css";
import axios from "./axios";
import VideoFeed from "./VideoFeed";
import LeftBar from "./leftbar/LeftBar";
import Modal from "./UI/Modal";
import SerchBar from "./searchbar/SearchBar";

class App extends Component {
  state = {
    videoTitle: "Rick Roll",
    videoURL: "dQw4w9WgXcQ",
    signedIn: false,
    modal: false,

    userName: "",
    userId: "107403535112570513553",
    autostart: 1,
    videoWidth: 0.8,
    videoHeight: 0.8,

    playlists: {
      playlistTitle: "My First Playlist",
      dateCreated: "",
      videoTitles: ["0"],
      videoURLs: ["0"],
      videoStartTimes: [0],
    },
  };

  dataFetch = (userId) => {
    const fetch = axios
      .get("user-data.json")
      .then((res) => {
        let userNumber = "User" + userId;
        if (res.data[userNumber]) {
          //Existing User - Data exists under that ID. Set the state with their data
          console.log("Existing User");
          let fetchedUserSettings = res.data[userNumber];
          this.setState({ autostart: fetchedUserSettings.autostart, userId: userId });
          this.setState((prevState) => ({
            playlists: {
              ...prevState.playlists,
              dateCreated: res.data[userNumber].Playlists.dateCreated,
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
    let defaultUserData = {
      userName: this.state.userName,
      userId: this.state.userId,
      autostart: this.state.autostart,
    };
    console.log(this.state.userId);
    axios.put("user-data/User" + this.state.userId + ".json", defaultUserData);
    let defaultUserPlaylistData = {
      playlistTitle: "My First Playlist",
      dateCreated: "",
      videoTitles: [0],
      videoURLs: [0],
      videoStartTimes: [0],
    };
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

  addVideo = () => {
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
          dateCreated: "true",
        },
      }));
      const url = {
        0: this.state.videoURL
      }
      axios.put("user-data/User" + this.state.userId + "/Playlists/videoURLs.json", url);
    } else {
      console.log("Adding to existing playlist and posting data");
      const count = this.state.playlists.videoURLs.length;
      let url = {};
      url[count] = this.state.videoURL;
      axios.patch("user-data/User" + this.state.userId + "/Playlists/videoURLs.json", url);
      let newVideoURLs = this.state.playlists.videoURLs.concat(this.state.videoURL);
      this.setState((prevState) => ({
        playlists: {
          ...prevState.playlists,
          videoURLs: newVideoURLs,
        },
      }));
    }
  }

  render() {
    return (
      <>
      {/* Only shows if signed in and videoURL exists */}
      <button onClick={this.addVideo}>Add Video</button>

        <SerchBar
          dataFetch={this.dataFetch}
          toggleVideo={this.toggleVideo}
        />

        <LeftBar
          toggleAutostart={this.toggleAutostart}
          dateCreated={this.state.playlists.dateCreated}
          autostart={this.state.autostart}
          videoURL={this.state.videoURL}
          openModal={this.openModal}
        />

        <Modal
          playlists={this.state.playlists}
          closeModal={this.closeModal}
          modal={this.state.modal}
          changePlaylistTitle={this.changePlaylistTitle}
        />

        {/* {this.state.videoURL ? (
          <VideoFeed
            videoURL={this.state.videoURL}
            videoWidth={this.state.videoWidth}
            videoHeight={this.state.videoHeight}
            autostart={this.state.autostart}
          />
        ) : (
          ""
        )} */}
      </>
    );
  }
}

export default App;
