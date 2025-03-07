import React, { useRef, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, IconButton, Modal, Portal, Text, useTheme } from 'react-native-paper';
import axios from 'axios';
import ImagePickerDialog from '../../components/ImagePickerDialog';

const NOT_LOADING = -1.0;

const ScanDocumentScreen = ({ navigation }) => {
    const theme = useTheme();
    const styles = createStyles(theme);

    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(NOT_LOADING);

    const imagePickerDialog = useRef(null);

    const addImage = () => {
        imagePickerDialog.current.pickImageAndAdd(images);
    };

    const replaceImage = (index) => {
        imagePickerDialog.current.pickImageAndReplace(index, images);
    }

    const deleteImage = (index) => {
        images.splice(index, 1);
        setImages([...images]);
    }


    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const getData = async () => {
        setLoading(0.0);
        let fullDat = '';
        for (let i = 0; i < images.length; i++) {
            const dat = await performOCR(images[i]);
            fullDat += dat + "\n\n";
            setLoading((i + 1) / images.length);
        }
        await wait(500);
        setLoading(NOT_LOADING);
        navigation.navigate('Transcript', { transcript: fullDat });
    }

    const performOCR = async (imgUri) => {
        if (!imgUri) return;

        const formData = new FormData();
        formData.append('file', {
            uri: imgUri,
            name: 'image.jpg',
            type: 'image/jpeg',
        });

        try {
            const response = await axios.post(
                'https://api.ocr.space/parse/image',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'apikey': process.env.OCRSPACE_API_KEY, // replace with your actual OCR.space API key
                    },
                }
            );
            const result = response.data.ParsedResults[0].ParsedText;
            if (result === '') console.log('no text found');
            else console.log('text found!');

            return result;
        } catch (error) {
            Alert.alert('Oops!', 'Server is busy, please try again later!');
            console.error(error.message);
            console.log('Error performing OCR.');
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewInner}>
                {images.map((image, index) => {
                    const isLastImg = index === images.length - 1;

                    return (
                        <View
                            key={index.toString()}
                            style={[styles.imageItem, isLastImg ? styles.lastImageItem : {}]}
                        >
                            <Image source={{ uri: image }} style={styles.image} />
                            <View style={styles.imageItemOptions}>
                                <IconButton
                                    icon='camera-retake'
                                    iconColor={theme.colors.onBackground}
                                    style={styles.imageItemOptionIcons}
                                    onPress={() => replaceImage(index)}
                                />
                                <IconButton
                                    icon='delete'
                                    iconColor={theme.colors.onBackground}
                                    style={styles.imageItemOptionIcons}
                                    onPress={() => deleteImage(index)}
                                />
                            </View>
                        </View>);
                })}
            </ScrollView>
            <View style={styles.bottomButtons}>
                <Button mode="contained" style={styles.button} onPress={addImage}>
                    Add Image
                </Button>
                <Button mode="contained" style={styles.button} onPress={getData}>
                    Get Data
                </Button>
            </View>
            <ImagePickerDialog ref={imagePickerDialog} setImages={setImages} />


            {/* Overlay loading indicator */}
            <Portal>
                <Modal visible={loading !== NOT_LOADING} dismissable={false} contentContainerStyle={styles.modal}>
                    <ActivityIndicator animating={true} size="large" />
                    <Text style={styles.loadingText}>{`Loading... ${(100 * loading).toFixed(2)} %`}</Text>
                </Modal>
            </Portal>
        </View>
    );
};

const createStyles = theme => StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 16,
        backgroundColor: theme.colors.background,
    },
    title: {
        fontSize: 20,
        marginBottom: 10,
    },
    scrollView: {
        width: '100%',
        marginBottom: 20,
        padding: 20,
        paddingVertical: 12,
        backgroundColor: theme.colors.surface,
    },
    scrollViewInner: {
        alignItems: 'stretch',
    },
    imageItem: {
        width: 300,
        marginRight: 15,
    },
    image: {
        width: '100%',
        flex: 1,
        borderRadius: 10,
        borderColor: theme.colors.background,
        borderWidth: 5,
        resizeMode: 'contain',
        backgroundColor: theme.colors.background,
    },
    lastImageItem: {
        marginRight: 40,
    },
    imageItemOptions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    imageItemOptionIcons: {
        marginVertical: 0,
        marginLeft: 0,
    },
    button: {
        flex: 1
    },
    bottomButtons: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 36,
        marginHorizontal: 16,
    },
    modal: {
        backgroundColor: theme.colors.background,
        padding: 20,
        margin: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
    },
});

export default ScanDocumentScreen;
