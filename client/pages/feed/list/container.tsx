import Image from 'client/components/image';
import InfiniteScroller from 'client/components/infinite-scroller';
import Page from 'client/components/page';
import store, { IRootState } from 'client/store';
import { IFeed } from 'client/types/modules/feed';
import { fetchFeedList, setScrollTop, TActionFunction } from 'client/store/feed/actions';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import * as url from 'url';

interface IProps extends RouteComponentProps<any> {
  feedList: IFeed[];
  listScrollTop: number;
  currentPage: number;
  totalPages: number;
  fetchFeedList: TActionFunction;
  setScrollTop: TActionFunction;
}
interface IState {
  statusActiveIndex: number;
}

enum EStatus {
  COMING = 0,
  ALIVE = 2,
  OVER = 1,
}

const FEED_TYPES = [
  {
    id: '',
    text: '全部活动',
  },
  {
    id: EStatus.COMING,
    text: '预告',
  },
  {
    id: EStatus.ALIVE,
    text: '进行中',
  },
];

class FeedList extends Page<IProps, IState> {

  sourceId: string;
  infiniteScrollerScrollTop: number;
  enableFirstTriggerLoad: boolean;
  infiniteScrollerContainer: HTMLDivElement;

  state = {
    statusActiveIndex: 0,
  };

  constructor(props: IProps) {
    super(props);
    this.handleLoadMore = this.handleLoadMore.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.setInfiniteScrollerContainerRef = this.setInfiniteScrollerContainerRef.bind(this);
    const { query } = url.parse(global.location.search, true);
    this.sourceId = query.sourceId as string;
    this.infiniteScrollerScrollTop = this.props.listScrollTop;
    this.enableFirstTriggerLoad = this.props.feedList.length === 0;
  }

  // componentDidMount() {
  //   this.share();
  // }

  componentWillUnmount() {
    store.dispatch(setScrollTop((this.infiniteScrollerContainer as HTMLDivElement).scrollTop));
  }

  handleLoadMore() {
    return this.fetchData(this.props.currentPage + 1, this.state.statusActiveIndex);
  }

  fetchData(targetPage: number, statusActiveIndex: number) {
    return store.dispatch(this.props.fetchFeedList({
      currentPage: targetPage,
      sourceId: this.sourceId,
      pageSize: this.pagination.pageSize,
      status: FEED_TYPES[statusActiveIndex].id,
    }, targetPage === 1));
  }

  handleStatusChange(item: any, statusActiveIndex: number) {
    this.fetchData(1, statusActiveIndex);
    this.setState({
      statusActiveIndex,
    });
  }

  onFeedClick(feed: IFeed) {
    this.props.history.push(`/feeds/${feed.id}`);
  }

  setInfiniteScrollerContainerRef(el: HTMLDivElement) {
    this.infiniteScrollerContainer = el;
  }

  render() {
    const hasMore = this.props.currentPage < this.props.totalPages;
    return (
      <InfiniteScroller
        enableFirstTriggerLoad={this.enableFirstTriggerLoad}
        initScrollTop={this.infiniteScrollerScrollTop}
        containerRef={this.setInfiniteScrollerContainerRef}
        loadMore={this.handleLoadMore}
        hasMore={hasMore}>
        <div className="feed-list">
          <h2>
            活动动态&nbsp;
          </h2>
          <div className="feed-list__body">
            {
              this.props.feedList.map((feed: IFeed) => {
                return (
                  <div
                    key={feed.id}
                    className="feed-wrapper"
                    onClick={this.onFeedClick.bind(this, feed)}>
                    <div className="image-wrapper">
                      <Image src={feed.imageSrc} default="feedsBg" upyunArgs="/fw/750" type="div"></Image></div>
                    <div className="info">
                      <h3>{feed.title}</h3>
                    </div>
                  </div>
                );
              })
            }
          </div>
          <style jsx>{`
            @import 'client/assets/stylus/utils.styl';

            .feed-list {
              padding: 20px 0;
              h2 {
                abs-font-size(60);
                margin: 0;
                padding: 0 60px;
              }
              &__body {
                margin-top: 60px;
                .feed-wrapper {
                  position: relative;
                  & + .feed-wrapper {
                    margin-top: 40px;
                  }
                  .image-wrapper {
                    display: block;
                    width: 100%;
                    height: 400px !important;
                  }
                  .info {
                    margin: 0 20px;
                    padding: 20px 0 40px;
                    border-bottom: 1px solid $border-color-light-gray;
                    h3 {
                      margin: 0;
                      abs-font-size(28);
                    }
                    p {
                      margin: 8px 0 0 0;
                      font-size: 24px;
                    }
                    strong {
                      margin: 20px 0 0 0;
                      font-size: 90px;
                      font-weight: 100;
                    }
                  }
                }
              }
            }
          `}</style>
        </div>
      </InfiniteScroller>
    );
  }
}

const mapStateToProps = (state: IRootState) => ({
  feedList: state.feed.list,
  listScrollTop: state.feed.listScrollTop,
  currentPage: state.feed.currentPage,
  totalPages: state.feed.totalPages,
});

const mapDispatchToProps = () => ({
  fetchFeedList,
  setScrollTop,
});

export default connect(mapStateToProps, mapDispatchToProps)(FeedList);
