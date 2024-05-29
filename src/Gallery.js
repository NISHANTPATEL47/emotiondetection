import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';

export default function Gallery({ images, onBack }) {
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, backgroundColor: 'black' }}>
        <TouchableOpacity onPress={onBack}>
          <Image source={require('./images/backicon.png')} style={{ width: 30, height: 30, tintColor: 'white' }} />
        </TouchableOpacity>
        <Text style={{ color: 'white', fontSize: 18 }}>Gallery</Text>
        <View style={{ width: 30, height: 30 }}></View> {/* Placeholder for spacing */}
      </View>
      <ScrollView>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {images.map((imageUri, index) => (
            <TouchableOpacity key={index} onPress={() => viewImage(imageUri)}>
              <Image source={{ uri: imageUri }} style={{ width: 160, height: 160, margin: 10 }} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
