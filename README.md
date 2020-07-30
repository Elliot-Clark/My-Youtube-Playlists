My YouTube Playlists is an app designed to replicate playlist functionality of YouTube in a simple layout while also including a few additional benefits.

## Added Perks:
    - Lightweight Single page app, less loading between videos and menus
    - Can specify a starting time for each individual video on your Playlist
    - None of the new white screen ads you may find on YouTube
    - Instant playing of a video after a search (Toggleable on/off) 

This project was not based on a tutorial but rather my desire to showcase my knowledge in React and interacting with a Firebase database.

## Installing:

Other than the normal 'npm install' and 'npm start' you will also need to rename '.envExample' to '.env'. Inside paste your API and 0Auth keys in the specificed areas, both of which you can get, for free, from the Google Developers Console website. The API key enable the YouTube search function, while the 0Auth enable Google sign in to your presaved playlists.

Alternatively, this app can be used on my own website:
Do note, it is made using the free API key, so the amount of searchs you can perform in one day is limited to 100. Playing videos from your playlists, however, do not require API key usage and can be done as many times as you wish.

## Usage:

Similar to using YouTube, type in a search in the search bar at the top of the page to return videos. 

Sign in through Google to enable the Playlist feature. Tto add the active video into your playlist, click the Add Video to Playlist button. The current playlist it will be added to is displayed on the upper right of the search bar. To change active playlists, click on the playlist button then click on the red icons on the upper right hand side of the modal.

To play a playlist, simply open the playlist modal and click the green play button. Playlists can be played in their added order, or shuffled to play in a random order. Playlists can also loop to play again upon reaching the end of the final video in your playlist.


## Notes:
-While it is possible to use this app on mobile, it will not function as seamlessly as a PC. This is due to mobile phones not allowing YouTube videos to autoplay to reduce spam.

-Currently there appears to be a random chance of Google sign in failing. If this problem prosists, simply refresh the page to fix it.