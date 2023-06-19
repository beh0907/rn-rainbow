import {StatusBar} from 'expo-status-bar';
import Navigation from "./navigations/Navigation";
import {LogBox} from "react-native";
import {UserProvider} from "./contexts/UserContext";

export default function App() {
  LogBox.ignoreLogs([
    'AsyncStorage has been extracted from react-native core'
  ])

  return (
      <UserProvider>
        <StatusBar style="dark"/>
        <Navigation/>
      </UserProvider>
  );
}
