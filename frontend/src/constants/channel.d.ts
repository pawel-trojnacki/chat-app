export type CategoryType =
  | 'gaming'
  | 'programming'
  | 'education'
  | 'entertainment'
  | 'sport'
  | 'other';

export interface MessageModel {
  content: string;
  createdAt: Date;
  creator: string;
}

export interface ChannelModel extends Document {
  id: string;
  admin: string;
  name: string;
  createdAt: Date;
  image: string;
  description: string;
  category: CategoryType;
  members: Array<string>;
  messages: MessageModel[];
}
