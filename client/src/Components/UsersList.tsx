import React from 'react';

export interface User {
  userID: string;
  username: string;
}

interface UserListProps {
  users: User[];
}

const UserList: React.FC<UserListProps> = ({ users }) => {
  return (
    <div className="user-list">
      <h2>Connected Users:</h2>
      <ul>
        {users.map((user) => (
          <li key={user.userID}>{user.username}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
