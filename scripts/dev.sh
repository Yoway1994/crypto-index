#!/bin/bash

# 啟動後端
(go run ./cmd) &

# 啟動前端
(cd next-js && npm run dev) &

# 等待用戶按 Ctrl+C
wait 