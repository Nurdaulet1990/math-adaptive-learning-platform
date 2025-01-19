import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../types/navigation';
import { useData } from '../context/DataContext';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import Animated, { 
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';

export default function QuizScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'TopicQuiz'>>();
  const { questions, loading, error, submitAnswer } = useData();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = async (index: number) => {
    setSelectedOption(index);
    
    try {
      const isCorrect = await submitAnswer(currentQuestion.id, index);
      
      if (isCorrect) {
        const newStreak = correctStreak + 1;
        setCorrectStreak(newStreak);
        
        if (newStreak >= 20) {
          Alert.alert(
            'Congratulations!',
            'You\'ve completed this topic by answering 20 questions correctly in a row!',
            [
              {
                text: 'OK',
                onPress: () => navigation.navigate('Results', {
                  correct: newStreak,
                  total: questionsAnswered + 1,
                  topicId: route.params?.topicId,
                }),
              },
            ]
          );
        }
      } else {
        setCorrectStreak(0);
      }
      
      setQuestionsAnswered(prev => prev + 1);
      setShowExplanation(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit answer. Please try again.');
    }
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    setCurrentQuestionIndex(prev => (prev + 1) % questions.length);
  };

  if (loading) {
    return <LoadingSpinner fullscreen />;
  }

  if (error) {
    return (
      <ErrorMessage
        message="Failed to load questions"
        fullscreen
      />
    );
  }

  if (!currentQuestion) {
    return (
      <ErrorMessage
        message="No questions available"
        fullscreen
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <Text style={styles.streakText}>Current Streak: {correctStreak}/20</Text>
      </View>
      
      <Animated.View 
        style={styles.questionCard}
        key={currentQuestion.id}
        entering={SlideInRight}
        exiting={SlideOutLeft}
      >
        <Text style={styles.question}>{currentQuestion.question}</Text>
        
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((option, index) => (
            <Animated.View
              key={index}
              entering={FadeIn.delay(index * 100)}
            >
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  selectedOption === index && (
                    index === currentQuestion.correctIndex
                      ? styles.correctOption
                      : styles.wrongOption
                  ),
                ]}
                onPress={() => handleAnswer(index)}
                disabled={selectedOption !== null}
              >
                <Text style={[
                  styles.optionText,
                  selectedOption === index && styles.selectedOptionText
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {showExplanation && (
          <Animated.View 
            style={styles.explanationContainer}
            entering={ZoomIn}
            exiting={ZoomOut}
          >
            <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
            <TouchableOpacity style={styles.nextButton} onPress={nextQuestion}>
              <Text style={styles.nextButtonText}>Next Question</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  progressContainer: {
    marginBottom: 16,
  },
  streakText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  questionCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  question: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  optionText: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  selectedOptionText: {
    color: 'white',
  },
  correctOption: {
    backgroundColor: '#40c057',
    borderColor: '#40c057',
  },
  wrongOption: {
    backgroundColor: '#fa5252',
    borderColor: '#fa5252',
  },
  explanationContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  explanationText: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
    marginBottom: 16,
  },
  nextButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
