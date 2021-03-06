import React, { useState, useEffect } from "react";
import { StyleSheet, FlatList, View } from "react-native";
import { connect } from "react-redux";
import axios from "axios";

import { baseURL } from "../../utils/http";
import Post from "../post";
import Login from "../login";

function Homepage(props) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const source = axios.CancelToken.source();

    if (props.login) {
      axios
        .get(baseURL + "api/homeposts", {
          ...props.headerConfig,
          cancelToken: source.token
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
    }
    return () => {
      source.cancel();
    };
  }, [props.login, props.headerConfig]);

  if (!props.login) {
    return (
      <View style={styles.container}>
        <Login></Login>
      </View>
    );
  } else {
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
}

const mapStateToProps = state => ({
  login: state.auth.login,
  headerConfig: state.user.headerConfig,
  info: state.user.info
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Homepage);

const styles = StyleSheet.create({
  container: { flex: 1 }
});
