# Webflow Enhanced Video Lazy Loading

A drop-in JavaScript solution for advanced video lazy loading in Webflow, incorporating Google Developers' best practices for performance and UX. Supports HTML5 `<video>`, YouTube/Vimeo `<iframe>`, and custom Vimeo player patterns.

## Features

- **Intersection Observer** for automatic lazy loading of videos and iframes
- **Google best practices**: Handles `data-src` on `<video>` and `<source>`, hover-to-preload, and poster preloading for LCP
- **Vimeo click-to-load**: Defers loading until user clicks play
- **Preloads above-the-fold poster images** for better LCP
- **Works with existing Webflow video setups** (minimal markup changes required)
- **Console logging** for debugging and transparency

## How It Works

- Videos and iframes are only loaded when they are about to enter the viewport.
- For HTML5 videos, `src` and `<source>` are moved to `data-src` and restored on load.
- For Vimeo, the iframe is only loaded when the play button is clicked.
- Poster images for the first videos above the fold are preloaded for faster LCP.

## Usage

1. **Add the Script**

   - **Recommended:** Use the jsDelivr CDN for easy integration:
     ```html
     <script src="https://cdn.jsdelivr.net/gh/CarterOgunsola/webflow-lazyload@main/v1.0.0.js"></script>
     ```
   - Or, copy `index.js` into your Webflow project as a custom code embed, or include it via your site's custom code settings.

2. **Markup Requirements**

   - For HTML5 videos, use:
     ```html
     <video
       class="lazy"
       data-src="video.mp4"
       poster="poster.jpg"
       preload="none"
       controls
     >
       <source data-src="video.mp4" type="video/mp4" />
     </video>
     ```
   - For iframes (YouTube/Vimeo), use:
     ```html
     <iframe
       class="lazy"
       data-src="https://www.youtube.com/embed/..."
       width="560"
       height="315"
     ></iframe>
     ```
   - For custom Vimeo players, wrap as:
     ```html
     <div class="vimeo-player">
       <iframe
         class="vimeo-player__iframe"
         src="https://player.vimeo.com/video/..."
         width="640"
         height="360"
       ></iframe>
       <button data-vimeo-control="play">Play</button>
     </div>
     ```

3. **That's it!**
   - The script will automatically handle lazy loading, poster preloading, and click-to-load for Vimeo.

## Customization

- **Change the root margin** for earlier/later loading by editing the `MARGIN` constant in the script.
- **Add or remove classes** as needed for your Webflow setup.
- **Enable debug logging** by setting the `DEBUG` constant to `true` at the top of the script. When enabled, the script will log key actions to the browser console for debugging. By default, logging is disabled.

  Example:

  ```js
  const CONFIG = {
    // ...
    DEBUG: false, // Set to true to enable verbose logging
  };
  ```

## Console Output

If debug logging is enabled (see above), the script logs key actions (e.g., when videos are lazy loaded) to the browser console for debugging.

## Credits

- Based on Google Developers' [video lazy loading best practices](https://web.dev/lazy-loading-video/)
- Enhanced for Webflow and custom Vimeo player support

## License

MIT
