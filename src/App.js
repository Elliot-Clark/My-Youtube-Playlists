import React, { Component } from "react";
import "./App.css";
import axios from "./axios";
import VideoFeed from "./VideoFeed";
import LeftBar from "./leftbar/LeftBar";
import RightBar from "./rightbar/RightBar"
import BottomBar from "./bottombar/BottomBar"
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
    confirmationWindow: false,
    playlistCount: 1,
    numberOfPlaylists: 1,
    message: "",
    playMessage: true,
    playCount: 0,
    playingVideos: [],
    playingVideosTitles: [],
    playingVideosStartTime: [],
    loopPlaylist: true,
    searchResultURLs: [],
    searchResultTitles: [],
    userId: "",
    autostart: 1,

    playlists: {
      playlistTitle: "Playlist 1",
      dateCreated: "",
      playlistDescription: "",
      videoTitles: [],
      videoURLs: [],
      videoStartTimes: [],
    },
  };

  dataFetch = (userId) => {
    //With the user logged in, this function makes a call to the database for any possible data
    let userNumber = "User" + userId;
    axios.get("user-data/" + userNumber + ".json")
      .then((res) => {
        if (res.data) {
          //Existing User - Database entry exists under that ID. Set the state with their data
          let fetchedUserSettings = res.data['Playlists' + this.state.playlistCount.toString()];
          let max = Object.keys(res.data).length - 2;
          this.setState((prevState) => ({
            autostart: res.data.autostart, 
            userId: userId,
            numberOfPlaylists: max,
            playlists: {
              ...prevState.playlists,
              dateCreated: fetchedUserSettings.dateCreated,
              playlistTitle: fetchedUserSettings.playlistTitle,
              playlistDescription: fetchedUserSettings.playlistDescription,
            },
          }));
          this.togglePlaylistCount(1);
        } else {
          //New User - Save default data under their ID
          this.setState({ userId: userId });
          this.defaultDataPost();
        }
      })
      .catch((error) => console.log(error));
  };

  createNewPlaylist = () => {
    //Creates a new playlist in the state and also in the database
    let defaultUserPlaylistData = {
      playlistTitle: "Playlist " + (this.state.numberOfPlaylists + 1).toString(),
      dateCreated: "",
      playlistDescription: "",
      videoStartTimes : {
        0: 0
      },
      videoTitles : {
        0: 0
      },
      videoURLs : {
        0: 0
      }
    };
    axios.get("user-data/User" + this.state.userId + ".json")
    .then(() => {
      axios.put("user-data/User" + this.state.userId + "/Playlists" + (this.state.numberOfPlaylists + 1) + ".json", defaultUserPlaylistData)
      .then(() => {
        let ele = this.state.numberOfPlaylists + 1;
        this.setState({ 
          playlistCount: ele, 
          numberOfPlaylists: ele
        }, () => {
          this.togglePlaylistCount("new playlist");
        });
      })
    })
  }

  defaultDataPost = () => {
    //If a new user logs in, this function runs to send a basic set of data under their ID
    const defaultUserData = {
      userId: this.state.userId,
      autostart: this.state.autostart,
    };
    axios.put("user-data/User" + this.state.userId + ".json", defaultUserData);
    const defaultUserPlaylistData = {
      playlistTitle: "Playlist 1",
      dateCreated: "",
      playlistDescription: "",
    };
    this.setState((prevState) => ({
      playlists: {
        ...prevState.playlists,
      },
    }));
    axios
      .put("user-data/User" + this.state.userId + "/Playlists" + this.state.playlistCount + ".json", defaultUserPlaylistData)
      .then((response) => console.log(response))
      .catch((error) => console.log(error));
  };

  toggleAutostart = () => {
    //Simple toggle function. If on, turn off. If off turn on. Also update database with the setting
    if (this.state.autostart) {
      this.setState({ autostart: 0 });
      if (this.state.signedIn) {
        const update = {
          autostart: 0
        }
        axios.patch("user-data/User" + this.state.userId + ".json", update);
      }
    } else {
      this.setState({ autostart: 1 });
      if (this.state.signedIn) {
        const update = {
          autostart: 1
        }
        axios.patch("user-data/User" + this.state.userId + ".json", update);
      }
    }
  };

  toggleSignIn = () => {
    this.setState({ signedIn: true });
  };

  toggleVideo = (URL, title, startTime, searchResultURLs, searchResultTitles) => {
    //The main function to play a video
    //Runs after every search, or every new video on a playlist.
    let titleCheck = title;
    if (title.item) {
      titleCheck = title.item;
    }
    this.setState({ 
      videoURL: URL, 
      videoTitle: titleCheck,
      startTime: startTime,
      playingVideos: [],
      playingVideosTitles: [],
      modal: false
    });
    if (searchResultURLs) {
      this.setState({
        searchResultTitles: searchResultTitles,
        searchResultURLs: searchResultURLs
      });
    }
   
  }

  toggleLoop = () => {
    if (this.state.loopPlaylist) {
      this.setState({ loopPlaylist: 0 });
    } else {
      this.setState({ loopPlaylist: 1 });
    }
  }

  togglePlaylistCount = (ele) => {
    //This function revolves around the user changing which playlist they want to view in the modal
    let changePlaylists = () => {
      let userNumber = "User" + this.state.userId;
      axios.get("user-data/" + userNumber + "/Playlists" + this.state.playlistCount + ".json")
      .then((res) => {
        let vt = res.data.videoTitles
        let vu = res.data.videoURLs
        let vst = res.data.videoStartTimes
        if (!res.data.videoTitles) {
          vt = []
          vu = []
          vst = []
        }
        this.setState((prevState) => ({
          playlists: {
            ...prevState.playlists,
            dateCreated: res.data.dateCreated,
            playlistTitle: res.data.playlistTitle,
            playlistDescription: res.data.playlistDescription,
            videoTitles: vt,
            videoURLs: vu,
            videoStartTimes: vst
          },
        }));
      })
    }
    if (Number.isInteger(ele)) {
      this.setState({ playlistCount: ele}, () => {
        changePlaylists();
      });
    }
    if (ele === 'new playlist') {
      changePlaylists();
    }
  }

  showConfirmationWindow = () => {
    if (!this.state.confirmationWindow) {
      this.setState({ confirmationWindow: true});
    } else {
      this.setState({ confirmationWindow: false});
    }
  }

  openModal = () => {
    this.setState({ modal: true });
  };

  closeModal = () => {
    this.setState({ modal: false });
  };

  changePlaylistTitle = () => {
    //Changes the playlist title in both state and database
    const input = document.getElementById("playlistNameInput").value;
    const update = {
      playlistTitle: input
    }
    axios.patch("user-data/User" + this.state.userId + "/Playlists" + this.state.playlistCount + ".json", update);
    this.setState((prevState) => ({
      playlists: {
        ...prevState.playlists,
        playlistTitle: input,
      },
    }));
  };

  changePlaylistDescription = () => {
    //Changes the playlist title in both state and database
    const input = document.getElementById("playlistDescriptionInput").value;
    const update = {
      playlistDescription: input
    }
    axios.patch("user-data/User" + this.state.userId + "/Playlists" + this.state.playlistCount + ".json", update);
    this.setState((prevState) => ({
      playlists: {
        ...prevState.playlists,
        playlistDescription: input,
      },
    }));
  };

  addVideoToPlaylist = () => {
    //The function revolves around a user saving the active video to their playlist
    if (!this.state.playlists.dateCreated) {
      //No videos, creating a new playlist
      let date = new Date();
      date = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
      let ele = "Playlist 1"
      if (this.state.playlistCount > 1 ) {
        ele = "Playlist " + this.state.numberOfPlaylists.toString();
      }
      const update = {
        dateCreated: date,
        playlistDescription: "",
        playlistTitle: ele
      }
      axios.patch("user-data/User" + this.state.userId + "/Playlists" + this.state.playlistCount + ".json", update);
      this.setState((prevState) => ({
        playlists: {
          ...prevState.playlists,
          dateCreated: date,
          playlistDescription: "",
        },
      }));
      this.showUserMessage("Video Added to " + this.state.playlists.playlistTitle);
    } 
    if (this.state.playlists.videoURLs.includes(this.state.videoURL)) {
      this.showUserMessage("Video is already on your Playlist");
      return
    }
    const count = this.state.playlists.videoURLs.length;
    let header = {};
    header[count] = this.state.videoURL;
    axios.patch("user-data/User" + this.state.userId + "/Playlists" + this.state.playlistCount + "/videoURLs.json", header)
    .then (() => {
      header[count] = this.state.videoTitle;
      axios.patch("user-data/User" + this.state.userId + "/Playlists" + this.state.playlistCount + "/videoTitles.json", header)
      .then(() => {
        header[count] = 0;
        axios.patch("user-data/User" + this.state.userId + "/Playlists" + this.state.playlistCount + "/videoStartTimes.json", header);
      })
    })
    .catch((error) => {console.log(error)});
    let newVideoURLs = this.state.playlists.videoURLs.concat(this.state.videoURL);
    let newVideoTitles = this.state.playlists.videoTitles.concat(this.state.videoTitle);
    let newVideoStartTimes = this.state.playlists.videoStartTimes;
    newVideoStartTimes.push('0');
    this.setState((prevState) => ({
      playlists: {
        ...prevState.playlists,
        videoURLs: newVideoURLs,
        videoTitles: newVideoTitles,
        videoStartTimes: newVideoStartTimes
      },
    }));
    this.showUserMessage("Video Added to " + this.state.playlists.playlistTitle);
  }

  removeVideoFromPlaylist = (index) => {
    //Removes the video from state and database
    const remove = {}, removeIndex = index;
    remove[removeIndex] = 0;
    axios.patch("user-data/User" + this.state.userId + "/Playlists" + this.state.playlistCount + "/videoStartTimes/.json", remove);
    axios.patch("user-data/User" + this.state.userId + "/Playlists" + this.state.playlistCount + "/videoTitles/.json", remove);
    axios.patch("user-data/User" + this.state.userId + "/Playlists" + this.state.playlistCount + "/videoURLs/.json", remove);
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
    if (this.state.playlists.videoURLs.every(element => element === null)) {
      let a = {
        dateCreated: ""
      };
      axios.put("user-data/User" + this.state.userId + "/Playlists" + this.state.playlistCount + ".json", a);
      this.setState((prevState) => ({
        playlists: {
          ...prevState.playlists,
          dateCreated: ""
        },
      }));
    }
  }

  deletePlaylist = () => {
    //Moves all the playlists down one, and deletes the last playlist in the object, before uploading the new object to the database.
    axios.get("user-data/User" + this.state.userId + ".json")
      .then((res) => {
        for (let x = this.state.playlistCount; x < this.state.numberOfPlaylists; x++ ) {
          res.data["Playlists" + x] = res.data["Playlists" + (x + 1)];
        }
        delete res.data["Playlists" + this.state.numberOfPlaylists];
        axios.put("user-data/User" + this.state.userId + ".json", res.data).then(() => {
          this.setState({ numberOfPlaylists: this.state.numberOfPlaylists -1 }, () => {
            if (this.state.playlistCount === this.state.numberOfPlaylists +1) {
              this.togglePlaylistCount(this.state.numberOfPlaylists);
            } else {
              this.togglePlaylistCount("new playlist")
            }
          });
        })
      })
  }

  changePlaylistStartTime = (index, time) => {
    //Stores the start times in the database, but only if it is different from the one already stored for it
    if (this.state.playlists.videoStartTimes[index] !== time) {
      const change = {}, changeIndex = index;
      change[changeIndex] = time;
      axios.patch("user-data/User" + this.state.userId + "/Playlists" + this.state.playlistCount + "/videoStartTimes/.json", change);
      let a = this.state.playlists.videoStartTimes;
      a.splice(index, 1, time);
      this.setState((prevState) => ({
        playlists: {
          ...prevState.playlists,
          videoStartTimes: a,
        },
      }));
    } else {
      return
    }
  }

  playPlaylist = (videoArray, videoTitles, startTimes) => {
    //Receive array of URLS to play when user plays a playlist
    if (videoArray) {
      //Executes when the play button is pressed in the playlist menu
      //Sets the array of upcoming videos, and plays the first one in the list
      this.setState({ 
        playingVideos: videoArray, 
        playingVideosTitles: videoTitles,  
        playingVideosStartTime: startTimes,
        videoURL: videoArray[0],
        videoTitle: videoTitles[0],
        startTime: startTimes[0],
        modal: false,
      })
    } else {
      //Executes at the end of each playlist video
      this.setState({ 
        videoURL: this.state.playingVideos[this.state.playCount],
        videoTitle: this.state.playingVideosTitles[this.state.playCount], 
        startTime: this.state.playingVideosStartTime[this.state.playCount]
      });
    }
  }

  playCount = () => {
    //Playcount is the state variable in charge of which video in a playlist array to play
    if (this.state.playCount === this.state.playingVideos.length -1 && this.state.loopPlaylist) {
      this.setState({ playCount: 0 }, () => {
        this.playPlaylist();
      });
      return
    }
    let ele = this.state.playCount
    this.setState({ playCount: ele +=1}, () => {
      this.playPlaylist()
    }); 
  }

  reversePlayCount = () => {
    //If the user hits the back arrow while playing a playlist video
    let ele = this.state.playCount;
    this.setState({ playCount: ele -=1}, () => {
      this.playPlaylist()
    });
  }

  resetPlayCount = () => {
    //Reseting playlist count for playing another playlist
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



  render() {
    console.log(this.state.userId);
    return (
      <>  

        {this.state.videoTitle ? (
          <BottomBar 
            playingVideos={this.state.playingVideos}
            videoURL={this.state.videoURL}
            reversePlayCount={this.reversePlayCount}
            playCount={this.playCount}
            playCountState={this.state.playCount}
            videoTitle={this.state.videoTitle}
          />) : (
          ''
        )}

        <SerchBar
          playlistTitle={this.state.playlists.playlistTitle}
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
          playingVideos={this.state.playingVideos}
          addVideoToPlaylist={this.addVideoToPlaylist}
        />

        {this.state.searchResultTitles.length && !this.state.playingVideos.length ?  (
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
          looping={this.state.loopPlaylist}
          createNewPlaylist={this.createNewPlaylist}
          togglePlaylistCount={this.togglePlaylistCount}
          deletePlaylist={this.deletePlaylist}
          playlistCount={this.state.playlistCount}
          numberOfPlaylists={this.state.numberOfPlaylists}
          toggleLoop={this.toggleLoop}
          playlists={this.state.playlists}
          playPlaylist={this.playPlaylist}
          resetPlayCount={this.resetPlayCount}
          closeModal={this.closeModal}
          modal={this.state.modal}
          showConfirmationWindow={this.showConfirmationWindow}
          confirmationWindow={this.state.confirmationWindow}
          changePlaylistStartTime={this.changePlaylistStartTime}
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
