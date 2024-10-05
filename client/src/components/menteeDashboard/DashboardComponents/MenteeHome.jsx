import React from 'react'
import Barside from '../../../common/Barside'
import Taskbox from './Taskbox'
import { SERVER_URL } from "../../../../constant";

export default function MenteeHome() {
  return (
    <>
<section className="home-section">
    <div><h1>Mentee Home</h1></div>
    <Taskbox/>
</section>
</>
  )
}
