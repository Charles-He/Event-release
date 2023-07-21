package store

import (
	"time"

	"github.com/go-pg/pg/v10/orm"
	"github.com/rs/zerolog/log"
)

type Engagement struct {
	ID         int
	Title      string `binding:"required,min=3,max=50"`
	Time       string `binding:"required,min=5,max=100"`
	Site       string `binding:"required,min=5,max=100"`
	Address    string `binding:"required,min=5,max=100"`
	CreatedAt  time.Time
	ModifiedAt time.Time
	UserID     int `json:"-"`
}

type Subscriptions struct {
	ID           int
	EngagementId int
	FirstName    string `binding:"required,min=3,max=50"`
	LastName     string `binding:"required,min=3,max=50"`
	Mobile       string `binding:"required,min=3,max=20"`
	Email        string `binding:"required,min=3,max=50"`
	CreatedAt    time.Time
	ModifiedAt   time.Time
}

func AddEngagement(user *User, engagement *Engagement) error {
	engagement.UserID = user.ID
	_, err := db.Model(engagement).Returning("*").Insert()
	if err != nil {
		log.Error().Err(err).Msg("Error creating new engagement")
	}
	return dbError(err)
}

func AddSubscription(engagementID int, subscriptions *Subscriptions) error {
	subscriptions.EngagementId = engagementID
	_, err := db.Model(subscriptions).Returning("*").Insert()
	if err != nil {
		log.Error().Err(err).Msg("Error creating new subscription")
	}
	return dbError(err)
}

func FetchUserEngagements(user *User) error {
	err := db.Model(user).
		WherePK().
		Relation("Engagements", func(q *orm.Query) (*orm.Query, error) {
			return q.Order("id ASC"), nil
		}).
		Select()
	if err != nil {
		log.Error().Err(err).Msg("Error fetching user's engagements")
	}
	return dbError(err)
}

func FetchSubscribedUsers(id int) (*[]Subscriptions, error) {
	// var subscriptions []Subscriptions
	subscriptions := new([]Subscriptions)
	err := db.Model(subscriptions).
		Where("Engagement_Id = ?", id).
		/*Relation("Subscriptions", func(q *orm.Query) (*orm.Query, error) {
			return q.Order("id ASC"), nil
		}).*/
		Select()
	if err != nil {
		log.Error().Err(err).Msg("Error fetching subscribed users")
	}

	return subscriptions, nil
}

func FetchEngagement(id int) (*Engagement, error) {
	engagement := new(Engagement)
	engagement.ID = id
	err := db.Model(engagement).WherePK().Select()

	if err != nil {
		log.Error().Err(err).Msg("Error fetching engagement")
		return nil, dbError(err)
	}
	return engagement, nil
}

func FetchTheEngagement(id int) (*Engagement, error) {
	engagement := new(Engagement)
	engagement.ID = id
	err := db.Model(engagement).WherePK().Select()

	if err != nil {
		log.Error().Err(err).Msg("Error fetching engagement")
		return nil, dbError(err)
	}
	return engagement, nil
}

func UpdateEngagement(engagement *Engagement) error {
	_, err := db.Model(engagement).WherePK().UpdateNotZero()
	// _, err := db.Model(engagement).WherePK().Update()
	if err != nil {
		log.Error().Err(err).Msg("Error updating engagement")
	}
	return dbError(err)
}

func DeleteEngagement(engagement *Engagement) error {
	_, err := db.Model(engagement).WherePK().Delete()
	if err != nil {
		log.Error().Err(err).Msg("Error deleting engagement")
	}
	return dbError(err)
}

func DeleteSubscribedUsers(id int) error {
	subscriptions := new(Subscriptions)
	// subscriptions.EngagementId = id

	_, err := db.Model(subscriptions).
		Where("Engagement_Id = ?", id).
		Delete()
	if err != nil {
		log.Error().Err(err).Msg("Error deleting subscribed users")
	}
	return dbError(err)
}
