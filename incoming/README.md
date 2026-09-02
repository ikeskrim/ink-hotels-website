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

## Wanted

**Pathos: the private hot tub in its courtyard.** Confirmed by the owner on
2 September 2026 and now stated on the site, in the amenity list, the badge and
the water section — with no photograph of it anywhere in the library. Pathos
still leads with the glass shower cabin, which is its signature and the right
lead, but the amenity grid on `/rooms/pathos` shows the hot tub as type on a
hairline frame because nothing depicts it.

One unpeopled frame of the tub in the courtyard closes it. Drop it here, run
`npm run photos`, and map it in `src/content/amenity-media.ts` — the rule there
is that somebody opens the frame and looks before writing what it shows.
