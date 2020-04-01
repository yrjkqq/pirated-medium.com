package main

import (
	"context"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
	"github.com/jinzhu/gorm"
	"pirated-medium.com/server/hello"
)

// Login Binding from JSON
type Login struct {
	User     string `form:"user" json:"user" xml:"user" binding:"required"`
	Password string `form:"password" json:"password" xml:"password" binding:"required"`
	//Password string `form:"password" json:"password" xml:"password" binding:"-"`
}

type student struct {
	Name string
	Age  int8
}

// Product ..
type Product struct {
	gorm.Model
	Code  string
	Price uint
}

var secrets = gin.H{
	"foo":  gin.H{"email": "foo@bar.com", "phone": "123433"},
	"lena": gin.H{"email": "lena@guapa.com", "phone": "523443"},
}

func generateLogWriter(logPath string) io.Writer {
	// if _, err := os.Stat(logPath); os.IsNotExist(err) {
	// 	logWriter, error := os.Create(logPath)
	// 	if error != nil {
	// 		log.Fatalf("create %v failed: %v", logPath, error.Error())
	// 	}
	// 	return logWriter
	// }
	// If the file doesn't exist, create it, or append to the file
	logWriter, error := os.OpenFile(logPath, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if error != nil {
		log.Fatalf("open %v failed: %v", logPath, error.Error())
	}
	return logWriter
}

// AuthRequired ...
func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		t := time.Now()
		c.Set("example", "12345")
		c.Next()
		latency := time.Since(t)
		log.Print(latency)
		status := c.Writer.Status()
		log.Println(status)
	}
}

func main() {

	db, err := gorm.Open("mysql", "root:03221006@/pirated_medium?charset=utf8&parseTime=True&loc=Local")
	if err != nil {
		log.Fatal("failed to connect database")
	}
	defer db.Close()

	db.AutoMigrate(&Product{})
	p := Product{Code: "L1212", Price: 1000}
	db.Create(&p)

	var product Product
	db.First(&product, 1)
	db.First(&product, "code = ?", "L1212")

	db.Model(&product).Update("price", 2000)

	db.Delete(&product)

	dirName := "logs"
	if _, err := os.Stat(dirName); os.IsNotExist(err) {
		os.Mkdir("logs", os.ModePerm)
	}
	// ginLogFilename := "logs/gin.log"
	// gin.DefaultWriter = io.MultiWriter(generateLogWriter(ginLogFilename))

	debugLogFilename := "logs/debug.log"
	logger := log.New(generateLogWriter(debugLogFilename), "[LOGGER-debug] ", log.Ldate|log.Ltime|log.Lshortfile)

	r := gin.Default()
	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, hello.Hello())
	})

	r.GET("/user/:name", func(c *gin.Context) {
		name := c.Param("name")
		c.String(http.StatusOK, "Hello %s", name)
	})

	r.GET("/users", func(c *gin.Context) {
		name := c.Query("name")
		role := c.DefaultQuery("role", "teacher")
		c.String(http.StatusOK, "%s is %s", name, role)
	})

	// CORS: Preflighted Reqeusts
	r.OPTIONS("/form", func(c *gin.Context) {
		c.Writer.Header().Add("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Add("Access-Control-Allow-Methods", "POST, GET")
		c.Writer.Header().Add("Access-Control-Allow-Headers", "Content-Type")
		c.Writer.Header().Add("Access-Control-Max-Age", "1728000")
		c.JSON(http.StatusOK, nil)
	})
	r.POST("/form", func(c *gin.Context) {
		username := c.PostForm("username")
		password := c.DefaultPostForm("password", "000000")
		c.Writer.Header().Add("Access-Control-Allow-Origin", "*")
		c.JSON(http.StatusOK, gin.H{
			"username": username,
			"password": password,
		})
	})

	r.POST("/posts", func(c *gin.Context) {
		id := c.Query("id")
		page := c.DefaultQuery("page", "0")
		username := c.PostForm("username")
		password := c.DefaultPostForm("password", "000000")

		c.JSON(http.StatusOK, gin.H{
			"id":       id,
			"page":     page,
			"username": username,
			"password": password,
		})
	})

	// r.POST("/post", func(c *gin.Context) {
	// 	ids := c.QueryMap("ids")
	// 	names := c.Post
	// })

	// Example for binding JSON ({"user":"mua", "password":"123"})
	r.POST("/loginJSON", func(c *gin.Context) {
		var json Login
		if err := c.ShouldBindJSON(&json); err != nil {
			logger.Printf(err.Error())
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		if json.User != "mua" || json.Password != "123" {
			logger.Printf("unauthorized")
			c.JSON(http.StatusUnauthorized, gin.H{"status": "unauthorized"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"status": "you are logged in"})
	})

	r.GET("/redirect", func(c *gin.Context) {
		c.Redirect(http.StatusMovedPermanently, "/index")
	})

	r.GET("/index", func(c *gin.Context) {
		c.Request.URL.Path = "/"
		r.HandleContext(c)
	})

	// 分组路由
	defaultHandler := func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"path": c.FullPath(),
		})
	}

	v1 := r.Group("/v1")
	// group: v1
	{
		v1.GET("/posts", defaultHandler)
		v1.GET("/series", defaultHandler)
	}

	// group: v2
	v2 := r.Group("/v2")
	{
		v2.GET("/posts", defaultHandler)
		v2.GET("/series", defaultHandler)
	}

	// 上传
	r.POST("/upload1", func(c *gin.Context) {
		file, err := c.FormFile("file")
		if err != nil {
			logger.Println(err)
			c.String(http.StatusInternalServerError, fmt.Sprintf("files upload filed: %v", err))
			return
		}
		c.String(http.StatusOK, "%s uploaded!", file.Filename)
	})

	r.POST("/upload2", func(c *gin.Context) {
		form, _ := c.MultipartForm()
		files := form.File["upload[]"]

		for _, file := range files {
			log.Println(file.Filename)
		}
		c.String(http.StatusOK, fmt.Sprintf("%d files uploaded!", len(files)))
	})

	// html 模版
	r.LoadHTMLGlob("templates/*")
	stu1 := &student{Name: "Jack", Age: 20}
	stu2 := &student{"ma", 24}
	r.GET("/arr", func(c *gin.Context) {
		c.HTML(http.StatusOK, "arr.tmpl", gin.H{
			"title":  "Gin",
			"stuArr": [2]*student{stu1, stu2},
		})
	})

	// serving static files
	r.Static("/static", "./static")

	// using middleware
	// authorized := r.Group("/auth", AuthRequired())
	// {
	// 	authorized.POST("/login", func(c *gin.Context) {
	// 		example := c.MustGet("example").(string)
	// 		log.Println(example)
	// 	})
	// 	authorized.POST("/submit", defaultHandler)

	// 	testing := authorized.Group("testing")
	// 	testing.GET("/analytics", defaultHandler)
	// }

	// goroutines inside a middleware
	// response immediately but print after 5 seconds
	r.GET("long_async", func(c *gin.Context) {
		// create copy to be used inside the goroutine
		cCp := c.Copy()
		go func() {
			time.Sleep(5 * time.Second)
			log.Println("Done! in path " + cCp.Request.URL.Path)
		}()
	})
	// response and print after 5 seconds
	r.GET("/long_sync", func(c *gin.Context) {
		time.Sleep(5 * time.Second)
		log.Println("Done! in path", c.Request.URL.Path)
	})

	// using BasicAuth middleware
	// how to use?
	// 1. 对 foo:bar 进行 base64 加密：Zm9vOmJhcg==
	// with node.js: new Buffer("foo:bar").toString('base64')
	// 2. 请求头中添加 Authorization:Basic Zm9vOmJhcg==
	authorized := r.Group("/admin", gin.BasicAuth(gin.Accounts{
		"foo":    "bar",
		"austin": "1234",
	}))
	authorized.GET("/secrets", func(c *gin.Context) {
		user := c.MustGet(gin.AuthUserKey).(string)
		if secret, ok := secrets[user]; ok {
			c.JSON(http.StatusOK, gin.H{"user": user, "secret": secret})
		} else {
			c.JSON(http.StatusOK, gin.H{"user": user, "secret": "NO SECRET :("})
		}
	})

	// r.Run() // listen and serve on 0.0.0.0:8080
	// graceful shutdown
	srv := &http.Server{
		Addr:    ":8088",
		Handler: r,
	}
	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %s\n", err)
		}
	}()

	// Wait for interrupt signal to gracefully shutdown the server with
	// a timeout of 5 seconds.
	quit := make(chan os.Signal)
	// kill (no param) default send syscanll.SIGTERM
	// kill -2 is syscall.SIGINT
	// kill -9 is syscall. SIGKILL but can"t be catch, so don't need add it
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	logger.Println("Shutdown Server ...")

	ctx, cancel := context.WithTimeout(context.Background(), 0*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		logger.Fatal("Server Shutdown:", err)
	}
	// catching ctx.Done(). timeout of 5 seconds.
	select {
	case <-ctx.Done():
		logger.Println("timeout of 0 seconds")
	}
	logger.Println("Server exiting")

}
