import { useAppSelector } from '../../redux/hooks'; // Ensure this is correctly set up
import { selectUser } from '../../redux/features/auth/authSlice'; // Import the selector

const UserProfile = () => {
  // Use the selector to get user data from Redux
  const user = useAppSelector(selectUser);
  console.log(user)
  return (
    <div>
      <h1>User Profile</h1>
      {user ? (
        <p>Welcome, {user.name || user.email}</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserProfile;
