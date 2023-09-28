import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ScrollView, Text, View, FlatList, SafeAreaView, LogBox, Image } from 'react-native';
import firebase from "firebase/compat/app";
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { Provider as PaperProvider, Card, List, Button } from 'react-native-paper';
import Constants from 'expo-constants';
import LoginScreen from './login';

const firebaseConfig = {
  apiKey: "AIzaSyDertnnmeFyqvZOla41sTEdVXBVfOQUDio",
  authDomain: "mobileweb-lab8-26cfc.firebaseapp.com",
  databaseURL: "https://mobileweb-lab8-26cfc-default-rtdb.firebaseio.com",
  projectId: "mobileweb-lab8-26cfc",
  storageBucket: "mobileweb-lab8-26cfc.appspot.com",
  messagingSenderId: "649582547459",
  appId: "1:649582547459:web:2f39903780fcde512a3436",
  measurementId: "G-R1LHTNC2QM"
};

LogBox.ignoreAllLogs(true);


try {
  firebase.initializeApp(firebaseConfig);
} catch (err) { }


function dbListener(path, setData) {
  const tb = ref(getDatabase(), path);
  onValue(tb, (snapshot) => {
    setData(snapshot.val());
  })
}

function renderCorona({item}){
  var icon = <Image style={{ width: 30, height: 20 }} source={{ uri: `https://covid19.who.int/countryFlags/${item.code.toLowerCase()}.png` }} />
  var desc = <View>
    <Text>{"ผู้ป่วยสะสม: " + item.confirmed + " ราย"}</Text>
    <Text>{"เสียชีวิต: " + item.death + " ราย"}</Text>
    <Text>{"เสียชีวิต 7 วันล่าสุด: " + item.lastdeath + " ราย"}</Text>
  </View>;
  //return <View><Text>ประเทศ {item.name} มีผู้ป่วย {item.confirmed} ราย</Text></View>
  return <List.Item title={item.name} description={desc} left={(props=>icon)}></List.Item>
}


function Detail(props) {

  return <View>
    <Text>{JSON.stringify(props.item)}</Text>
    <Button onPress={() => props.setItem(null)}>
      Back
    </Button>
  </View>
};

function Loading() {
  return <View><Text>Loading</Text></View>
}

export default function App() {
  const [corona, setCorona] = React.useState([]);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    var auth = getAuth();
    auth.onAuthStateChanged(function (us) {
      setUser(us);
    });
    dbListener("/corona", setCorona);
  }, []);

  if (user == null) {
    return <LoginScreen />;
  }

  if (corona.length == 0) {
    return <Loading />;
  }
  return (
    <PaperProvider>
      <View style={styles.container}>
        <Card.Cover source={require("./assets/corona.jpg")} />
        <ScrollView>
          <Card>
            <Card.Title title="Coronavirus Situation" />
            <Card.Content>
              <Text>Your Phone Number: {user.phoneNumber}</Text>
              <FlatList data={corona} renderItem={renderCorona} ></FlatList>
            </Card.Content>
          </Card>
        </ScrollView>
        <Button icon="logout" mode="contained" onPress={() => getAuth().signOut()}>
          Sign Out
        </Button>
        <StatusBar backgroundColor="rgba(0,0,0,0.5)" style="light" />

      </View>
    </PaperProvider>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Constants.statusBarHeight,
  },
});
