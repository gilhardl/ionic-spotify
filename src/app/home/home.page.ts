import { Component, OnInit, OnDestroy } from "@angular/core";

import { Plugins } from "@capacitor/core";
const { SpotifySDK } = Plugins;

const SpotifyClientId = "545b895b07ea4310b33919989f43b709";
const SpotifyRedirectUri = "fr.gilhardl.ionicspotify://callback";
const SpotifyLoginRequestCode = 12345;

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage implements OnInit, OnDestroy {
  initResult;
  loginResult;
  logoutResult;
  connectionResult;
  disconnectionResult;
  playerState: "pending" | "playing" | "paused" = "pending";

  playlistURI = "spotify:playlist:37i9dQZF1DX0XUsuxWHRQd";

  private playerStateListener;
  private playerContextListener;

  constructor() {}

  ngOnInit() {
    this.initialize();
    this.listenPlayerStateChanges();
    this.listenPlayerContextChanges();
  }

  ngOnDestroy() {
    if (this.playerStateListener) {
      this.playerStateListener.remove();
    }
    if (this.playerContextListener) {
      this.playerContextListener.remove();
    }
  }

  private async initialize() {
    return SpotifySDK.initialize({
      clientId: SpotifyClientId,
      redirectUri: SpotifyRedirectUri
    })
      .then(res => {
        this.initResult = res.result;
      })
      .catch(err => {
        console.error("Spotify SDK initialization failed :", err);
        this.initResult = false;
      });
  }

  loginSpotify() {
    SpotifySDK.login()
      .then(res => {
        this.loginResult = true;
        this.logoutResult = undefined;
        console.log(res);
      })
      .catch(err => {
        console.error("Spotify login connection failed :", err);
        this.loginResult = false;
      });
  }

  logoutSpotify() {
    SpotifySDK.disconnectFromAppRemote()
      .then(res => {
        this.loginResult = undefined;
        this.logoutResult = true;
      })
      .catch(err => {
        console.error("Spotify logout failed :", err);
        this.logoutResult = false;
      });
  }

  connectToAppRemote() {
    SpotifySDK.connectToAppRemote()
      .then(res => {
        this.connectionResult = true;
        this.disconnectionResult = undefined;
        SpotifySDK.subscribeToPlayerState();
        SpotifySDK.subscribeToPlayerContext();
      })
      .catch(err => {
        console.error("Spotify App Remote connection failed :", err);
        this.connectionResult = false;
      });
  }

  disconnectFromAppRemote() {
    SpotifySDK.disconnectFromAppRemote()
      .then(res => {
        this.connectionResult = undefined;
        this.disconnectionResult = true;
      })
      .catch(err => {
        console.error("Spotify App Remote disconnection failed :", err);
        this.disconnectionResult = false;
      });
  }

  play(uri) {
    SpotifySDK.play({
      uri: uri
    });
    this.playerState = "playing";
  }

  pause() {
    SpotifySDK.pause();
    this.playerState = "paused";
  }

  resume() {
    SpotifySDK.resume();
    this.playerState = "playing";
  }

  skipPrevious() {
    SpotifySDK.skipPrevious();
  }

  skipNext() {
    SpotifySDK.skipNext();
  }

  private listenPlayerStateChanges() {
    this.playerStateListener = SpotifySDK.addListener(
      "playerState",
      playerState => {
        console.group("Player state change");
        console.log(playerState);
        console.groupEnd();
      }
    );
  }

  private listenPlayerContextChanges() {
    this.playerContextListener = SpotifySDK.addListener(
      "playerContext",
      playerContext => {
        console.group("Player context change");
        console.log(playerContext);
        console.groupEnd();
      }
    );
  }
}
