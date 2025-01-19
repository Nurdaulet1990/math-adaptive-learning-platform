export type RootStackParamList = {
  Main: undefined;
  TopicQuiz: { topicId: string; topicName: string };
  TestMode: undefined;
  Results: { correct: number; total: number; topicId?: string };
};

export type MainTabParamList = {
  Topics: undefined;
  TestMode: undefined;
  Profile: undefined;
};
