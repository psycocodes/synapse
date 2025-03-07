import React from 'react';
import { View, StyleSheet, ToastAndroid } from 'react-native';
import { Button, Dialog, Portal, withTheme } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

const IPSource = {
    CAMERA: 0,
    GALLERY: 1
}
const IPError = {
    CANCEL: 0,
    COMPRESS_FAIL: 1
}
const IPIndex = {
    INVALID: -99,
    NEW: -1,
}

const createStyles = (theme) => StyleSheet.create({
    buttonsContainer: {
        flexDirection: 'column',
        alignItems: 'stretch',
        marginBottom: 24
    },
    button: {
        alignItems: 'flex-start',
        paddingHorizontal: 32,
    },
    input: {
        backgroundColor: 'transparent'
    },
    foundText: {
        color: theme.colors.primary,
        padding: 4,
    }
});

const getImageSizeInMB = async (imgUri) => {
    const imageInfo = await FileSystem.getInfoAsync(imgUri);
    return imageInfo.size / 1024 / 1024;
}

const validateImage = async (imgUri) => { // make image under 1mb
    let finalImgUri = imgUri;
    let finalImgSize = await getImageSizeInMB(finalImgUri);

    if (finalImgSize > 1) {
        const outputQuality = (finalImgSize < 1.5) ? (0.7) : (finalImgSize < 4 ? 0.5 : 0.1);
        const compressedImage = await compressImage(finalImgUri, outputQuality);

        finalImgUri = compressedImage.uri;
        finalImgSize = await getImageSizeInMB(finalImgUri);
    }
    console.log(`Final image size: ${finalImgSize.toFixed(2)} MB`);

    return finalImgUri;
};

const compressImage = async (uri, ratio) => {
    const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }], // Adjust width as needed
        { compress: ratio, format: ImageManipulator.SaveFormat.JPEG } // Adjust quality (0-1)
    );

    return manipResult;
};

const pickImage = async (pickingSource) => {
    const options = {
        mediaTypes: ImagePicker.MediaTypeOptions.Image,
        allowsEditing: true,
        quality: 0.7,
    };

    let result = pickingSource == IPSource.GALLERY
        ? await ImagePicker.launchImageLibraryAsync(options)
        : await ImagePicker.launchCameraAsync(options);

    if (!result.canceled) {
        return result.assets[0].uri;
    }
};

const getPickedImage = async (pickingSource) => {
    let imgUri = await pickImage(pickingSource);
    if (!imgUri) {
        //console.log('image picking canceled/failed');
        return IPError.CANCEL;
    }

    imgUri = validateImage(imgUri);
    if (!imgUri) {
        //console.log('image compression failed');
        return IPError.COMPRESS_FAIL;
    }
    return imgUri;
}



class ImagePickerDialog extends React.Component {
    constructor(props) {
        super(props);
        const { theme, setImages } = props; // Access the theme from props
        this.styles = createStyles(theme);
        this.setImages = setImages;
        this.setImages = this.setImages.bind(this);
        this.state = { visible: false, index: IPIndex.INVALID, images: null };

        this.pickImageAndAdd = this.pickImageAndAdd.bind(this);
        this.pickImageAndReplace = this.pickImageAndReplace.bind(this);

        this.hideDialog = this.hideDialog.bind(this);
        this.handlePicking = this.handlePicking.bind(this);
    }
    pickImageAndAdd(prevImages) {
        this.setState({ visible: true, index: IPIndex.NEW, images: prevImages });
    }
    pickImageAndReplace(index, prevImages) {
        this.setState({ visible: true, index: index, images: prevImages });
    }
    hideDialog() {
        this.setState({ visible: false, index: IPIndex.INVALID, images: null });
    }
    async handlePicking(pickingSource) {
        const imgUri = await getPickedImage(pickingSource);
        if (imgUri == IPError.CANCEL) {
            ToastAndroid.show('Image picking canceled', ToastAndroid.SHORT);
        }
        else if (imgUri == IPError.COMPRESS_FAIL) {
            ToastAndroid.show('Image compression failed', ToastAndroid.SHORT);
        }
        else {
            const nImages = [...this.state.images];

            if (this.state.index == IPIndex.NEW)
                nImages.push(imgUri);
            else
                nImages[this.state.index] = imgUri;

            this.setImages(nImages);
        }
        this.hideDialog();
    }

    render() {
        return (
            <Portal>
                <Dialog visible={this.state.visible} onDismiss={this.hideDialog}>
                    <Dialog.Title>{'Add Image from'}</Dialog.Title>
                    <View style={this.styles.buttonsContainer}>
                        <Button
                            style={this.styles.button}
                            icon="camera"
                            onPress={() => this.handlePicking(IPSource.CAMERA)}>Camera</Button>
                        <Button
                            style={this.styles.button}
                            icon="image"
                            onPress={() => this.handlePicking(IPSource.GALLERY)}>Gallery</Button>
                    </View>
                </Dialog>
            </Portal>
        );
    }
}

export default withTheme(ImagePickerDialog);