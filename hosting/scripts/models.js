import { constRestaurant } from './const.js'

export class Restaurant {
  static getRestaurantLimit() {
    return firebase
      .firestore()
      .collection('restaurants')
      .limit(1)
  }
  static getRestaurant(id) {
    return firebase
      .firestore()
      .collection('restaurants')
      .doc(id)
      .get()
  }
  static getRestaurants(filters) {
    let query = firebase
      .firestore()
      .collection('restaurants')
      .limit(50)
    if (filters.category && filters.category != '') {
      query = query.where('category', '==', filters.category)
    }
    if (filters.city && filters.city != '') {
      query = query.where('city', '==', filters.city)
    }
    if (filters.price && filters.price != '') {
      query = query.where('price', '==', filters.price)
    }
    if (filters.sort === 'rating') {
      query = query.orderBy('avgRating', 'desc')
    } else if (filters.sort === 'review') {
      query = query.orderBy('numRatings', 'desc')
    }
    return query
  }
  static getRatings(restaurant) {
    console.log(restaurant)
    return restaurant.ref
      .collection('ratings')
      .orderBy('timestamp', 'desc')
      .get()
  }

  static getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
  }

  static addRestaurant(data) {
    const collection = firebase.firestore().collection('restaurants')
    return collection.add(data)
  }
  static addRestaurant(data) {
    const collection = firebase.firestore().collection('restaurants')
    return collection.add(data)
  }
  static addRating(id, rating) {
    rating.timestamp = new Date()
    rating.userId = firebase.auth().currentUser.uid

    var collection = firebase.firestore().collection('restaurants')
    var document = collection.doc(id)
    var newRatingDocument = document.collection('ratings').doc()

    return firebase.firestore().runTransaction(function(transaction) {
      return transaction.get(document).then(function(doc) {
        var data = doc.data()

        var newAverage =
          (data.numRatings * data.avgRating + rating.rating) /
          (data.numRatings + 1)

        transaction.update(document, {
          numRatings: data.numRatings + 1,
          avgRating: newAverage
        })
        return transaction.set(newRatingDocument, rating)
      })
    })
  }

  static createMockData() {
    let promises = []
    for (var i = 0; i < 20; i++) {
      const name =
        this.getRandomItem(constRestaurant.firstWords) +
        this.getRandomItem(constRestaurant.secondWords)
      const category = this.getRandomItem(constRestaurant.categories)
      const city = this.getRandomItem(constRestaurant.cities)
      const price = Math.floor(Math.random() * 4) + 1
      const photoID = Math.floor(Math.random() * 22) + 1
      const photo =
        'https://storage.googleapis.com/firestorequickstarts.appspot.com/food_' +
        photoID +
        '.png'
      const numRatings = 0
      const avgRating = 0
      const promise = this.addRestaurant({
        name: name,
        category: category,
        price: price,
        city: city,
        numRatings: numRatings,
        avgRating: avgRating,
        photo: photo
      })
      if (!promise) {
        alert('addRestaurant() is not implemented yet!')
        return Promise.reject()
      } else {
        promises.push(promise)
      }
    }
    return Promise.all(promises)
  }
}
