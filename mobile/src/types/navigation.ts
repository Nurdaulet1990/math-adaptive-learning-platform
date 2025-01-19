export type RootStackParamList = {
  Main: undefined;
  TopicQuiz: { topicId: string; topicName: string };
  TestMode: undefined;
  Results: { correct: number; total: number; topicId?: string };
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Topics: undefined;
  TestMode: undefined;
  Profile: undefined;
};
