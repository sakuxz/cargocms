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
* 新增 birthday、phone1、phone2、address、address2、lastLoginIP、lastLoginLat、lastLoginLng

### 新增 Contacts Table

* 新增 Contacts Table 用於聯繫表單


### 新增 Event 相關 Table

* 新增 EventOrders
* 新增 Events
* Post type 新增 'internal-event','external-event' enum
* Post url 清空目前沒有地方有用到
* Post url 改名為 alias 放 url 別名


## v3

### 新增 RecipeOrders
* 新增 shipping 運送物流
* 新增 trackingNumber 物流編號

### 紀錄方式改變

* 更新 Image 的格式
原本 `local` 的紀錄格式由 `/home/ubuntu/cargocms/.tmp/public/uploads/<<filename>>`，更新為 `file:///home/ubuntu/cargocms/.tmp/public/uploads/<<filename>>`

### Message 欄位變動

*  type 新增 contact enum
