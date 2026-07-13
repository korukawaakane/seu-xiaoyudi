/**
 * 访问统计预留。
 *
 * 目前不加载任何第三方统计脚本。未来经团队决定后，在此选择服务商、
 * 再通过部署平台配置其公开站点标识；不要将密钥提交到仓库。
 */
export const analyticsConfig = {
  provider: "none" as const,
};

export type FutureAnalyticsProvider = "baidu" | "google";
