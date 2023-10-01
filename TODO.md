# TODO List: Website Build Process

## Overview

This TODO list outlines the steps and considerations for improving our website build process. The goal is to optimize the build, ensuring efficiency and reducing unnecessary file duplication.

## Task 1: Customize `static.yml`

- Change the default `static.yml` to a custom one.
- Utilize our script to build the site, improving control over the process.

## Task 2: Optimize with Python

- Recommend using Python throughout the build process, especially since we frequently load Python scripts.
- The Python script should compile CSS and JS files and arrange them in the desired order.

## Task 3: Define Build Structure

- Define the desired structure for the end result of the build process:
  - `/public` should transform into `/dist`.
  - `/src/js` should result in `/dist/static/js`.
  - `/src/main.html` should become `/dist/main.html`.
  - `/src/main.html` and `/src/components/{main,card,terminal}.html` should combine into `/dist/index.html`.
  - `/src/css` should translate to `/dist/static/css`.

## Task 4: Bundle JS and CSS

- Consider bundling JS files that are not modules into one bundle during the build process.
- Organize CSS files into two bundles: one for regular content and another for handling 404 pages.

## Task 5: Configure Build

- Explore build configuration options to optimize the process.
- Pay special attention to dynamic configurations that can improve efficiency.

## Task 6: Update `build.config.toml`

- Update the `build.config.toml` file with the following sections:

### `merges` Table

- Define a table for merging files that require bundling.
- Specify configurations within the `merge` table, including options for deleting generated content and handling copies in the `dist` folder.

### `dist` Table

- Configure the structure of the `/dist` folder.
- Map the folders that need to be copied into `/dist`.
- Implement deletion of input files from `merges` if `merge.delete_matching` is set to true.

### `plugins` Table

- Define plugin build scripts.
- Include the `patch_compact` plugin to merge necessary components and `main.html` into one HTML file.
- Use the `plugins` table to specify keys for `output` and `watchfor`, allowing for efficient execution when watched files change.

### `build` Table

- Configure build settings.
- Include the `auto_build` option, which is set to true by default and cannot be overridden.

### `merge` Table

- Specify merging configurations, as explained in the `merges` section.

By following these tasks and enhancing the `build.config.toml` file, we can streamline our website build process and optimize its efficiency.
