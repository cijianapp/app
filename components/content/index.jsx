import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import { connect } from "react-redux";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

import { baseURL } from "../../utils/http";
import Post from "../post";
import { TouchableHighlight } from "react-native-gesture-handler";

function Content(props) {
  const [posts, setPosts] = useState([]);

  React.useLayoutEffect(() => {
    props.navigation.setOptions({
      title: props.route.params.title,
      headerStyle: { height: 48 },
      headerRight: () => (
        <TouchableHighlight
          onPress={() => {
            props.navigation.navigate("Submit");
          }}
        >
          <Ionicons
            style={{ paddingRight: 12 }}
            name={"ios-add-circle-outline"}
            size={24}
            color="gray"
          />
        </TouchableHighlight>
      )
    });
  }, [props.navigation]);

  useEffect(() => {
    const source = axios.CancelToken.source();

    axios
      .get(baseURL + "guest/posts", {
        ...props.headerConfig,
        cancelToken: source.token,
        params: {
          guild: props.route.params.guild_id,
          channel: props.route.params.channel_id
        }
      })
      .then(response => {
        if (response.data !== null) {
          let postList = [];
          response.data.forEach(element => {
            postList.push(element);
          });
          setPosts(postList);
        }
      })
      .catch(err => {
        console.log(err);
      });

    return () => {
      source.cancel();
    };
  }, [props.route.params.channel_id, props.headerConfig]);

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={({ item }) => <Post post={item} />}
        keyExtractor={item => item._id}
      ></FlatList>
    </View>
  );
}

const mapStateToProps = state => ({
  login: state.auth.login,
  headerConfig: state.user.headerConfig,
  info: state.user.info
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Content);

const styles = StyleSheet.create({
  container: { flex: 1 }
});
