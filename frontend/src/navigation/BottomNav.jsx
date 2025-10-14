import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import RecruiterDashboard from '../screens/RecruiterDashboard';
import JobManagementScreen from '../screens/JobManagementScreen';
import PostJobScreen from '../screens/PostJobScreen';
import { View, Text } from 'react-native';

const Tab = createBottomTabNavigator();
const JobsStackNav = createNativeStackNavigator();

function CoursesPlaceholder() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Courses coming soon</Text>
    </View>
  );
}

function ProfilePlaceholder() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile coming soon</Text>
    </View>
  );
}

function JobsStack() {
  return (
    <JobsStackNav.Navigator>
      <JobsStackNav.Screen name="JobsHome" component={JobManagementScreen} options={{ title: 'My Jobs' }} />
      <JobsStackNav.Screen name="PostJob" component={PostJobScreen} options={{ title: 'Post New Job' }} />
    </JobsStackNav.Navigator>
  );
}

export default function BottomNav() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let icon = 'home';
          if (route.name === 'Home') icon = 'home';
          if (route.name === 'Jobs') icon = 'briefcase';
          if (route.name === 'Courses') icon = 'school';
          if (route.name === 'Profile') icon = 'person';
          return <Ionicons name={icon} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2F6FED',
        tabBarInactiveTintColor: '#95A1B3',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={RecruiterDashboard} />
      <Tab.Screen name="Jobs" component={JobsStack} />
      <Tab.Screen name="Courses" component={CoursesPlaceholder} />
      <Tab.Screen name="Profile" component={ProfilePlaceholder} />
    </Tab.Navigator>
  );
}
