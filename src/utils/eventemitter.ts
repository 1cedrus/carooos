import EventEmitter from 'eventemitter3';

export const eventEmitter = new EventEmitter();

export const triggerEvent = (name: EventName, ...args: any[]) => {
  eventEmitter.emit(name, ...args);
};

export enum EventName {
  OpenWinnerAnnouncementModal = 'OpenWinnerAnnouncementModal',
  OpenDrawAnnouncementModal = 'OpenDrawAnnouncementModal',
  OpenMatchFoundModal = 'OpenMatchFoundModal',

  ReloadInfo = 'ReloadInfo',
  NavigateTo = 'NavigateTo',

  OnTopicMessages = 'OnTopicMessages',
  OnTopicFriends = 'OnTopicFriends',
  OnTopicQueue = 'OnTopicQueue',
  OnTopicGame = 'OnTopicGame',
}
