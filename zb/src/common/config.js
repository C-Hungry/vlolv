/**
 * 招标项目状态码code
 */
export const BiddingStatusCode = {
  all: -1,
  unpublished: 0,
  published: 1,
  cancelPublished: 2,
  inbidding: 3,
  evaluating: 4,
  executory: 5,
  cancelPublicity: 6,
  publicity: 7,
  bidingFailed: 8
}
/**
 * 已投标项目状态码code
 */
export const BidStatusCode = {
  all: -1,
  hasBid: 0,
  hasCancel: 1,
  evaluating: 2,
  executory: 3,
  beBidded: 4,
  bidFailed: 5
}