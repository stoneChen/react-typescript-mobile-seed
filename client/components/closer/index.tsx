import * as React from 'react';
import * as ReactDOM from 'react-dom';
import events from 'client/utils/events';

export interface IProps {
  onClick?: () => void;
}

export interface IState {
  // 是否空心样式
  // isHollow: boolean;
}

const DOC = global.document;

class Closer extends React.PureComponent<IProps, IState> {

  static defaultProps = {
    onClick: () => {},
  };

  state = {
    // isHollow: true,
  };

  constructor(props: IProps) {
    super(props);
    this.onClick = this.onClick.bind(this);
    // this.onPageContainerScroll = this.onPageContainerScroll.bind(this);
  }

  // onPageContainerScroll(e: React.UIEvent<any>) {
  //   const { scrollTop } = e.target as HTMLDivElement;
  //   this.setState({
  //     isHollow: scrollTop > 400,
  //   });
  // }

  // componentDidMount() {
  //   events.on('pages-container-scroll', this.onPageContainerScroll);
  // }

  // componentWillUnmount() {
  //   events.removeListener('pages-container-scroll', this.onPageContainerScroll);
  // }

  onClick(event: React.MouseEvent<HTMLDivElement>) {
    event.stopPropagation();
    (this.props.onClick as () => {})();
  }

  render() {
    return ReactDOM.createPortal(
      <div onClick={this.onClick}>
        <i className="iconfont icon-close"></i>
        <style jsx>{`
          @import 'client/assets/stylus/utils';

          div {
            position: fixed;
            right: 40px;
            top: 44px;
            z-index: $z-index-closer;
            width: 60px;
            height: 60px;
            line-height: 52px;
            font-size: 52px;
            text-align: center;
            transition: all .25s;
            color: #cfcfcf;
            i {
              font-size: 60px;
            }
          }
        `}</style>
      </div>,
      DOC.body,
    );
  }
}

export default Closer;
