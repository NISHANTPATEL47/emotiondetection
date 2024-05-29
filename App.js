import React, { useEffect, useState } from 'react';
import { Camera, ImagePicker } from 'expo-camera';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function App() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [showCapturedImages, setShowCapturedImages] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync();
      setImage(data.uri);
      setCapturedImages([...capturedImages, data.uri]);
    }
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.cancelled) {
      setImage(result.uri);
      setCapturedImages([...capturedImages, result.uri]);
    }
  }

  const renderGalleryImages = () => {
    return capturedImages.map((imageUri, index) => (
      <TouchableOpacity key={index} onPress={() => viewGalleryImage(imageUri)}>
        <Image source={{ uri: imageUri }} style={styles.galleryImage} />
      </TouchableOpacity>
    ));
  }

  const renderGalleryRows = () => {
    const rows = [];
    for (let i = 0; i < capturedImages.length; i += 2) {
      const rowImages = capturedImages.slice(i, i + 2);
      rows.push(
        <View key={i} style={styles.galleryRow}>
          {rowImages.map((imageUri, index) => (
            <Image key={index} source={{ uri: imageUri }} style={styles.galleryImage} />
          ))}
        </View>
      );
    }
    return rows;
  }

  const viewGalleryImage = (imageUri) => {
    setImage(imageUri);
    setShowCapturedImages(false);
  }

  return (
    <View style={styles.container}>
      {showCapturedImages ? (
        <View style={{ flex: 1 }}>
          <TouchableOpacity style={styles.backButton} onPress={() => setShowCapturedImages(false)}>
            <Text>Back</Text>
          </TouchableOpacity>
          <ScrollView style={{ flex: 1 }}>
            {renderGalleryRows()}
          </ScrollView>
        </View>
      ) : (
        <View style={styles.cameraContainer}>
          <Camera
            style={styles.camRatio}
            type={type}
            ratio="1:1"
            ref={(ref) => setCamera(ref)}
          />
        </View>
      )}
      {!showCapturedImages && (
        <View style={styles.bottomIconsContainer}>
          <TouchableOpacity style={styles.bottomIcon} onPress={() => setShowCapturedImages(!showCapturedImages)}>
            <Image style={styles.icons} source={require('./images/gallery.png')} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomIcon} onPress={showCapturedImages ? pickImage : takePicture}>
            <Image style={styles.icons} source={require('./images/capture.png')} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomIcon} onPress={() => setType(type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back)}>
            <Image style={styles.icons} source={require('./images/cameraswitch.png')} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    flexDirection: "row",
  },
  camRatio: {
    aspectRatio: 1,
  },
  icons: {
    width: 50,
    height: 50,
    margin: 10,
  },
  bottomIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: 'black',
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 20,
  },
  bottomIcon: {
    flex: 1,
    alignItems: 'center'
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'lightgray',
    marginBottom: 10,
    marginTop: 30,
    width: 100,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  galleryImage: {
    width: 160,
    height: 160,
    margin: 10,
  },
  galleryRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
