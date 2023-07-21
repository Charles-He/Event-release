package server

import (
	"net/http"
	"rgb/internal/store"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

func createEngagement(ctx *gin.Context) {
	engagement := ctx.MustGet(gin.BindKey).(*store.Engagement)
	user, err := currentUser(ctx)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if err := store.AddEngagement(user, engagement); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"msg":  "Engagement created successfully.",
		"data": engagement,
	})
}

func createSubscription(ctx *gin.Context) {
	subscription := ctx.MustGet(gin.BindKey).(*store.Subscriptions)
	// subscription := new(store.Subscriptions)
	paramID := ctx.Param("id")
	id, err := strconv.Atoi(paramID)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Not valid ID."})
		return
	}

	if err := store.AddSubscription(id, subscription); err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"msg":  "Subscription created successfully.",
		"data": subscription,
	})
}

func indexEngagements(ctx *gin.Context) {
	user, err := currentUser(ctx)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if err := store.FetchUserEngagements(user); err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"msg":  "Engagements fetched successfully.",
		"data": user.Engagements,
	})
}

func indexEngagement(ctx *gin.Context) {
	// engagement := ctx.MustGet(gin.BindKey).(*store.Engagement)
	engagement := new(store.Engagement)
	paramID := ctx.Param("id")
	id, err := strconv.Atoi(paramID)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Not valid ID."})
		return
	}

	engagement, err = store.FetchEngagement(id)
	// err = fmt.Errorf("the engagement is: %v ", engagement)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"msg":  "The Engagement fetched successfully.",
		"data": engagement,
	})
}

func indexSubscribedUsers(ctx *gin.Context) {
	// engagement := ctx.MustGet(gin.BindKey).(*store.Engagement)
	user := new([]store.Subscriptions)
	// user := new(store.Subscriptions)
	paramID := ctx.Param("id")
	id, err := strconv.Atoi(paramID)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Not valid ID."})
		return
	}

	user, err = store.FetchSubscribedUsers(id)
	// err = fmt.Errorf("the engagement is: %v ", engagement)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"msg":  "The subscribed users fetched successfully.",
		"data": user,
	})
}

func updateEngagement(ctx *gin.Context) {
	jsonEngagement := ctx.MustGet(gin.BindKey).(*store.Engagement)
	user, err := currentUser(ctx)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": InternalServerError})
		return
	}
	dbEngagement, err := store.FetchEngagement(jsonEngagement.ID)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if user.ID != dbEngagement.UserID {
		ctx.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Not authorized."})
		return
	}
	jsonEngagement.ModifiedAt = time.Now()
	if err := store.UpdateEngagement(jsonEngagement); err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": InternalServerError})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{
		"msg":  "Engagement updated successfully.",
		"data": jsonEngagement,
	})
}

func deleteEngagement(ctx *gin.Context) {
	paramID := ctx.Param("id")
	id, err := strconv.Atoi(paramID)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Not valid ID."})
		return
	}
	user, err := currentUser(ctx)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": InternalServerError})
		return
	}
	engagement, err := store.FetchEngagement(id)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if user.ID != engagement.UserID {
		ctx.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Not authorized."})
		return
	}
	if err := store.DeleteEngagement(engagement); err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"msg": "Engagement deleted successfully."})
}

func deleteSubscribedUsers(ctx *gin.Context) {
	paramID := ctx.Param("id")
	id, err := strconv.Atoi(paramID)
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "Not valid ID."})
		return
	}
	if err := store.DeleteSubscribedUsers(id); err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"msg": "Subscribed users deleted successfully."})
}
