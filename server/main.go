package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"pirated-medium.com/server/hello"
)

func main() {
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

	r.POST("/form", func(c *gin.Context) {
		username := c.PostForm("username")
		password := c.DefaultPostForm("username", "000000")
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

	r.POST("/post", func(c *gin.Context) {
		ids := c.QueryMap("ids")
		names := c.Post
	})

	r.Run() // listen and serve on 0.0.0.0:8080
}
