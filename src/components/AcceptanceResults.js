import React from 'react'
import { Link } from 'react-router-dom'

function AcceptanceResults (props) {

  return (
    <div className='result'>
        <br />
        <Link to='/acceptance'>
        <button>Stay in Acceptance</button>
      </Link><br />
      <Link to={`/profile/${props.currentUserId}`}>
      <button>Go to Your Profile</button>
      </Link><br />
    </div>
  )
}

export default AcceptanceResults
