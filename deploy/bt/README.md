# FeBook 迁移到宝塔 / 自建 Nginx

FeBook 是 Rspress 静态文档站。迁移到宝塔时，服务器不需要安装 Node.js 或 pnpm，只需要把 GitHub Actions 构建出的 `doc_build/` 同步到宝塔站点目录。

## 宝塔站点建议配置

| 项目 | 值 |
| --- | --- |
| 站点域名 | `fe.fenewbee.com` |
| 站点目录 | `/www/wwwroot/fe.fenewbee.com` |
| 运行环境 | 纯静态，不需要 PHP |
| 默认文档 | `index.html` |
| HTTPS | 宝塔申请 Let's Encrypt，证书覆盖 `fe.fenewbee.com` |

站点创建后，把 [nginx-site-snippet.conf](./nginx-site-snippet.conf) 的内容粘到宝塔站点 Nginx 配置的 `server { ... }` 内部。保留宝塔生成的 `listen`、`server_name`、`root`、SSL 证书配置，只补充或替换静态站点相关的 `location` 规则。

## 本地手动部署

```bash
BT_HOST=154.8.227.167 \
BT_USER=febook_deploy \
BT_PORT=22 \
BT_TARGET_DIR=/www/wwwroot/fe.fenewbee.com \
BT_SSH_KEY_FILE=/path/to/private-key \
bash scripts/deploy-bt.sh
```

先预览将要同步和删除的文件：

```bash
BT_DRY_RUN=1 \
BT_HOST=154.8.227.167 \
BT_USER=febook_deploy \
BT_PORT=22 \
BT_TARGET_DIR=/www/wwwroot/fe.fenewbee.com \
BT_SSH_KEY_FILE=/path/to/private-key \
bash scripts/deploy-bt.sh
```

脚本会执行 `pnpm build`，然后用 `rsync --delete` 同步 `doc_build/`。它会保留宝塔常见的 `.well-known/` 和 `.user.ini`。

## GitHub Actions 自动发布

仓库已添加 [.github/workflows/deploy-bt.yml](../../.github/workflows/deploy-bt.yml)，默认在 `main` 分支 push 和手动触发时发布。

在 GitHub 仓库 `Settings -> Secrets and variables -> Actions -> Repository secrets` 添加：

| Secret | 说明 |
| --- | --- |
| `BT_HOST` | SSH 主机，例如 `154.8.227.167` |
| `BT_USER` | SSH 用户，例如 `febook_deploy` |
| `BT_PORT` | SSH 端口，不填时按 `22` |
| `BT_TARGET_DIR` | 宝塔站点目录，例如 `/www/wwwroot/fe.fenewbee.com` |
| `BT_SSH_KEY` | 可登录服务器的私钥内容 |

DNS 切换到宝塔服务器后，建议验证：

```bash
curl -I https://fe.fenewbee.com/
curl -I https://fe.fenewbee.com/sw.js
curl -I https://fe.fenewbee.com/manifest.webmanifest
```
