import React, { Component } from "react";
import "./App.css";
import axios from "./axios";
import VideoFeed from "./VideoFeed";
import fakeData from "./Fakedata";
import LeftBar from "./leftbar/LeftBar";
import Modal from "./UI/Modal";
import SerchBar from "./searchbar/SearchBar";

class App extends Component {
  state = {
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
      videoTitles: ["a"],
      videoURLs: ["a"],
      videoStartTimes: [0],
    },
  };

  dataFetch = (userId) => {
    const fetch = axios
      .get("user-data.json")
      .then((res) => {
        let userNumber = "User" + userId;
        console.log(res.data);
        if (res.data[userNumber]) {
          //Existing User - Data exists under that ID. Set the state with their data
          console.log("Existing User");
          let fetchedUserSettings = res.data[userNumber];
          console.log(this);
          this.setState({ autostart: fetchedUserSettings.autostart });
        } else {
          //New User - Save default data under their ID
          console.log("New user");
          this.setState({ userId: userNumber });
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
      .put(
        "user-data/User" + this.state.userId + "/Playlists.json",
        defaultUserPlaylistData
      )
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

  toggleVideoURL = (URL) => {
    this.setState({ videoURL: URL })
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
        pl1: {
          ...prevState.playlists.pl1,
          playlistTitle: input,
        },
      },
    }));

    console.log(this.state.playlists);
  };

  addVideo = () => {
    console.log("I b adding");
    if (!this.state.playlists.dateCreated) {
      console.log("No videos. Creating new playlist...");
      let date = new Date();
    console.log(date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear());
    } else {
      console.log("Adding to existing playlist and posting data");
    }
  }

  render() {
    return (
      <>

      <button onClick={this.addVideo}>Add Video</button>

        <SerchBar
          dataFetch={this.dataFetch}
          toggleVideoURL={this.toggleVideoURL}
        />

        <LeftBar
          toggleAutostart={this.toggleAutostart}
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
