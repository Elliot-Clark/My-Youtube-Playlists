import React, { Component } from "react";
import "./App.css";
import axios from "./axios";
import VideoFeed from "./VideoFeed";
import LeftBar from "./leftbar/LeftBar";
import RightBar from "./rightbar/RightBar"
import Modal from "./UI/Modal";
import SerchBar from "./searchbar/SearchBar";
import Popup from './UI/PopupMessage'

class App extends Component {
  state = {
    videoTitle: "",
    videoURL: "",
    startTime: 0, 
    signedIn: false,
    modal: false,
    message: "",
    playMessage: true,
    playCount: 0,
    playingVideos: [],
    searchResultURLs: [],
    searchResultTitles: [],

    userName: "",
    userId: "",
    autostart: 1,
    videoWidth: 0.75,
    videoHeight: 0.75,

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
    let userNumber = "User" + userId;
    axios.get("user-data/" + userNumber + ".json")
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          //Existing User - Database entry exists under that ID. Set the state with their data
          console.log("Existing User");
          let fetchedUserSettings = res.data;
          this.setState((prevState) => ({
            autostart: fetchedUserSettings.autostart, 
            userId: userId,
            playlists: {
              ...prevState.playlists,
              dateCreated: fetchedUserSettings.Playlists.dateCreated,
              playlistTitle: fetchedUserSettings.Playlists.playlistTitle,
              playlistDescription: fetchedUserSettings.Playlists.playlistDescription,
              videoTitles: fetchedUserSettings.Playlists.videoTitles,
              videoURLs: fetchedUserSettings.Playlists.videoURLs,
              videoStartTimes: fetchedUserSettings.Playlists.videoStartTimes
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
    const defaultUserPlaylistData = {
      playlistTitle: "My First Playlist",
      dateCreated: "",
      playlistDescription: "",
    };
    this.setState((prevState) => ({
      playlists: {
        ...prevState.playlists,
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

  toggleVideo = (URL, title, startTime, searchResultURLs, searchResultTitles) => {
    this.setState({ 
      videoURL: URL, 
      videoTitle: title,
      startTime: startTime,
      modal: false
    });
    if (searchResultURLs) {
      this.setState({
        searchResultTitles: searchResultTitles,
        searchResultURLs: searchResultURLs
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
        dateCreated: date,
        playlistDescription: "",
        playlistTitle: "My First Playlist"
      }
      axios.patch("user-data/User" + this.state.userId + "/Playlists.json", update);
      this.setState((prevState) => ({
        playlists: {
          ...prevState.playlists,
          dateCreated: date,
          playlistDescription: "",
          playlistTitle: "My First Playlist"
        },
      }));
      this.showUserMessage("Video Added to Playlist!");
    } 
    if (this.state.playlists.videoURLs.includes(this.state.videoURL)) {
      this.showUserMessage("Video is already on your Playlist");
      return
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
    this.showUserMessage("Video Added to Playlist!");
  }

  removeVideoFromPlaylist = (index) => {
    console.log(index);
    console.log(this.state.playlists);
    console.log(this.state.playlists.videoURLs);
    const remove = {}, removeIndex = index;
    remove[removeIndex] = 0;
    axios.patch("user-data/User" + this.state.userId + "/Playlists/videoStartTimes/.json", remove);
    axios.patch("user-data/User" + this.state.userId + "/Playlists/videoTitles/.json", remove);
    axios.patch("user-data/User" + this.state.userId + "/Playlists/videoURLs/.json", remove);
    let a = this.state.playlists.videoStartTimes;
    let b = this.state.playlists.videoURLs;
    let c = this.state.playlists.videoTitles;
    a.splice(index, 1, 0);
    b.splice(index, 1, 0);
    c.splice(index, 1, 0);

    this.setState((prevState) => ({
      playlists: {
        ...prevState.playlists,
        videoStartTimes: a,
        videoURLs: b,
        videoTitles: c
      },
    }));
    this.showUserMessage("Video Removed");
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
    let ele = this.state.playCount;
    this.setState({ playCount: ele += 1});
    this.playPlaylist();
  }

  resetPlayCount = () => {
    this.setState({ playCount: 0});
  }

  showUserMessage = (text) => {
    //Sets and shows the message the user sees while preventing user spam
    let setMessage = () => {
      this.setState({ message: "", playMessage: true });
    }
    if (this.state.playMessage) {
      this.setState({ message: text, playMessage: false });
      setTimeout(setMessage, 1600);
    }
  }

  test = () => {
    console.log("lokmhjhg");
    if (this.state.playMessage) {
      let adjustVideo = () => {
        this.setState({ playMessage: true});
      }
      this.setState({playMessage: false});
      setTimeout(adjustVideo, 1600);
    }
    
  }


  render() {

    window.onresize = () => this.test();
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
          toggleVideo={this.toggleVideo}
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
            playingVideos={this.state.playingVideos}
            playCount={this.playCount}
            videoURL={this.state.videoURL}
            startTime={this.state.startTime}
            videoWidth={this.state.videoWidth}
            videoHeight={this.state.videoHeight}
            autostart={this.state.autostart}
          />
        ) : (
          ""
        )}

        {this.state.message ? (
          <Popup 
            message={this.state.message}
          />
        ) : (
          ""
        )}
        
      </>
    );
  }
}

export default App;
