<script lang="ts">
  let text = "brat";
  let imageDataUrl;
  let quality = 0.75;
  let scale = 100;
  let blur = 0.75;

  const colors = [
    { bg: "white", text: "black", name: "baitsbttmssin" },
    { bg: "#8ACF00", text: "black", name: "brat" },
    { bg: "#039AD9", text: "red", name: "crash" },
    { bg: "white", text: "#C5C5C5", name: "how im feeling now" },
    { bg: "#908A84", text: "black", name: "chali" },
    { bg: "#C9A1DD", text: "black", name: "pop 2" },
    { bg: "#D30002", text: "red", name: "number 1 angel" },
    { bg: "black", text: "#333333", name: "vroom vroom" },
    { bg: "#F5ABCC", text: "white", name: "sucker" },
    { bg: "#700150", text: "white", name: "true romance" },
  ];

  let selectedColor = colors[0];

  const offscreenCanvas = document.createElement("canvas");
  const ctx = offscreenCanvas.getContext("2d");

  let hiddenInput = null;
  let isFontLoaded = false;

  function render() {
    const lines = text.split("\n"); // Split the text by new lines
    const lineHeight = 72; // Adjust line height as needed
    offscreenCanvas.width = 3 * scale;
    offscreenCanvas.height = 3 * scale + (lines.length - 1) * lineHeight;

    // Set the background and draw text as before
    ctx.fillStyle = selectedColor.bg; // Use the selected background color
    ctx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    ctx.filter = `blur(${(1 - blur) * 2}px)`;
    ctx.fillStyle = selectedColor.text; // Use the selected text color
    ctx.font = "72px Arial Narrow";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.translate(
      offscreenCanvas.width / 2,
      offscreenCanvas.height / 2 - ((lines.length - 1) * lineHeight) / 2
    );

    lines.forEach((line, index) => {
      ctx.save();
      ctx.scale(0.8, 1);
      ctx.fillText(line, 0, index * lineHeight);
      ctx.restore();
    });

    // Generate the image data URL
    imageDataUrl = offscreenCanvas.toDataURL("image/jpeg", quality);

    // When the image data is ready, load it into an <img> and then sample its color
    loadImageAndSampleColor(imageDataUrl);
  }

  // Create a canvas to draw the image and sample its color
  const canvas = document.createElement("canvas");
  const imageCtx = canvas.getContext("2d");

  function loadImageAndSampleColor(dataUrl) {
    const img = new Image();
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      imageCtx.drawImage(img, 0, 0);
      document.body.style.backgroundColor = getBackgroundColor(imageCtx);
    };
    img.src = dataUrl;
  }

  function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  function getBackgroundColor(ctx) {
    let pixelData = ctx.getImageData(0, 0, 1, 1).data;
    return rgbToHex(pixelData[0], pixelData[1], pixelData[2]);
  }

  document.fonts.load('72pt "Arial Narrow"').then(() => {
    console.log("hi");
    render(); // Call render after the font is available
  });

  function focusEnd(node) {
    node.addEventListener("click", () => {
      node.selectionStart = node.selectionEnd = node.value.length;
      node.scrollTop = node.scrollHeight; // Ensure the textarea scrolls to the bottom
    });
  }

  document.fonts.onloadingdone = () => {
    console.log("Font loading complete");
    quality = 0.9; //bypass mem cache
    render();
  };

  $: render(), text, quality, scale, blur, isFontLoaded, selectedColor;
  $: hiddenInput?.blur(), quality, scale;
</script>

<aside>
  <textarea
    bind:value={text}
    on:click={() => {
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
      min="0"
      max="300"
      step="1"
    />
    {scale}
  </label>
  <a href={imageDataUrl} download="{text}_brat.jpg" class="download-button">
    download
  </a> or right click/hold and save image
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
    </a
  >
</div>

<style>
  :global(*) {
    font-family: "Arial Narrow" !important;
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
  }
</style>
