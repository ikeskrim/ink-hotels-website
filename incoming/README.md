# incoming

The drop folder. Put photographs here — any name, any size, `.jpg`, `.png`,
`.webp`, `.tif` or `.avif` — and run:

```
npm run photos
```

Each file becomes a right-sized `.webp` in `public/media`, named after itself
rather than after a hash, and the original moves to `incoming/_processed` so
you can see what has already been through. Nothing here is committed except
this file: the originals are large, and the version that matters is the one in
`public/media`.

The command then builds the blur placeholders, records the real Open Graph
dimensions, checks that every reference resolves and every image quality is one
the config allows, and rewrites the media manifest. It finishes by telling you
what is still owed — which frames have no alt text, and which are on disk with
nothing referencing them yet.

Neither of those is an error on the day the photographs arrive. One thing is:
a photograph that is live on the site with no alt text. That fails the command,
because a published photograph says something.

`npm run photos:check` prints the same report without ingesting anything.
