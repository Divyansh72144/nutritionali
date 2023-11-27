import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useAppContext } from '../AppContext'; // Replace with the actual path

const ABC = () => {
  // Use the useAppContext hook to access userUid
  const { userUid ,username} = useAppContext();

  // State to track whether the user data is ready
  const [loading, setLoading] = React.useState(true);
  console.log("username",username,"-",userUid)

  useEffect(() => {
    // Check if userUid is not null
    if (userUid !== null) {
      setLoading(false);
    }
  }, [userUid,username]);

  // Show loading indicator while waiting for user data
  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // User data is ready, render the component
  return (
    <View>
      <Text>User ID: {userUid}</Text>
      <Text>Name: {username}</Text>
      {/* Add more components or logic as needed */}
    </View>
  );
};

export default ABC;
