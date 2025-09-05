import React from 'react'
import assets from '../assets/assets'

export default function RightSidebar({selectedUser}) {
  return selectedUser && (
    <div>
      <div>
        <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" />
      </div>
    </div>
  )
}
