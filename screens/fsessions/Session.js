import {
    StyleSheet,
    View,
    ScrollView,
    TouchableOpacity,
    Animated,
    Dimensions,
    Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState, useRef } from "react";
import { IconButton, useTheme, Text, Surface, Chip } from "react-native-paper";
const { width } = Dimensions.get('window');

const FlashcardSessionScreen = ({ navigation, route }) => {
    const theme = useTheme();
    const styles = createStyles(theme);

    const [flashcards, setFlashcards] = useState(JSON.parse(route.params.flashcards));

    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [difficultyLevels, setDifficultyLevels] = useState(new Array(flashcards.length).fill(''));
    const [easyCount, setEasyCount] = useState(0);
    const [mediumCount, setMediumCount] = useState(0);
    const [hardCount, setHardCount] = useState(0);
    const [unmarkedCount, setUnmarkedCount] = useState(flashcards.length);
    const [sessionEnded, setSessionEnded] = useState(false);

    const filteredFlashcards = flashcards.filter((_, index) => difficultyLevels[index] !== 'easy');

    // Animation values
    const flipAnimation = useRef(new Animated.Value(0)).current;
    const flipRotation = flipAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });
    const backSideRotation = flipAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['180deg', '360deg'],
    });
    const frontOpacity = flipAnimation.interpolate({
        inputRange: [0.5, 0.5],
        outputRange: [1, 0],
    });
    const backOpacity = flipAnimation.interpolate({
        inputRange: [0.5, 0.5],
        outputRange: [0, 1],
    });

    useEffect(() => {
        countUnmarkedQuestions();
    }, [difficultyLevels]);

    const handleEndSession = () => {
        setSessionEnded(true);
    };

    const handleShowAnswer = () => {
        setShowAnswer(prev => !prev);
        Animated.spring(flipAnimation, {
            toValue: showAnswer ? 0 : 1,
            friction: 8,
            tension: 10,
            useNativeDriver: true,
        }).start();
    };

    const handlePreviousCard = () => {
        setShowAnswer(false);
        
        // Reset the flip animation
        Animated.timing(flipAnimation, {
            toValue: 0,
            duration: 0, // Instant reset
            useNativeDriver: true,
        }).start();
        
        let prevIndex = currentCardIndex - 1;
        if (prevIndex < 0) {
            prevIndex = flashcards.length - 1;
        }
        
        while (difficultyLevels[prevIndex] === 'easy' && prevIndex !== currentCardIndex) {
            prevIndex = prevIndex - 1;
            if (prevIndex < 0) {
                prevIndex = flashcards.length - 1;
            }
        }
        
        setCurrentCardIndex(prevIndex);
    };

    const handleNextCard = () => {
        setShowAnswer(false);
        
        // Reset the flip animation
        Animated.timing(flipAnimation, {
            toValue: 0,
            duration: 0, // Instant reset
            useNativeDriver: true,
        }).start();
        
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

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'easy':
                return '#4CAF50'; // Green
            case 'medium':
                return '#FFC107'; // Yellow
            case 'hard':
                return '#F44336'; // Red
            default:
                return theme.colors.surfaceVariant; // Default color
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                    <View 
                        style={[
                            styles.progressFill, 
                            { 
                                width: `${Math.round((easyCount / flashcards.length) * 100)}%`,
                                backgroundColor: '#4CAF50' 
                            }
                        ]} 
                    />
                    <View 
                        style={[
                            styles.progressFill, 
                            { 
                                width: `${Math.round((mediumCount / flashcards.length) * 100)}%`,
                                backgroundColor: '#FFC107' 
                            }
                        ]} 
                    />
                    <View 
                        style={[
                            styles.progressFill, 
                            { 
                                width: `${Math.round((hardCount / flashcards.length) * 100)}%`,
                                backgroundColor: '#F44336' 
                            }
                        ]} 
                    />
                </View>
                <Text style={styles.progressText}>
                    {easyCount + mediumCount + hardCount}/{flashcards.length} cards completed
                </Text>
            </View>

            {filteredFlashcards.length > 0 && !sessionEnded ? (
                <>
                    <View style={styles.statusContainer}>
                        <Chip 
                            mode="outlined" 
                            style={[
                                styles.statusChip, 
                                { borderColor: getDifficultyColor(difficultyLevels[currentCardIndex]) }
                            ]}
                        >
                            <Text style={[
                                styles.statusText, 
                                { color: getDifficultyColor(difficultyLevels[currentCardIndex]) }
                            ]}>
                                {difficultyLevels[currentCardIndex] || 'Unmarked'}
                            </Text>
                        </Chip>
                        <Chip 
                            mode="outlined" 
                            style={styles.cardCountChip}
                        >
                            <Text style={styles.cardCountText}>
                                {currentCardIndex + 1} / {flashcards.length}
                            </Text>
                        </Chip>
                    </View>

                    <View style={styles.flashcardContainer}>
                        {/* Front side of card */}
                        <Animated.View 
                            style={[
                                styles.flashcard, 
                                { 
                                    transform: [{ rotateY: flipRotation }],
                                    opacity: frontOpacity,
                                    zIndex: showAnswer ? 0 : 1
                                }
                            ]}
                        >
                            <LinearGradient colors={["#8E2DE2", "#4A00E0"]} style={styles.gradient}>
                                <ScrollView 
                                    contentContainerStyle={styles.flashcardContent}
                                    showsVerticalScrollIndicator={false}
                                >
                                    <Text style={styles.flashcardTitle}>Question</Text>
                                    <Text style={styles.flashcardText}>
                                        {flashcards[currentCardIndex].question}
                                    </Text>
                                    <Text style={styles.tapToFlip}>Tap to flip</Text>
                                </ScrollView>
                            </LinearGradient>
                        </Animated.View>

                        {/* Back side of card */}
                        <Animated.View 
                            style={[
                                styles.flashcard, 
                                { 
                                    transform: [{ rotateY: backSideRotation }],
                                    opacity: backOpacity,
                                    position: 'absolute',
                                    zIndex: showAnswer ? 1 : 0
                                }
                            ]}
                        >
                            <LinearGradient colors={["#4776E6", "#8E54E9"]} style={styles.gradient}>
                                <ScrollView 
                                    contentContainerStyle={styles.flashcardContent}
                                    showsVerticalScrollIndicator={false}
                                >
                                    <Text style={styles.flashcardTitle}>Answer</Text>
                                    <Text style={styles.flashcardText}>
                                        {flashcards[currentCardIndex].answer}
                                    </Text>
                                    <Text style={styles.tapToFlip}>Tap to flip</Text>
                                </ScrollView>
                            </LinearGradient>
                        </Animated.View>
                        
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={handleShowAnswer}
                            style={styles.touchableArea}
                        />
                    </View>

                    <View style={styles.difficultyButtonsContainer}>
                        <TouchableOpacity onPress={() => handleDifficulty('easy')} style={[styles.difficultyButton, styles.easy]}>
                            <Text style={styles.difficultyText}>Easy</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDifficulty('medium')} style={[styles.difficultyButton, styles.medium]}>
                            <Text style={styles.difficultyText}>Medium</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDifficulty('hard')} style={[styles.difficultyButton, styles.hard]}>
                            <Text style={styles.difficultyText}>Hard</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.navigationButtonsContainer}>
                        <TouchableOpacity onPress={handlePreviousCard} style={styles.previousButton}>
                            <Text style={styles.navigationButtonText}>Previous</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleNextCard} style={styles.nextButton}>
                            <Text style={styles.navigationButtonText}>Next</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={handleEndSession} style={styles.endSessionButton}>
                        <IconButton icon="stop-circle" iconColor="#F44336" size={24} />
                        <Text style={styles.endSessionText}>End Session</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <Surface style={styles.sessionEndedContainer}>
                    <Text style={styles.sessionEndedText}>Session Completed!</Text>
                    
                    <View style={styles.statsContainer}>
                        <Text style={styles.performanceText}>Your Performance</Text>
                        
                        <View style={styles.statsRow}>
                            <Surface style={[styles.statCard, { borderColor: '#4CAF50' }]}>
                                <Text style={styles.statValue}>{easyCount}</Text>
                                <Text style={[styles.statLabel, { color: '#4CAF50' }]}>Easy</Text>
                            </Surface>
                            
                            <Surface style={[styles.statCard, { borderColor: '#FFC107' }]}>
                                <Text style={styles.statValue}>{mediumCount}</Text>
                                <Text style={[styles.statLabel, { color: '#FFC107' }]}>Medium</Text>
                            </Surface>
                            
                            <Surface style={[styles.statCard, { borderColor: '#F44336' }]}>
                                <Text style={styles.statValue}>{hardCount}</Text>
                                <Text style={[styles.statLabel, { color: '#F44336' }]}>Hard</Text>
                            </Surface>
                        </View>
                        
                        {unmarkedCount > 0 && (
                            <Surface style={[styles.unmarkedCard, { borderColor: theme.colors.outline }]}>
                                <Text style={styles.statValue}>{unmarkedCount}</Text>
                                <Text style={styles.statLabel}>Unmarked</Text>
                            </Surface>
                        )}
                    </View>
                    
                    <Text style={styles.completionText}>
                        You've marked {Math.round(((flashcards.length - unmarkedCount) / flashcards.length) * 100)}% of your flashcards
                    </Text>

                    <TouchableOpacity
                        onPress={() => {
                            setSessionEnded(false);
                            setCurrentCardIndex(0);
                        }}
                        style={styles.resumeButton}
                    >
                        <IconButton icon="play-circle" iconColor="#4CAF50" size={24} />
                        <Text style={styles.resumeButtonText}>Resume Session</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleResetSession} style={styles.resetButton}>
                        <IconButton icon="refresh" iconColor="#F44336" size={24} />
                        <Text style={styles.resetButtonText}>Reset Session</Text>
                    </TouchableOpacity>
                </Surface>
            )}
        </View>
    );
};

const createStyles = theme => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    progressContainer: {
        marginBottom: 16,
    },
    progressBar: {
        height: 8,
        backgroundColor: theme.colors.surfaceVariant,
        borderRadius: 4,
        flexDirection: 'row',
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
    },
    progressText: {
        fontSize: 12,
        color: theme.colors.onSurfaceVariant,
        marginTop: 4,
        textAlign: 'center',
    },
    statusContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    statusChip: {
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardCountChip: {
        height: 32,
        borderColor: theme.colors.primary,
        backgroundColor: 'rgba(103, 80, 164, 0.08)',
    },
    statusText: {
        fontSize: 14,
        fontWeight: '500',
        textAlignVertical: 'center',
    },
    cardCountText: {
        fontSize: 14,
        fontWeight: '500',
        color: theme.colors.primary,
        textAlignVertical: 'center',
    },
    flashcardContainer: {
        height: 340,
        width: '100%',
        marginBottom: 24,
    },
    touchableArea: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 2,
    },
    flashcard: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
        backfaceVisibility: 'hidden',
    },
    gradient: {
        flex: 1,
        borderRadius: 20,
    },
    flashcardContent: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        minHeight: '100%',
    },
    flashcardTitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 12,
        fontWeight: '500',
    },
    flashcardText: {
        fontSize: 22,
        color: 'white',
        textAlign: 'center',
        fontWeight: '600',
    },
    tapToFlip: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.6)',
        position: 'absolute',
        bottom: 16,
    },
    difficultyButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    difficultyButton: {
        flex: 1,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        marginHorizontal: 4,
        elevation: 2,
    },
    easy: {
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        borderColor: '#4CAF50',
        borderWidth: 1,
    },
    medium: {
        backgroundColor: 'rgba(255, 193, 7, 0.1)',
        borderColor: '#FFC107',
        borderWidth: 1,
    },
    hard: {
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        borderColor: '#F44336',
        borderWidth: 1,
    },
    difficultyText: {
        fontSize: 16,
        fontWeight: '600',
    },
    navigationButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    previousButton: {
        flex: 1,
        height: 56,
        backgroundColor: theme.colors.primary,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        elevation: 2,
    },
    nextButton: {
        flex: 1,
        height: 56,
        backgroundColor: theme.colors.primary,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
        elevation: 2,
    },
    navigationButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.colors.onPrimary,
    },
    endSessionButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    },
    endSessionText: {
        fontSize: 16,
        color: '#F44336',
        fontWeight: '500',
    },
    sessionEndedContainer: {
        padding: 24,
        borderRadius: 20,
        elevation: 4,
    },
    sessionEndedText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: theme.colors.primary,
        textAlign: 'center',
        marginBottom: 24,
    },
    statsContainer: {
        marginBottom: 24,
    },
    performanceText: {
        fontSize: 18,
        color: theme.colors.onSurface,
        marginBottom: 16,
        fontWeight: '500',
        textAlign: 'center',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    statCard: {
        width: '30%',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 2,
        elevation: 1,
    },
    unmarkedCard: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 2,
        marginBottom: 16,
        elevation: 1,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.colors.onSurface,
    },
    statLabel: {
        fontSize: 14,
        fontWeight: '500',
        marginTop: 4,
    },
    completionText: {
        fontSize: 16,
        color: theme.colors.onSurfaceVariant,
        textAlign: 'center',
        marginBottom: 24,
    },
    resumeButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        borderColor: '#4CAF50',
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
    },
    resumeButtonText: {
        fontSize: 16,
        color: '#4CAF50',
        fontWeight: '600',
    },
    resetButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#F44336',
        borderWidth: 1,
        borderRadius: 12,
        padding: 12,
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
    },
    resetButtonText: {
        fontSize: 16,
        color: '#F44336',
        fontWeight: '600',
    },
});

export default FlashcardSessionScreen;