import * as Koa from 'koa';
import Router from 'koa-router';
export default (router: Router) => {
  // 列表
  router.get('/api/feeds', async (ctx: Koa.Context) => {
    const { query } = ctx;
    const data = await ctx.http.post('/path/to/get/feed/list', {
      currentPage: query.currentPage,
      pageSize: query.pageSize,
      jumpLinkId: query.sourceId,
      state: query.status,
    });
    const result = data.result;
    result.list = result.list || [];
    ctx.body = {
      ...data,
      result: {
        currentPage: result.currentPage,
        totalPages: result.pageCount,
        list: result.list.map((item: any) => {
          return {
            id: item.nid,
            imageSrc: item.coverImageUrl,
            title: item.title,
            activityStartTime: item.activityTimeStart,
            activityEndTime: item.activityTimeEnd,
            status: item.activityState,
          };
        }),
      },
    };
  });
  // 详情
  router.get('/api/feeds/:id', async (ctx: Koa.Context) => {
    const { params } = ctx;
    const data = await ctx.http.post('/path/to/get/feed/detail/by/id', {
      dynamicNid: params.id,
    });
    const result = data.result;
    result.dynamicOthers = result.dynamicOthers || [];
    ctx.body = {
      ...data,
      result: {
        id: result.nid,
        imageSrc: result.coverImageUrl,
        title: result.title,
        activityStartTime: result.activityTimeStart,
        activityEndTime: result.activityTimeEnd,
        status: result.activityState,
        // 发布状态，用于判断是否预览
        publishStatus: result.publishState,
        htmlContent: result.context,
        relatedItems: result.dynamicOthers.map((item: any) => {
          return {
            id: item.dataId,
            logoSrc: item.logoUrl,
            name: item.name,
            type: item.dataType,
          };
        }),
      },
    };
  });
};
