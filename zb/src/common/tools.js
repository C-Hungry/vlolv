import { BiddingStatusCode, BidStatusCode } from "./config";
/**
 * 根据项目状态码配置相应色值(不包含投标)
 */
export const getColorByCode = param => {
  let obj = param || {};
  let status = obj.status;
  if (status == BiddingStatusCode.unpublished) {
    obj.color = "#FF8933";
  } else if (status == BiddingStatusCode.published) {
    obj.color = "#11A0F8";
  } else if (status == BiddingStatusCode.inbidding ||
    status == BiddingStatusCode.evaluating ||
    status == BiddingStatusCode.executory ||
    status == BiddingStatusCode.cancelPublicity) {
    obj.color = "#2FC045";
  } else if (status == BiddingStatusCode.publicity) {
    obj.color = "#EA1336";
  } else {
    obj.color = "#999999";
  }
  return obj;
}
/**
 * 根据项目状态码配置相应色值(投标)
 */
export const getColorByCode2 = param => {
  let obj = param || {};
  let status = obj.tenderBidStatus;
  if (status == BidStatusCode.hasBid) {
    obj.color = "#2FC045";
  } else if (status == BidStatusCode.evaluating || status == BidStatusCode.executory) {
    obj.color = "#FF8933";
  } else if (status == BidStatusCode.beBidded) {
    obj.color = "#EA1336";
  } else {
    obj.color = "#999999";
  }
  return obj;
}
/**
 * 过去招标进度条的当前位置
 */
export const getCurrentStep = (progressItems, servTime) => {
  let time = new Date(servTime).getTime();
  let publishTime = new Date(progressItems[0].time).getTime();
  let startTenderTime = new Date(progressItems[1].time).getTime();
  let endTenderTime = new Date(progressItems[2].time).getTime();
  let publicityTime = new Date(progressItems[3].time).getTime();
  if (time < startTenderTime) {
    return 0;
  }
  if (time > startTenderTime && time < endTenderTime) {
    return 1;
  }
  if (time > endTenderTime && time < publicityTime) {
    return 2;
  }
  if (time > publicityTime) {
    return 3;
  }
}