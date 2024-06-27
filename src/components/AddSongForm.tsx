import React, { useState } from "react";

interface AddSongFormProps {
  onAdd: (song: { title: string; url: string }) => void;
}

const AddSongForm: React.FC<AddSongFormProps> = ({ onAdd }) => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ title, url });
    setTitle("");
    setUrl("");
  };

  return (
    <form onSubmit={handleSubmit} className="add-song-form">
      <input
        type="text"
        placeholder="Song Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input"
      />
      <input
        type="text"
        placeholder="Song URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="input"
      />
      <button type="submit" className="btn">
        Add Song
      </button>
    </form>
  );
};

export default AddSongForm;
