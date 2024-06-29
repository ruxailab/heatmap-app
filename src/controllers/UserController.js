import { db } from '@/firebase'
import User from '@/models/User'
import { doc, setDoc } from 'firebase/firestore'

const COLLECTION = 'users'

export default class UserController {
  async create(payload) {
    const user = new User({
      email: payload.email,
      accessLevel: 1,
      myTests: {},
      myAnswers: {},
      notifications: [],
    }).toFirestore()

    const ref = doc(db, `${COLLECTION}/${payload.id}`)
    return setDoc(ref, user)
  }
}
