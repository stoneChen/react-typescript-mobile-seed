import * as React from 'react';
import appRoutes from './routes';
import { Switch, RouteComponentProps, withRouter } from 'react-router-dom';
import events from 'client/utils/events';
import Page from 'client/components/page';

// lodash声明文件的导出是commonjs，而我们的tsconfig配置的是esnext，所以只能用require了
const debounce = require('lodash/debounce');

interface IState {
}
/**
 * 本组件已删除绝大部分逻辑
 */
class App extends Page<RouteComponentProps<any>, IState> {
  container: HTMLDivElement;

  constructor(props: any) {
    super(props);
    this.state = {
    };
    this.onContainerScroll = this.onContainerScroll.bind(this);
  }

  onContainerScroll() {
    return debounce((e: React.UIEvent<any>) => {
      events.emit('pages-container-scroll', e);
    }, 20);
  }

  render() {
    const pathname: string = this.props.location.pathname;
    return (
      <React.Fragment>
        <div
          className="pages-container"
          onScroll={this.onContainerScroll()}
          ref={(dom) => { this.container = dom as HTMLDivElement; }}>
          <Switch>
            {appRoutes}
          </Switch>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(App);
