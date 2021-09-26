'use strict'

import { readable } from 'svelte/store'

export const temporaryData = readable([
  {
    name: 'Tim',
    avatar: '/man1.jpeg',
    userId: 'tim',
    links: [
      {
        id: 'com.twitter',
        value: 'https://twitter.com/@tim91272',
        description: 'Check out my tweets'
      }
    ]
  },

  {
    name: 'Alice',
    avatar: '/woman1.jpeg',
    userId: 'alice',
    links: [
      {
        id: 'com.twitter',
        value: 'https://twitter.com/@alease28721',
        description: 'Check out my tweets'
      }
    ]
  },

  {
    name: 'Bob',
    avatar: '/man2.jpeg',
    userId: 'bob',
    links: [
      {
        id: 'com.twitter',
        value: 'https://twitter.com/@buildingboblul',
        description: 'Check out my tweets'
      }
    ]
  },

  {
    name: 'Janet',
    avatar: '/woman2.jpeg',
    userId: 'janet',
    links: [
      {
        id: 'com.twitter',
        value: 'https://twitter.com/@ghostridethewhip2218',
        description: 'Check out my tweets'
      }
    ]
  }
])
