# README for the Svelte Canvas Text Renderer

## Introduction

This Svelte application allows users to dynamically generate and download images with custom text. The core functionality revolves around rendering text onto a canvas, which then gets converted into an image. Users can adjust the "BRATINESS" (image quality), the scale of the text, and observe the background color dynamically adapting to the generated image.

## Features

- **Custom Text Input**: Users can input any text they wish to render onto the canvas.
- **Adjustable Image Quality**: Through a slider labeled "BRATINESS", users can adjust the quality of the generated image, which affects the file size and clarity.
- **Scalable Text Size**: A "SCALE" slider allows users to adjust the size of the text rendered on the canvas.
- **Dynamic Background Color**: The application samples the generated image's dominant color and applies it as the background color of the page.
- **Image Download**: Users can download the generated image with their custom text as a JPEG file.

## How It Works

1. **Rendering the Image**:
    - A canvas element is created off-screen, where the text is rendered with the specified scale and quality.
    - The background color of the canvas (`computedBg`) is dynamically set, and the text is rendered in the center.
    - An image data URL is generated from this canvas, which is then used to load an image element on the page.

2. **Sampling Background Color**:
    - Once the image is loaded, its color is sampled to dynamically change the page's background color to match the generated image's dominant color.

3. **User Interactions**:
    - Users can interact with the application through inputs: changing the text, adjusting image quality, and scaling the text size.
    - Adjustments immediately trigger the re-rendering of the canvas and the subsequent processes.

## Development

This application is built with Svelte, a modern JavaScript compiler that enables reactive and efficient web applications.

### Requirements

- Node.js
- A package manager like npm or Yarn

### Getting Started

To get started with the development:

1. Clone the repository.
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5000`.

### Structure

- The main logic is encapsulated within a single Svelte component, which manages state, user inputs, and rendering logic.
- The application's styles are defined in a `<style>` tag within the same component, ensuring scoped and maintainable CSS.

## Contributing

Contributions are welcome! Whether it's submitting bug reports, feature requests, or contributing code, all forms of contributions help improve this project. Before contributing, please review the project's contributing guidelines.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

This README provides an overview and guide for developers interested in using, exploring, or contributing to the project. It assumes familiarity with Svelte and basic web development practices.