import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { IconButton, useTheme, Text } from "react-native-paper";
import testQuestions from "../../testQuestions";

const FlashcardSessionScreen = ({ navigation, route }) => {
    const theme = useTheme();
    const styles = createStyles(theme);

    const [flashcards, setFlashcards] = useState(JSON.parse(route.params.flashcards));

    // const [flashcards, setFlashcards] = useState(testQuestions);

    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [difficultyLevels, setDifficultyLevels] = useState(new Array(flashcards.length).fill(''));
    const [easyCount, setEasyCount] = useState(0);
    const [mediumCount, setMediumCount] = useState(0);
    const [hardCount, setHardCount] = useState(0);
    const [unmarkedCount, setUnmarkedCount] = useState(flashcards.length);
    const [sessionEnded, setSessionEnded] = useState(false);

    const filteredFlashcards = flashcards.filter((_, index) => difficultyLevels[index] !== 'easy');

    useEffect(() => {
        countUnmarkedQuestions();
    }, [difficultyLevels]);

    // Alert for not finished
    // useEffect(() => {
    //     Alert.alert('Not Ready', 'Sorry for the inconvenience! This page is under development.')
    // }, []);

    const handleEndSession = () => setSessionEnded(true);
    const handleShowAnswer = () => setShowAnswer(prev => !prev);

    const handleNextCard = () => {
        setShowAnswer(false);
        let nextIndex = currentCardIndex + 1;

        while (difficultyLevels[nextIndex % flashcards.length] === 'easy') {
            nextIndex++;
        }
        setCurrentCardIndex(nextIndex % flashcards.length);
    };

    const handleResetSession = () => {
        setDifficultyLevels(new Array(flashcards.length).fill(''));
        setEasyCount(0);
        setMediumCount(0);
        setHardCount(0);
        setUnmarkedCount(flashcards.length);
        setSessionEnded(false);
        setCurrentCardIndex(0);
    };

    const countUnmarkedQuestions = () => {
        const count = difficultyLevels.filter(level => level === '').length;
        setUnmarkedCount(count);
    };

    const handleDifficulty = (level) => {
        const newDifficultyLevels = [...difficultyLevels];
        const previousLevel = newDifficultyLevels[currentCardIndex];
        newDifficultyLevels[currentCardIndex] = level;
        setDifficultyLevels(newDifficultyLevels);

        if (previousLevel === 'easy') setEasyCount(prev => prev - 1);
        if (previousLevel === 'medium') setMediumCount(prev => prev - 1);
        if (previousLevel === 'hard') setHardCount(prev => prev - 1);

        switch (level) {
            case 'easy':
                setEasyCount(prev => prev + 1);
                break;
            case 'medium':
                setMediumCount(prev => prev + 1);
                break;
            case 'hard':
                setHardCount(prev => prev + 1);
                break;
            default:
                break;
        }

        countUnmarkedQuestions();

        if (newDifficultyLevels.every(l => l === 'easy')) {
            setSessionEnded(true);
        }
    };

    return (
        <View style={styles.container}>
            {filteredFlashcards.length > 0 && !sessionEnded ? (
                <>
                    <Text style={styles.markedText}>
                        Currently Marked: {difficultyLevels[currentCardIndex] || 'Unmarked'}
                    </Text>

                    <TouchableOpacity
                        onPress={handleShowAnswer}
                        style={styles.flashcard}
                    >
                        <LinearGradient colors={["#FDC830", "#F37335"]} style={styles.gradient}>
                            <ScrollView contentContainerStyle={styles.flashcardContent}>
                                <Text style={styles.flashcardText}>
                                    {!showAnswer ? flashcards[currentCardIndex].question : flashcards[currentCardIndex].answer}
                                </Text>
                            </ScrollView>
                        </LinearGradient>
                    </TouchableOpacity>

                    <View style={styles.difficultyButtonsContainer}>
                        <TouchableOpacity onPress={() => handleDifficulty('easy')} style={[styles.difficultyButton, styles.easy]}>
                            <Text style={styles.difficultyText}>Easy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDifficulty('medium')} style={[styles.difficultyButton, styles.medium]}>
                            <Text style={styles.difficultyText}>Mid</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDifficulty('hard')} style={[styles.difficultyButton, styles.hard]}>
                            <Text style={styles.difficultyText}>Hard</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleNextCard} style={styles.nextButton}>
                            <Text style={styles.difficultyText}>Next</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={handleEndSession} style={styles.endSessionButton}>
                        <IconButton icon="stop" iconColor="#FF3B30" size={30} />
                        <Text style={styles.difficultyText}>End Session</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <View style={styles.sessionEndedContainer}>
                    <Text style={styles.sessionEndedText}>Session Ended</Text>
                    <Text style={styles.performanceText}>Your Performance:</Text>
                    <Text style={styles.performanceEasy}>Easy: {easyCount}</Text>
                    <Text style={styles.performanceMedium}>Medium: {mediumCount}</Text>
                    <Text style={styles.performanceHard}>Hard: {hardCount}</Text>
                    <Text style={styles.performanceUnmarked}>Unmarked: {unmarkedCount}</Text>

                    <TouchableOpacity
                        onPress={() => {
                            setSessionEnded(false);
                            setCurrentCardIndex(0);
                        }}
                        style={styles.resumeButton}
                    >
                        <IconButton icon="play-circle-outline" iconColor="#4CAF50" size={30} />
                        <Text style={styles.difficultyText}>Resume Session</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleResetSession} style={styles.resetButton}>
                        <IconButton icon="rewind-outline" iconColor="#FF3B30" size={30} />
                        <Text style={styles.difficultyText}>Reset Session</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const createStyles = theme => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
        marginHorizontal: 8,
    },
    icon: {
        height: 20,
        width: 20,
    },
    markedText: {
        textAlign: 'center',
        marginTop: 2,
        fontSize: 12,
        color: 'gray',
    },
    flashcard: {
        maxWidth: '100%',
        height: '50%',
        marginHorizontal: 8,
        marginTop: 2,
        borderRadius: 20,
    },
    gradient: {
        flex: 1,
        borderRadius: 20,
    },
    flashcardContent: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
    },
    flashcardText: {
        fontSize: 18,
        color: 'white',
        textAlign: 'center',
    },
    difficultyButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    difficultyButton: {
        minHeight: 62,
        minWidth: 72,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        padding: 10,
        marginHorizontal: 5,
    },
    easy: {
        borderColor: 'green',
        borderWidth: 1,
    },
    medium: {
        borderColor: 'yellow',
        borderWidth: 1,
    },
    hard: {
        borderColor: 'red',
        borderWidth: 1,
    },
    nextButton: {
        borderColor: 'gray',
        borderWidth: 1,
    },
    endSessionButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        borderColor: 'gray',
        borderWidth: 1,
    },
    sessionEndedContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    sessionEndedText: {
        fontSize: 24,
        color: 'gray',
        fontWeight: 'bold',
    },
    performanceText: {
        fontSize: 18,
        color: 'gray',
        marginVertical: 10,
    },
    performanceEasy: {
        color: 'green',
    },
    performanceMedium: {
        color: 'yellow',
    },
    performanceHard: {
        color: 'red',
    },
    performanceUnmarked: {
        color: 'gray',
    },
    resumeButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    resetButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
});

export default FlashcardSessionScreen;
