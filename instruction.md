# 專案總覽
建立一個加密貨幣指數分析網站，可以分析加密貨幣指數的歷史資料，並且可以預測未來的指數走勢。
後端使用golang語言，前端使用next.js框架。

# 核心功能
- 儲存並分析加密貨幣價格，各種量化指標；包含但不限於：
  - 價格
  - 成交量
  - 各種已知技術分析指標
  - 搜尋量
  - 其他第三方量化指標
- 圖形化顯示各種數據走勢
- 監控鏈上資料

# 文件
## 後端架構說明
後端採用Clean Architecture架構，主要分為以下幾層：
1. Domain Layer (領域層)
   - 定義核心業務邏輯和實體
   - 包含所有業務規則和實體模型
   
2. Application Layer (應用層)
   - 實作使用案例（Use Cases）
   - 協調領域對象和服務
   - 處理業務流程
   
3. Infrastructure Layer (基礎設施層)
   - 實現與外部系統的整合
   - 數據庫存取
   - 外部API調用
   
4. Interface Layer (介面層)
   - HTTP API endpoints
   - Middleware
   - 請求/響應處理

# 架構