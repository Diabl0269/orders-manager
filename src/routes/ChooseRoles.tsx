import React from "react";
import { SafeAreaView, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { Roles, useOrders } from "../providers/OrdersProvider";
import { useRouter } from "../Router";
import { border } from "../globalStyles";
import {Routes} from "../types";

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center"
  },
  titleContainer: {
    marginBottom: 20
  },
  rolesContainer: {
    ...border,
    height: "70%",
    width: "95%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    padding: 10
  },
  roleContainer: {
    ...border,
    height: "95%",
    width: "40%",
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    textTransform: "capitalize"
  }
});

const rolesArray: Array<string> = [];
for (let i = 0; Roles[i]; i++) {
  rolesArray.push(Roles[i]);
}

const ChooseRoles = () => {
  const { setRole } = useOrders();
  const { setRoute } = useRouter();
  const onChooseRole = (role: any) => () => {
      setRole(Roles[role] as any);
      setRoute(Routes.ORDERS_MANAGER);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titleContainer}>Choose a role</Text>
      <View style={styles.rolesContainer}>
        {rolesArray.map((role) => {
          return (<TouchableHighlight style={styles.roleContainer} onPress={onChooseRole(role)} key={role}>
            <View>
              <Text style={styles.text}>{role}</Text>
            </View>
          </TouchableHighlight>);
        })}
      </View>
    </SafeAreaView>
  );
};

export default ChooseRoles;
