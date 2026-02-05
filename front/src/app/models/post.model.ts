export interface TopicDto {
  id: number;
  name: string;
}

export interface PostDto {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  authorUsername: string;
  topic: TopicDto;
}

export interface CommentDto {
  id: number;
  content: string;
  createdAt: string;
  authorUsername: string;
}

export interface PostDetailResponse {
  post: PostDto;
  comments: CommentDto[];
}
