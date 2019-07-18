import React, { useState } from "react";
import { View, ViewProps, Text, StyleSheet, SafeAreaView } from "react-native";
import Modal from "react-native-modal";
import { Button } from "beeshell";

interface IProps extends ViewProps {
  onSelect: (info: string) => void;
}

export const SelectHeroModal = (props: IProps) => {
  const [isModalVisible, setModalVisible] = useState(true);

  function onStart() {
    setModalVisible(false);
    props.onSelect("白板2血");
  }

  return (
    <Modal isVisible={isModalVisible}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Button type="primary" size="md" onPress={onStart}> Start </Button>
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
  container: {}
});