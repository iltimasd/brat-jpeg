<script lang="ts">
  import { drawText } from "canvas-txt";
  let zoraPromise: null | Promise<void>;
  let zoraSignOff = `
  
  generated by https://brat-jpeg.vercel.app/`;
  let text = `brat and it’s completely different but also still brat`;
  let url: string;
  let imageDataUrl: string;
  let quality = 0.1;
  let scale = 58;
  let blur = 0.01;
  let align = "left";
  let flip = "true";
  const colors = [
    { bg: "white", text: "black", name: "baitsbttmssin" },
    { bg: "#8ACF00", text: "black", name: "brat" },
    { bg: "#039AD9", text: "red", name: "crash" },
    { bg: "white", text: "#C5C5C5", name: "how im feeling now" },
    { bg: "#908A84", text: "black", name: "charli" },
    { bg: "#C9A1DD", text: "black", name: "pop 2" },
    { bg: "#D30002", text: "red", name: "number 1 angel" },
    { bg: "black", text: "#333333", name: "vroom vroom" },
    { bg: "#F5ABCC", text: "white", name: "sucker" },
    { bg: "#700150", text: "white", name: "true romance" },
  ];

  let selectedColor = colors[1];

  const offscreenCanvas = document.createElement("canvas");
  const ctx = offscreenCanvas.getContext("2d", { willReadFrequently: true });

  let hiddenInput: HTMLTextAreaElement | null = null;
  let isFontLoaded = false;

  function resizeCanvas(
    originalCanvas: CanvasImageSource,
    width: number,
    height: number
  ) {
    const resizedCanvas = document.createElement("canvas");
    resizedCanvas.width = width;
    resizedCanvas.height = height;
    const resizedCtx = resizedCanvas.getContext("2d");
    if (!resizedCtx) return "";
    resizedCtx.drawImage(originalCanvas, 0, 0, width, height);
    return resizedCanvas.toDataURL("image/jpeg", quality);
  }

  function render() {
    console.log("rerender");
    const lines = text.split("\n");
    const lineHeight = 72;
    offscreenCanvas.width = 6 * scale;
    offscreenCanvas.height = 6 * scale + (lines.length - 1) * lineHeight;
    if (!ctx) return;
    ctx.save();
    if (flip) {
      ctx.translate(offscreenCanvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.fillStyle = selectedColor.bg;
    ctx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    ctx.filter = `blur(${(1 - blur) * 2}px)`;
    ctx.fillStyle = selectedColor.text;
    // ctx.textAlign = "center";
    // ctx.textBaseline = "middle";

    // ctx.translate(
    //   offscreenCanvas.width / 2,
    //   offscreenCanvas.height / 2 - ((lines.length - 1) * lineHeight) / 2
    // );

    // Use Canvas-Txt to draw justified text
    let margin = 0.2;
    ctx.fontStretch = "ultra-condensed"; // This line uses fontStretch property

    drawText(ctx, text, {
      justify: align === "justify",
      x: 0 + (margin * scale) / 2,
      y: 0 + (margin * scale) / 2,
      width: offscreenCanvas.width - margin * scale,
      height: offscreenCanvas.height - margin * scale,
      fontSize: 72,
      font: "Arial Narrow",
      align: align !== "left" ? "center" : "left",
      vAlign: "middle",
      // debug: true
    });
    ctx.restore();
    // Generate the image data URL from the resized canvas
    imageDataUrl = resizeCanvas(offscreenCanvas, 600, 600);

    loadImageAndSampleColor(imageDataUrl);
  }

  // Create a canvas to draw the image and sample its color
  const canvas = document.createElement("canvas");
  const imageCtx = canvas.getContext("2d", { willReadFrequently: true });

  function loadImageAndSampleColor(dataUrl: string) {
    const img = new Image();
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      if (!imageCtx) return;
      imageCtx.drawImage(img, 0, 0);
      document.body.style.backgroundColor = getBackgroundColor(imageCtx);
    };
    img.src = dataUrl;
  }

  function rgbToHex(r: number, g: number, b: number) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  function getBackgroundColor(ctx: CanvasRenderingContext2D) {
    let pixelData = ctx.getImageData(0, 0, 1, 1).data;
    return rgbToHex(pixelData[0], pixelData[1], pixelData[2]);
  }

  document.fonts.load('72pt "Arial Narrow"').then(() => {
    console.log(
      "hello fellow dev. code is here: https://github.com/iltimasd/brat-jpeg"
    );
    render(); // Call render after the font is available
  });

  function focusEnd(node: HTMLTextAreaElement) {
    node.addEventListener("click", () => {
      node.selectionStart = node.selectionEnd = node.value.length;
      node.scrollTop = node.scrollHeight; // Ensure the textarea scrolls to the bottom
    });
  }

  document.fonts.onloadingdone = () => {
    console.log("Font loading complete");
    quality = 0.1; //bypass mem cache
    render();
  };

  $: render(), text, quality, scale, blur, isFontLoaded, selectedColor, align, flip;
  $: hiddenInput?.blur(), quality, scale, align;
</script>

<aside>
  <textarea
    bind:value={text}
    on:click={() => {
      if (!hiddenInput) return;
      hiddenInput.focus();
      hiddenInput.scrollIntoView({ behavior: "smooth" }); // Ensure smooth scrolling to the second textarea
    }}
  /><br />
  <span>RELEASE</span>
  {#each colors as color, index}
    <label style="display: inline-block;">
      <input
        type="radio"
        name="color"
        value={color}
        bind:group={selectedColor}
      />
      <span
        style="background-color: {color.bg}; color: {color.text}; padding: 0 5px;"
        >{color.name}</span
      >
    </label>
  {/each}
  <br />
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <label for="quality">
    <span>BRATINESS</span>
    <input
      name="quality"
      type="range"
      bind:value={quality}
      min="0.01"
      max="1"
      step=".001"
    />
    {~~((1 - quality) * 1000)}
  </label>
  <label for="blur">
    <span>TIREDNESS</span>
    <input
      name="blur"
      type="range"
      bind:value={blur}
      min="0"
      max="1"
      step=".001"
    />
    {~~((1 - blur) * 100)}
  </label>
  <label for="scale">
    <span>SCALE</span>
    <input
      name="scale"
      type="range"
      bind:value={scale}
      min="1"
      max="300"
      step="1"
    />
    {scale}
  </label>
  <label for="center">
    <span>ALIGN</span>
    <input name="scale" type="radio" value="center" bind:group={align} />
    <input name="scale" type="radio" value="justify" bind:group={align} />
    <input name="scale" type="radio" value="left" bind:group={align} />
    {align === "center"
      ? "its the same"
      : align === "justify"
        ? "so its not"
        : "completely different"}
  </label>

  <label for="flip">
    <span>WORK IT OUT</span>
    <input name="flip" type="checkbox" bind:checked={flip} />
  
  </label>

  <a href={imageDataUrl} download="{text}_brat.jpg" class="download-button">
    download
  </a>
  or right click/hold and save image
  <br />
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-missing-attribute -->
  <a
    on:click={async () => {
      try {
        const response = await fetch("/api/ipfs", {
          body: imageDataUrl,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        url = await response.text(); // Assuming the response is in JSON format
        const delay = (ms) => new Promise((res) => setTimeout(res, ms));
        zoraPromise = delay(10000);
        await zoraPromise;
        // Opens the URL in a new tab
      } catch (error) {
        console.error("Error:", error);
      }
    }}
    style="cursor:pointer"
  >
    {#if zoraPromise}
      {#await zoraPromise}
        <span class="loading">loading</span>
      {:then _}
        <a
          target="_blank"
          href="https://zora.co/create?name={encodeURIComponent(
            text.replace(/\n/g, ' ')
          )}&description={encodeURIComponent(
            text + zoraSignOff
          )}&image=ipfs://{url}&referrer=0xBb11D9b4E27c5Be11a9b02C492E6810Aa66954B6"
          >CLICK HERE TO FINISH</a
        >
      {/await}
    {:else}
      or post to <span><img src="./Zorb.png" /></span>
      zora <sub>takes about 30s to load</sub>
    {/if}
  </a>
</aside>
{#if imageDataUrl}
  <div style="position: relative; z-index: 1">
    <textarea
      use:focusEnd
      bind:this={hiddenInput}
      bind:value={text}
      id="hiddenInput"
    />
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <img
      id="target"
      src={imageDataUrl}
      alt="Rendered Canvas"
      on:click={() => {
        if (!hiddenInput) return;
        hiddenInput.focus();
        hiddenInput.scrollIntoView({ behavior: "smooth" }); // Ensure smooth scrolling to the second textarea
      }}
    />
  </div>
{/if}
<div
  style="position: absolute; top: 10px; right: 10px; font-size: 12px; color: rgba(255,255,255, 1); text-decoration:underline; text-align: right; mix-blend-mode:exclusion"
>
  <a
    href="https://twitter.com/iltimasdoha"
    target="_blank"
    style="color: rgba(255,255,255, 1);"
  >
    cooked by @iltimasdoha
  </a>
</div>

<style>
  :global(*) {
    font-family: "Arial Narrow" !important;
    font-size: 12px;
  }
  #target {
    width: 600px;
    height: 600px;
    z-index: 10;
  }
  #hiddenInput {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: transparent;
    color: #000000;
    opacity: 0.0001;
    outline: none !important;
    border: none;
    z-index: -5;
  }
  input[type="range"] {
    direction: rtl;
    margin-bottom: 0 !important;
  }
  .loading::after {
    display: inline-block;
    animation: dotty steps(1, end) 1s infinite;
    content: "";
  }

  @keyframes dotty {
    0% {
      content: "";
    }
    25% {
      content: ".";
    }
    50% {
      content: "..";
    }
    75% {
      content: "...";
    }
    100% {
      content: "";
    }
  }
</style>
