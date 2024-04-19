import { ReactNode } from 'react';

export interface Props {
  className?: string;
  children?: ReactNode;

  [prop: string]: unknown;
}

export enum QueueMessageType {
  FINDING,
  MATCHING,
  OK,
}

export type FindingMessage = {
  username: string;
  elo: number;
};

export type MatchingMessage = {
  match: string;
};

export type OkMessage = {
  ok: string;
};

export interface QueueMessage {
  type: QueueMessageType;
  data: FindingMessage | MatchingMessage | OkMessage;
}

export enum GameMessageType {
  Move = 'Move',
  Join = 'Join',
  Finish = 'Finish',
  InGameChat = 'InGameChat',
  Draw = 'Draw',
}

export interface GameMessage {
  type: GameMessageType;
}

export interface InGameChatMessage extends GameMessage {
  sender: string;
  content: string;
}

export interface JoinMessage extends GameMessage {
  currentMoves: number[];
  nextMove: string;
}

export interface MoveMessage extends GameMessage {
  move: number;
  nextMove: string;
}

export interface FinishMessage extends GameMessage {
  winner: string;
}

export interface PublicInformation {
  username: string;
  elo: number;
}

export enum FriendsMessageType {
  FriendRequest = 'FriendRequest',
  FriendResponse = 'FriendResponse',
  InviteRequest = 'InviteRequest',
  InviteResponse = 'InviteResponse',
}

export interface FriendsMessage {
  type: FriendsMessageType;
  username: string;
}

export interface ChatMessage {
  sender?: string;
  conversation?: number;
  content?: string;
  timeStamp?: string;
}

export interface ConversationInfo {
  cid: number;
  peers: string[];
  seen: boolean;
  lastMessage?: ChatMessage;
}

export interface Pagination<Item> {
  items: Item[];
  from: number;
  perPage: number;
  hasNextPage: boolean;
  total: number;
}

export interface Game {
  draw: boolean;
  finish: boolean;
  firstMoveUser: string;
  id: number;
  moves: number[];
  roomCode: string;
  winner: string;
  playedAt: string;
}
