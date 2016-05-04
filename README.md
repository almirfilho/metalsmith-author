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


### Render a single file author

Now you can just use something like `{{ author.name }}` (or whatever you want)
to render the file (post) author's name in your post template.


### Render all authors

Complementarily, you can access all authors globally inside any template as
well through the `authors` variable, i.e. `{{ authors.john.name }}`.


## Options

#### `collection` __string__

_Required_. Name of the configured metalsmith-collection to process files from
(see the usage example above).


#### `authors` __object__

_Optional_. Object containing all authors' metadata. It can contain whatever you
want. Despite it isn't a required option, you must provide it in order to input
new info in processed files (see the usage example above).


#### `metadataFrom` __string__

_Optional_. Specify where the plugin can take the authors' metadata from. It
looks for data in metalsmith's global metadata scope. You can also pass a path,
like `'some.key'`.


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
