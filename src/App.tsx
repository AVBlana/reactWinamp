import React, { useState, useEffect } from "react";
import {
  signInWithPopup,
  signOut,
  auth,
  provider,
  db,
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "./firebaseConfig";
import Player from "./components/Player";
import Playlist from "./components/Playlist";
import AddSongForm from "./components/AddSongForm";

interface Song {
  title: string;
  url: string;
}

interface User {
  uid: string;
  email: string | null;
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleAddSong = async (song: Song) => {
    if (user) {
      const docRef = await addDoc(collection(db, "playlists"), {
        uid: user.uid,
        title: song.title,
        url: song.url,
      });
      setSongs([...songs, song]);
    }
  };

  const handleSelectSong = (url: string) => {
    setCurrentSong(url);
    setIsPlaying(true);
  };

  const handleLogin = async () => {
    const result = await signInWithPopup(auth, provider);
    setUser({
      uid: result.user.uid,
      email: result.user.email,
    });
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setSongs([]);
  };

  const fetchSongs = async (uid: string) => {
    const q = query(collection(db, "playlists"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    const userSongs: Song[] = [];
    querySnapshot.forEach((doc) => {
      userSongs.push(doc.data() as Song);
    });
    setSongs(userSongs);
  };

  useEffect(() => {
    if (user) {
      fetchSongs(user.uid);
    }
  }, [user]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Winamp Clone</h1>
      {!user ? (
        <button
          onClick={handleLogin}
          className="btn bg-blue-500 text-white p-2"
        >
          Login with Gogu
        </button>
      ) : (
        <>
          <button
            onClick={handleLogout}
            className="btn bg-red-500 text-white p-2 mb-4"
          >
            Logout
          </button>
          <AddSongForm onAdd={handleAddSong} />
          <Playlist songs={songs} onSelect={handleSelectSong} />
          {currentSong && <Player url={currentSong} playing={isPlaying} />}
        </>
      )}
    </div>
  );
};

export default App;
