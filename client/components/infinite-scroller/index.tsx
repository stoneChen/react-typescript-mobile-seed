import * as React from 'react';
// lodash声明文件的导出是commonjs，而我们的tsconfig配置的是esnext，所以只能用require了
const debounce = require('lodash/debounce');

export type TLoadmore = () => Promise<any>;
export interface IProps {
  // 加载更多回调函数
  loadMore: TLoadmore;
  hasMore: boolean;
  initScrollTop?: number;
  containerRef?: (el: HTMLDivElement) => void;
  onScroll?: (e: React.MouseEvent<HTMLDivElement>) => void;
  // 是否开启首次触发loadMore事件
  enableFirstTriggerLoad?: boolean;
}

interface IState {
  isFirstLoading: boolean;
  isLoading: boolean;
}

class InfiniteScroller extends React.Component<IProps, IState> {
  static defaultProps = {
    initScrollTop: 0,
    containerRef: () => {},
    enableFirstTriggerLoad: true,
  };

  // 滚动的DOM节点
  wrapper: any = null;

  // 上拉加载更多触发阈值
  pullLoadThreshold: number = 100;

  /**
   * 是否允许触发loadmore事件
   * 目的：this.setState()是异步的，所以需要声明可以同步
   * 操作的属性，来判断是否可以
   */
  // lock: boolean = false;

  constructor(props: any) {
    super(props);
    this.state = {
      isFirstLoading: true,
      // 是否在加载更多中
      isLoading: false,
    };
    this.setContainerRef = this.setContainerRef.bind(this);
  }

  componentDidMount() {
    if (this.props.enableFirstTriggerLoad) {
      // 首次加载暂不考虑显示loading
      this.props.loadMore()
      // 首次加载完毕后再绑定scroll事件
      // TODO待确认： 可能会在dom更新之前绑定
        .then(this.init.bind(this));
    } else {
      this.init();
    }
    setTimeout(() => {
      this.wrapper.scrollTop = this.props.initScrollTop;
    }, 50);
  }

  /**
   * 初始化
   */
  init() {
    // 首次加载结束
    this.setState({
      isFirstLoading: false,
    });
    // 绑定事件
    this.bindEvents();
  }

  /**
   * 绑定事件
   */
  bindEvents() {
    if (this.wrapper) {
      this.wrapper.addEventListener('scroll', debounce((e: React.MouseEvent<HTMLDivElement>) => {
        if (this.props.onScroll) {
          this.props.onScroll(e);
        }
        this.onScroll();
      }, 20));
    }
  }

  setContainerRef(el: HTMLDivElement) {
    this.wrapper = el;
    if (this.props.containerRef) {
      this.props.containerRef(el);
    }
  }

  /**
   * 滚动触发事件
   */
  onScroll() {
    if (this.state.isLoading || !this.props.hasMore) {
      return;
    }
    const wrapper = this.wrapper;
    if (wrapper.scrollTop + wrapper.offsetHeight + this.pullLoadThreshold
      >= wrapper.scrollHeight) {
      // 触发加载更多
      this.updateLoadingStatus(true);
      this.props.loadMore()
        .then(() => {
          this.updateLoadingStatus(false);
        });
    }
  }

  /**
   * 修改状态
   */
  updateLoadingStatus(status: boolean) {
    const state: IState = this.state;
    state.isLoading = status;
  }

  render() {
    // 如果还有更多，显示loading
    // 即使还未调用loadMore, loading文案在页面底部，问题不大，这样逻辑简单
    const hasMore = this.props.hasMore;
    const loadingClass =
      hasMore && !this.state.isFirstLoading ? '' : 'hide';
    const nomoreClass =
      !hasMore && !this.state.isFirstLoading ? '' : 'hide';
    return (
      <div className="infinite-scroller-wrapper" ref={this.setContainerRef}>
        <div className="infinite-scroller-body clearfix">
          {this.props.children}
          <p className={loadingClass}>
            正在加载更多数据<span className="spinner"><i></i><i></i><i></i></span>
          </p>
          <p className={nomoreClass}>没有更多了~</p>
        </div>
        <style jsx>{`
          @import 'client/assets/stylus/variables.styl';
          @import 'client/assets/stylus/utils.styl';

          .infinite-scroller-wrapper {
            // ios10.2有bug，绝对定位用于修复【flex: 1元素下的容器(height: 100%)无法定高100%】的问题
            position: absolute;
            width: 100%;
            height: 100%;
            overflow: auto;
            -webkit-overflow-scrolling: touch;
          }
          p {
            margin: 50px 0;
            text-align: center;
            color: $gray-1;
            abs-font-size(24);
          }
          .spinner {
            position: relative;
            i {
              position: absolute;
              animation: floating .8s infinite;
              &:after {
                content: '·';
              }
            }
          }

          for i in (1..3)
            .spinner i:nth-child({i})
              animation-delay: (0.1 * (i - 1))s
              left: unit((10 * (i - 1)), 'PX');

          @keyframes floating {
            0% {
              transform: translateY(0);
            }

            25% {
              transform: translateY(-50%);
            }

            50% {
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    );
  }
}

export default InfiniteScroller;
