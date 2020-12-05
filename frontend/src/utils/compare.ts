import { ChannelModel } from '../constants/channel';

export const compareChannels = (a: ChannelModel, b: ChannelModel) => {
  if (a.members.length < b.members.length) {
    return 1;
  }
  if (a.members.length > b.members.length) {
    return -1;
  }
  return 0;
};
