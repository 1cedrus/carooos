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
  Messages = 'Messages',
  Draw = 'Draw',
}

export interface GameMessage {
  type: GameMessageType;
}

export interface MessagesMessage extends GameMessage {
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
