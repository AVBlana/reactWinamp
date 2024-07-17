import React, { useContext, useEffect, useState } from "react";
import AddSongForm from "./components/AddSongForm";
import Player from "./components/Player";
import Playlist from "./components/Playlist";
import { Search } from "./components/Search";
import {
  addDoc,
  collection,
  db,
  getDocs,
  query,
  where,
} from "./firebaseConfig";
import { AppContext } from "./context/App";
import { PlayingContext } from "./context/Playing";
import SpotSearch from "./components/SpotSearch";

const App: React.FC = () => {
  const { user, handleLogin, handleLogout } = useContext(AppContext);

  const { currentSong } = useContext(PlayingContext);
  const Logout = async () => {
    await handleLogout();
  };

  // const handleAddSong = async (song: Song) => {
  //   if (user) {
  //     const docRef = await addDoc(collection(db, "playlists"), {
  //       uid: user.uid,
  //       title: song.title,
  //       url: song.url,
  //     });
  //     setSongs([...songs, song]);
  //   }
  // };

  // const fetchSongs = async (uid: string) => {
  //   const q = query(collection(db, "playlists"), where("uid", "==", uid));
  //   const querySnapshot = await getDocs(q);
  //   const userSongs: Song[] = [];
  //   querySnapshot.forEach((doc) => {
  //     userSongs.push(doc.data() as Song);
  //   });
  //   setSongs(userSongs);
  // };

  // useEffect(() => {
  //   if (user) {
  //     fetchSongs(user.uid);
  //   }
  // }, [user]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">ReAMP</h1>
      <SpotSearch />
      <Search />
      <Player />

      {!user ? (
        <button
          onClick={handleLogin}
          className="btn bg-blue-500 text-white p-2"
        >
          Login with Google
        </button>
      ) : (
        <>
          <button
            onClick={Logout}
            className="btn bg-red-500 text-white p-2 mb-4"
          >
            Logout
          </button>

          {/* <AddSongForm onAdd={handleAddSong} />
          <Playlist songs={songs} onSelect={handleSelectSong} /> */}
        </>
      )}
    </div>
  );
};

export default App;
