package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"crypto-index/third-party"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// 初始化 Gin
	router := gin.Default()

	// CORS 設置
	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{
			"http://localhost:3000",
			"https://crypto-index-2.onrender.com", // 改為具體的前端域名
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization", "X-Requested-With"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: false, // 改為 false，因為我們不需要傳送 cookies
		MaxAge:           12 * time.Hour,
	}))

	// 基本的健康檢查路由
	router.GET("/health", func(c *gin.Context) {
		log.Println("Received ping request - responding with pong!")
		c.JSON(http.StatusOK, gin.H{
			"status":  "ok",
			"message": "pong",
			"time":    time.Now().Format(time.RFC3339),
		})
	})

	// Dith AI 分析路由
	router.POST("/api/analyze-token", func(c *gin.Context) {
		var req struct {
			Address string `json:"address" binding:"required"`
		}

		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "Invalid request body",
			})
			return
		}

		dithClient := thirdparty.NewDithClient()
		analysis, err := dithClient.AnalyzeToken(req.Address)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": fmt.Sprintf("Failed to analyze token: %v", err),
			})
			return
		}

		c.JSON(http.StatusOK, analysis)
	})

	// 建立 HTTP 服務器
	srv := &http.Server{
		Addr:    ":8888",
		Handler: router,
	}

	// 在 goroutine 中啟動服務器
	go func() {
		log.Println("Server starting on :8888")
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %s\n", err)
		}
	}()

	// 等待中斷信號以優雅地關閉服務器
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down server...")

	// 設定 5 秒的超時時間
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Server forced to shutdown:", err)
	}

	log.Println("Server exiting")
}
