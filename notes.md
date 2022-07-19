animation idea
https://www.pinterest.com/pin/985231159324062/

design idea
https://www.behance.net/gallery/96799137/An-Instacart-like-Popular-Grocery-Delivery-App-UI

navigation animation
https://www.youtube.com/watch?v=83GNiMp-qq0&ab_channel=WilliamCandillon


```
const [useAuth] = create((set, get) => ({
      user: {username: undefined, authLevel: 0},
      computed: { //yes, just use a nested object, which can be easily used in Object.assign
         get isSignedIn: () => !!get().user.usernamecomponents?
      }
  })}

  //usage
  const isSignedIn = useState(s => s.computed.isSignedIn)
  ```
