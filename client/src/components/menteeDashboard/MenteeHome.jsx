import React, { useEffect, useState } from 'react';
import Taskbox from './Taskbox';
import SubBox from './SubBox';
import { Link } from 'react-router-dom';

export default function MenteeHome() {
  return (
    <>
<section className="home-section">
<div><h2 className='mt-3 text-md taskhead font-bold'><i className="fa fa-clock-o" aria-hidden="true"></i> Recent Tasks</h2></div>
<Taskbox type="top"/>
<br />
<div><h2 className='mt-3 text-md taskhead font-bold '><i className="fa fa-clock-o" aria-hidden="true"></i> Recent Subscriptions</h2></div>
<SubBox type="top"/>
</section>

</>
  )
}
