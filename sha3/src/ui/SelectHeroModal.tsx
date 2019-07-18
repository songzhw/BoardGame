import React, { useState } from "react";
import { View, ViewProps, Text, StyleSheet, SafeAreaView } from "react-native";
import Modal from "react-native-modal";
import { Button } from "beeshell";

interface IProps extends ViewProps {
}

export const SelectHeroModal = (props: IProps) => {
  const [isModalVisible, setModalVisible] = useState(true);

  function onStart() {
    setModalVisible(false);
  }

  return (
    <Modal isVisible={isModalVisible}>
      <View style={{ flex: 1 }}>
        <Button type="primary" size="md" onPress={onStart}> Start </Button>
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
  container: {}
});