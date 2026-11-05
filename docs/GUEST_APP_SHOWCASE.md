# Guest application showcase

The main public page (`server/public.html`) and React landing page now include a guest app showcase immediately after the hero, with Stay, Explore and My plans screens.

Captures are from the actual JALDO-Travel-Guest branded review build (guest commit 1e9329b6cb3d9012df6181225d15c53c0aa47c98). All visible data is fictional. They are screenshots of a synthetic UX prototype, not evidence of live hotel/Core integration. Cropping only isolates the app panel; screen content is not reconstructed.

The standalone Sites preview is owner-private. The public CTA therefore opens the invitation explanation and a mailto walkthrough request. It intentionally does not link anonymous visitors to the private app. No message is sent automatically. Replace the entry only after verifying an approved shareable guest preview URL and audience. Main-site access and Partner Room gates remain unchanged.

The served public page's hotel-response CTA opens `/public-demo#sample-demo`; the React landing retains its existing governed working-proof entry. Three synthetic screen assets are explicitly classified in source checks, bundle checks and the server public-file list. All other files remain closed by default.

Validation: TypeScript type-check, Vite production build, access-boundary check, local-asset check, production bundle-boundary check and nine server-access tests passed. Desktop browser review confirmed the showcase and navigation anchor. Narrow-viewport visual QA is still unverified; responsive styles stack the three screen cards below 760px. No merge or deployment is included.
