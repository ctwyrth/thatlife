import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { AiOutlineLogout } from 'react-icons/ai';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

import { googleLogout } from '@react-oauth/google';

import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../utils/data';
import { client } from '../client';

const UserProfile = () => {
   return (
      <div>UserProfile</div>
   )
}

export default UserProfile;