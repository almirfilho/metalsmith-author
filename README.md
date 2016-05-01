# metalsmith-author

> A [metalsmith][metal] plugin to input authors information in collection files.

Specially useful for documents (files) with different authors.
Requires [metalsmith-collections][collections] plugin to work.


## What it does

Let's say we have several posts from different authors. And let's say we need
information about specific authors in each post, i.e. full name, url, twitter,
etc (You can define these infos the way you wish.). Instead of duplicating this
infos in every post file front matter, we can just define an `author` identifier
and metalsmith-author plugin will set the infos we need for a given author in a
post file.

###### post1.html

```yaml
---
title: Post 1
author: john
---
Post 1 contents...
```

###### post2.html

```yaml
---
title: Post 2
author: paul
---
Post 2 contents...
```

These files will be processed to be as:

```javascript
{
  'post1.html': {
    title: 'Post 1',
    author: {
      name: 'John Lennon',
      url: 'http://somesite.com',
      twitter: '@johnlennon'
    }
    // ...
  },
  'post2.html': {
    title: 'Post 2',
    author: {
      name: 'Paul McCartney',
      url: 'http://somesite.com',
      twitter: '@paulmccartney'
    }
    // ...
  }
}
```

So you can just use `author.name` (or whatever you want) to render the author's
name in templates.


## Installation

Install it via NPM:

```bash
$ npm install metalsmith-author
```


## Usage

```javascript
const metalsmith = require('metalsmith');
const collections = require('metalsmith-collections');
const author = require('metalsmith-author');

metalsmith('working/dir')
  .use(collections({posts: '*.html'}))
  .use(author({ // make sure it comes after collections
    collection: 'posts',
    authors: {
      john: {
        name: 'John Lennon',
        url: 'http://somesite.com',
        twitter: '@johnlennon'
      },
      paul: {
        name: 'Paul McCartney',
        url: 'http://somesite.com',
        twitter: '@paulmccartney'
      }
    }
  }))
```

Remember to the set the `author` identifier property in collection files with
one of these you passed to the plugin.


## Options

- `collection` __string__ _required_: Name of the configured
  metalsmith-collection to process files from.
- `authors` __object__ _optional_: Object containing all authors' information.
  It can contain whatever you want. Despite it isn't a required option, you must
  provide it in order to input new info in processed files.


## Contributing

Fork this repo, install the dependecies, run the tests, submit a pull request.

```bash
$ cd metalsmith-author
$ npm install
$ grunt test
```

### No grunt? No problem

You can run any grunt task just with npm scripts: `npm run grunt -- <taskname>`.
The following command is the same as `grunt test`:

```bash
$ npm run grunt -- test
```

### Automated workflow

You can keep the tests running automaticaly every time you make any change to
the code with `dev` workflow:

```bash
$ grunt dev
$ npm run grunt -- dev
```

Always implement tests for whatever you're adding to the project. Thanks!


## License

[MIT][license] © Almir Filho


[metal]: http://www.metalsmith.io/
[collections]: https://github.com/segmentio/metalsmith-collections
[license]: https://github.com/almirfilho/metalsmith-feed-atom/blob/master/LICENSE.md
