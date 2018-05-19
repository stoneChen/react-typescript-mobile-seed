import Closer from 'client/components/closer';
import Image from 'client/components/image';
import Nonentity from 'client/components/nonentity';
import Page from 'client/components/page';
import PreviewTip from 'client/components/preview-tip';
import RelatedItems from 'client/components/related-items';
import store, { IRootState } from 'client/store';
import { fetchFeedDetail, TActionFunction } from 'client/store/feed/actions';
import { IFeed } from 'client/types/modules/feed';
import sessionStorage from 'client/utils/session-storage';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';

export interface IProps extends RouteComponentProps<IRouteParams> {
  feedDetail: IFeed;
  fetchFeedDetail: TActionFunction;
}

interface IRouteParams {
  id: string;
  preview?: string;
}

export interface IState {
  isLoading: boolean;
}

// 发布状态
enum EPublishStatus {
  UNPUBLISHED = 0, // 未发布
  TOBE_PUBLISHED = 1, // 待发布
  PUBLISHED = 2, // 已发布
}

// 动态状态
enum EStatusDesc {
  '预告' = 0,
  '进行中' = 2,
  '已结束' = 1,
}
class FeedDetail extends Page<IProps, IState> {

  // 发布者信息，从session中取，从哪个页面来的，由前端来记录
  feedPublisherInfo: any;
  state = {
    isLoading: true,
  };

  constructor(props: IProps) {
    super(props);
    this.onClose = this.onClose.bind(this);
    this.onClickPublisher = this.onClickPublisher.bind(this);
    this.feedPublisherInfo = sessionStorage.getItem('FEED_PUBLISHER_INFO', true);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    return store.dispatch(this.props.fetchFeedDetail(this.props.match.params.id))
      .then((res: any) => {
        this.setState({
          isLoading: false,
        });
      });
  }

  onClose() {
    this.props.history.goBack();
  }

  onClickPublisher() {
    this.props.history.push(this.feedPublisherInfo.path);
  }

  render() {
    if (this.state.isLoading) {
      return null;
    }
    if (!this.props.feedDetail || !(this.props.feedDetail as any).id) {
      return <Nonentity></Nonentity>;
    }
    const {
      title,
      status,
      imageSrc,
      htmlContent,
      activityStartTime,
      activityEndTime,
      publishStatus,
      relatedItems,
    } = this.props.feedDetail as any;

    const isPreview = publishStatus === EPublishStatus.UNPUBLISHED || publishStatus === EPublishStatus.TOBE_PUBLISHED;

    const feedPublisherInfo = this.feedPublisherInfo;
    return (
      <div className="feed-detail">
        {isPreview ? <PreviewTip></PreviewTip> : null}
        <Closer onClick={this.onClose}></Closer>
        <div className="banner">
          <Image src={imageSrc} default="feedsBg" upyunArgs="/fw/750" type="div"></Image>
        </div>
        <h2>{title}</h2>
        {
          feedPublisherInfo ?
            <div className="store-info" onClick={this.onClickPublisher}>
              <small>
                <Image src={feedPublisherInfo.logoSrc} upyunArgs="/fw/36"></Image>
              </small> {feedPublisherInfo.name}
            </div>
          : null
        }
        <p className="time-info">
          <span className="status">{EStatusDesc[status]}</span>  有效期 {activityStartTime} ~ {activityEndTime}
        </p>
        <div className="content-container" dangerouslySetInnerHTML={{ __html: htmlContent }}></div>
        <RelatedItems
          history={this.props.history}
          title="活动中提到的"
          items={relatedItems}></RelatedItems>
        <style jsx>{`
          @import 'client/assets/stylus/variables.styl';
          @import 'client/assets/stylus/utils.styl';

          .feed-detail {
            padding-bottom: 100px;
            .banner {
              width: 100%;
              height: 400px;
            }
            h2 {
              margin: 80px 0 0;
              abs-font-size(40);
              text-align: center
            }
            .store-info {
              margin-top: 20px;
              abs-font-size(20);
              text-align: center;
              small {
                display: inline-block;
                width: 36px;
                height: 36px;
                border-radius: 100%;
                vertical-align: middle;
                overflow: hidden;
              }
            }
            .time-info {
              margin-top: 26px;
              text-align: center;
              abs-font-size(20);
              color: $light-gray;
              .status {
                padding: 0 10px;
                background-image: linear-gradient(-225deg, #9D3EC5 0%, #FF6346 100%);
                box-shadow: 1px 3px 7px 0 rgba(216,84,122,0.34);
                border-radius: 100px;
                color: #fff;
              }
            }
            .content-container {
              margin-top: 50px;
              padding: 0 40px;
              :global(img) {
                max-width: 100% !important;
              }
            }
          }
        `}</style>
      </div>
    );
  }
}

const mapStateToProps = (state: IRootState) => ({
  feedDetail: state.feed.detail,
});

const mapDispatchToProps = () => ({
  fetchFeedDetail,
});

export default connect(mapStateToProps, mapDispatchToProps)(FeedDetail);
