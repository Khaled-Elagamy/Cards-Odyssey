import React, { useState, ChangeEvent, FormEvent } from 'react';

type UsernameInputProps = {
  onUsernameSelection: (username: string) => void;
};

const UsernameInput: React.FC<UsernameInputProps> = ({ onUsernameSelection }) => {
  const [username, setUsername] = useState('');

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onUsernameSelection(username);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={handleUsernameChange}
        />
        <button type="submit">Select Username</button>
      </form>
    </div>
  );
};

export default UsernameInput;
