'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebase/config';
import Header from './components/Header';
import Filters from './components/Filters';
import PropertyCard from './components/PropertyCard';
import Hero from './components/Hero';

export default function Home() {
  

  return (
<Hero />
  );
}
