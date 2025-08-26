import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// User action icons
import {
  faRightFromBracket, // logout
  faRightToBracket,   // login
  faUserPlus,         // register
  faUserGear,         // update account
  faImage,            // change avatar
  faCamera,           // alternate avatar icon
  faPaperPlane,       // send message
  faCheck,            // accept
  faXmark,            // decline
  faPlus,             // add new
  faTrash,            // delete
  faEdit,             // edit
  faConciergeBell,
  faCalendarPlus,     //Book service
  faHammer,           //logo
  // faHammer,           //logo
  faHeart as faHeartSolid,
  faEnvelope as faEnvelopeSolid,
} from '@fortawesome/free-solid-svg-icons'

import {
  faHeart as faHeartRegular,
  faEnvelope as faEnvelopeRegular,
  faBell
} from '@fortawesome/free-regular-svg-icons'

import { faFacebookF, faTwitter, faInstagram, faLinkedinIn, } from '@fortawesome/free-brands-svg-icons'



library.add(
  //@fortawesome/free-solid-svg-icons
  faRightFromBracket,
  faRightToBracket,
  faUserPlus,
  faUserGear,
  faImage,
  faCamera,
  faPaperPlane,
  faCheck,
  faXmark,
  faPlus,
  faTrash,
  faEdit,
  // faPen,
  faCalendarPlus,
  faHammer,
  faHeartSolid,
  faHeartRegular,
  faEnvelopeSolid,
  faEnvelopeRegular,
  faBell,
  faConciergeBell,

  //@fortawesome/free-brands-svg-icons
  faFacebookF,
  faTwitter,
  faInstagram,
  faLinkedinIn,
)

export { FontAwesomeIcon }
