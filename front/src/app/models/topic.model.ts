export interface TopicSubscriber {
  id: number;
  username: string;
}

export interface Topic {
  id: number;
  name: string;
  subscribers: TopicSubscriber[];
}
