import * as React from 'react';
import * as classnames from 'classnames';
import * as H from 'history';
import Image from 'client/components/image';

export interface IItem {
  id: string;
  logoSrc: string;
  name: string;
  type: number;
}

export interface IProps {
  title: string;
  items: IItem[];
  history: H.History;
}

export interface IState {
  // 是否展开more
  isExpanded: boolean;
}

const TYPES = {
  1: '银行',
  2: '商户',
  3: '商场',
};
/**
 * 诸如『活动中提到的』和『文章中提到的』这类组件
 */
class RelatedItems extends React.Component<IProps, IState> {
  state = {
    isExpanded: false,
  };

  constructor(props: IProps) {
    super(props);
    this.onClickMore = this.onClickMore.bind(this);
  }

  onClickMore() {
    this.setState((prevState: IState) => ({
      isExpanded: !prevState.isExpanded,
    }));
  }

  onClickItem(item: IItem, e: React.MouseEvent<any>) {
    e.stopPropagation();
    let urlPrefix = '';
    switch (item.type) {
      case 1:
        urlPrefix = '/discovery/bank';
        break;
      case 2:
        urlPrefix = '/stores';
        break;
      case 3:
        urlPrefix = '/discovery/mall';
        break;
    }
    this.props.history.push(`${urlPrefix}/${item.id}`);
  }

  render() {
    if (!this.props.items.length) {
      return null;
    }
    const iconClass = classnames({
      'iconfont icon-triangle-up': true,
      'down': this.state.isExpanded,
    });
    let renderQuantity: number | undefined;
    if (!this.state.isExpanded) {
      renderQuantity = 4;
    }
    const renderItems = this.props.items.slice(0, renderQuantity);
    const shouldShowMore = this.props.items.length > 4;
    return (
      <div className="related-info">
        <label>{this.props.title}</label>
        <ul>
          {
            renderItems.map((item) => {
              return (
                <li key={item.id} className="related-item flex" onClick={this.onClickItem.bind(this, item)}>
                  <div className="related-item__left">
                    <Image src={item.logoSrc} default="thumbnail" upyunArgs="/fw/120"></Image>
                  </div>
                  <div className="related-item__body flex-cell flex align-center">
                    <h5>{item.name}</h5>
                  </div>
                  <div className="related-item__right flex center">
                    <span>{TYPES[item.type]}</span>
                  </div>
                </li>
              );
            })
          }
        </ul>
        {
          shouldShowMore ?
            <div className="more" onClick={this.onClickMore}>
              {this.state.isExpanded ? '收起' : '查看更多'} <i className={iconClass}></i>
            </div>
            : null
        }
        <style jsx>{`
          @import 'client/assets/stylus/utils.styl';

          .related-info {
            margin: 100px 40px 0;
            padding-bottom: 20px;
            border-bottom: 1px solid $border-color-light-gray
            label {
              margin: 0;
              abs-font-size(40);
              font-weight: 500;
            }
            ul {
              margin: 40px 0;
              .related-item {
                & + .related-item {
                  margin-top: 40px;
                }
                &__left {
                  width: 120px;
                  height: 120px;
                  border-radius: 100%;
                  overflow: hidden;
                }
                &__body {
                  padding: 20px 40px;
                  h5 {
                    margin: 0;
                    abs-font-size(28);
                  }
                  p {
                    margin: 15px 0 0;
                    color: $light-gray;
                    abs-font-size(24);
                  }
                }
                &__right {
                  span {
                    padding: 10px 20px;
                    background-image: linear-gradient(-225deg, #9D3EC5 0%, #FF6346 100%);
                    box-shadow: 1px 3px 7px 0 rgba(216,84,122,0.34);
                    border-radius: 39px;
                    abs-font-size(24);
                    color: #fff;
                  }
                }
              }
            }
            .more {
              position: relative;
              margin-top: 20px;
              padding: 20px 0;
              abs-font-size(28);
              color: $dark-gray;
              .iconfont {
                position: absolute;
                right: 0;
                // top: 0;
                transform: rotate(180deg);
                &.down {
                  transform: rotate(0);
                }
              }
            }
          }
        `}</style>
      </div>
    );
  }
}

export default RelatedItems;
