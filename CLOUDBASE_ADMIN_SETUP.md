# CloudBase 内容后台启用说明

后台地址：`/admin/`

后台直接读写 CloudBase 的 `projects`、`people`、`stories`、`achievements`
集合。浏览器端不使用 SecretId 或 SecretKey。

## 1. 开启成员账号登录

1. 打开 CloudBase 控制台。
2. 进入“身份认证”。
3. 在登录方式中开启“用户名密码登录”。
4. 在用户管理中创建三个成员账号，分别设置用户名、密码和昵称。
5. 记录每个成员的 UID。

## 2. 创建成员表

在文档型数据库创建 `cms_members` 集合。为每位成员新增一条文档，文档 ID
必须等于该成员的 UID。

管理员文档：

```json
{
  "name": "管理员姓名",
  "role": "admin",
  "active": true
}
```

普通编辑文档：

```json
{
  "name": "编辑姓名",
  "role": "editor",
  "active": true
}
```

`admin` 可以发布内容，`editor` 只能保存草稿或提交审核。

## 3. 设置成员表安全规则

在 `cms_members` 集合的“权限管理”中切换到安全规则：

```json
{
  "read": "auth != null && doc._id == auth.uid",
  "write": false
}
```

## 4. 设置四个内容集合安全规则

`projects`、`people`、`stories`、`achievements` 四个集合使用相同规则：

```json
{
  "read": true,
  "create": "auth != null && get(`database.cms_members.${auth.uid}`).active == true && (doc.status != 'published' || get(`database.cms_members.${auth.uid}`).role == 'admin')",
  "update": "auth != null && get(`database.cms_members.${auth.uid}`).active == true && (doc.status != 'published' || get(`database.cms_members.${auth.uid}`).role == 'admin')",
  "delete": "auth != null && get(`database.cms_members.${auth.uid}`).role == 'admin'"
}
```

公开访客仍可读取内容。只有 `cms_members` 中启用的成员可以新增或修改，
只有管理员可以直接保存为 `published`。

## 5. 发布更新

后台保存会立即写入 CloudBase。当前公开网站使用静态部署，因此一批内容审核
完成后，需要在 CloudBase 静态网站托管中重新部署一次，新的列表和详情页面才会
出现在公开网站。
