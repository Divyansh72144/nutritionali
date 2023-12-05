import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Modal, Text, StyleSheet, Animated, Image } from 'react-native';

const DeleteButton = ({ onDelete, customIcon }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const toggleModal = () => setModalVisible(!isModalVisible);

  const startFadeAnimation = (toValue, duration, callback) => {
    Animated.timing(fadeAnim, {
      toValue,
      duration,
      useNativeDriver: true,
    }).start(callback);
  };

  const handleDelete = async () => {
    try {
      if (onDelete) {
        await onDelete();
        setIsDeleted(true);
      }
    } catch (error) {
      console.error('Error deleting: ', error);
      // You might want to show an error message here
    }
  };

  useEffect(() => {
    if (isModalVisible) {
      startFadeAnimation(1, 500, null); // Adjust the duration to your preference
    }

    if (isDeleted) {
      console.log('Starting deletion animation');
      startFadeAnimation(0, 5000, () => {
        console.log('Deletion animation completed');
        setIsDeleted(false);
        toggleModal();
      });
    }
  }, [isModalVisible, isDeleted]);

  return (
    <>
      <TouchableOpacity onPress={toggleModal}>
        <View style={{ marginRight: 10 }}>{customIcon}</View>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <Animated.View style={{ ...styles.modalBackground, opacity: fadeAnim }}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Delete Food<Image source={require('../../media/gifs/Other_images/garbage.png')} style={{ width: 40, height: 40, marginRight: 5 }} />
              </Text>
              <View style={styles.modalBody}>
                {isDeleted ? (
                  <Animated.Text style={{ ...styles.confirmationText, opacity: fadeAnim }}>
                    Food has been deleted!
                  </Animated.Text>
                ) : (
                  <>
                    <Text>Are you sure you want to delete this food?</Text>
                    <TouchableOpacity style={styles.optionButton} onPress={handleDelete}>
                      <Text style={styles.optionButtonText}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionButton} onPress={toggleModal}>
                      <Text style={styles.optionButtonText}>Cancel</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </View>
        </Animated.View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  modalContent: {
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalBody: {
    alignItems: 'center',
  },
  optionButton: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  optionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  confirmationText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'green',
    marginBottom: 10,
  },
});

export default DeleteButton;
