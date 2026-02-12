import { Topic } from './topic.model';

export interface UserMe {
  id: number;
  username: string;
  email: string;
  subscriptions: Topic[];
}
