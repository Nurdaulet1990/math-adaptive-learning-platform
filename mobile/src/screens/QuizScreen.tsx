import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../types/navigation';

type Question = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

const mockQuestion: Question = {
  id: '1',
  question: 'When did World War II begin in Europe?',
  options: ['1939', '1940', '1941', '1942'],
  correctIndex: 0,
  explanation: 'World War II began in Europe with Germany\'s invasion of Poland on September 1, 1939.',
};

export default function QuizScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'TopicQuiz'>>();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [correctStreak, setCorrectStreak] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  const handleAnswer = (index: number) => {
    setSelectedOption(index);
    setShowExplanation(true);

    if (index === mockQuestion.correctIndex) {
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
                topicId: route.params.topicId,
              }),
            },
          ]
        );
      }
    } else {
      setCorrectStreak(0);
    }
    setQuestionsAnswered(prev => prev + 1);
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    // In a real app, we would load the next question here
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <Text style={styles.streakText}>Current Streak: {correctStreak}/20</Text>
      </View>
      
      <View style={styles.questionCard}>
        <Text style={styles.question}>{mockQuestion.question}</Text>
        
        <View style={styles.optionsContainer}>
          {mockQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedOption === index && (
                  index === mockQuestion.correctIndex
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
          ))}
        </View>

        {showExplanation && (
          <View style={styles.explanationContainer}>
            <Text style={styles.explanationText}>{mockQuestion.explanation}</Text>
            <TouchableOpacity style={styles.nextButton} onPress={nextQuestion}>
              <Text style={styles.nextButtonText}>Next Question</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
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
