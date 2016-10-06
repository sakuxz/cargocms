# change log

## v1

### User 欄位變動



### Recipe 欄位變動

## v2

## 修正訂單編號

* 修正沒有使用歐付寶時有 TradeNo

### Feed 欄位變動

* 新增 createdTime 紀錄 feed 在 facebook 的建立時間
* 新增 publish 紀錄 feed 是否發布

### Message 欄位變動

*  type 新增 forgotPassword enum

### User 欄位變動

* 新增 resetPasswordToken 紀錄忘記密碼的 token

### 新增 Contacts Table

* 新增 Contacts Table 用於聯繫表單

## v3

* 更新 Image 的格式
原本 `local` 的紀錄格式由 `/home/ubuntu/cargocms/.tmp/public/uploads/<<filename>>`，更新為 `file:///home/ubuntu/cargocms/.tmp/public/uploads/<<filename>>`
