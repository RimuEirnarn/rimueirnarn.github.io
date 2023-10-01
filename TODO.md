# Enhanced TODO List Document

## Overview

This TODO list outlines tasks related to the customization and optimization of our website building process using Python and various configurations.

## Task 1: Customizing `static.yml`

- Change the default `static.yml` to a custom one.
- Utilize our script to build the site.

### Rationale
Using a custom `static.yml` file allows us to have more control over the website-building process, and using our script ensures flexibility and optimization.

## Task 2: Python Integration

- Utilize Python as extensively as possible.
- We load Python scripts multiple times, so it's recommended to maintain consistency.

### Rationale
Python integration enhances the development process and streamlines script execution.

## Task 3: File Structure Reorganization

- Rearrange the file structure as follows:

  - `/public` -> `/dist`
  - `/src/js` -> `/dist/static/js`
  - `/src/main.html` -> `/dist/main.html`
  - `/src/main.html + /src/components/{main,card,terminal}.html` -> `/dist/index.html`
  - `/src/css` -> `/dist/static/css`

### Rationale
This reorganization simplifies file management and improves the overall project structure.

## Task 4: JS and CSS Bundling

- Merge non-module JS files into one bundle during the build process.
- Create two bundles for CSS: one for regular pages and one for 404 pages.

### Rationale
Bundling reduces the number of HTTP requests and improves website performance.

## Task 5: Configuration via `build.config.toml`

- Configure the `build.config.toml` file with the following sections:

### `merges` Table

- Use the `merges` table for bundling files.
- Define configurations within the `merge` table, including "deleting generated contents" and "ignoring/deleting copies in dist."

### `dist` Table

- Configure the `dist` table to define the structure of the `/dist` folder.
- Delete input files specified in the `merges` table if `merge.delete_matching` is set to true.

### `plugins` Table

- Define plugin build scripts within the `plugins` table.
- Include `patch_compact` for merging necessary components and `main.html` into one HTML file.
- Specify `output` and `watchfor` keys for each plugin to trigger execution when specific files change.

### `build` Table

- Configure build settings.
- Include `auto_build` with a default value of true.

### `merge` Table

- Further define merging configurations as explained in the `merges` section.

### Rationale
Properly configuring the `build.config.toml` file ensures efficient website building and optimization.

## Conclusion

By completing these tasks, we will enhance our website building process, making it more efficient and organized.
