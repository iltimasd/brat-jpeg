<script>
  let text = "brat";
  let imageDataUrl;
  let quality = 0.75;
  let scale = 100;
  let blur = 0.75;
  let computedBg = "#8ACF00";

  const offscreenCanvas = document.createElement("canvas");
  const ctx = offscreenCanvas.getContext("2d");

  let hiddenInput = null;
  let isFontLoaded = false;
  function render() {
    offscreenCanvas.width = 3 * scale;
    offscreenCanvas.height = 3 * scale;

    // Set the background and draw text as before
    ctx.fillStyle = computedBg; // Use the computed background color
    ctx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    ctx.filter = `blur(${(1 - blur) * 2}px)`;
    ctx.fillStyle = "black";
    ctx.font = "72px Arial Narrow";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.translate(offscreenCanvas.width / 2, offscreenCanvas.height / 2);
    // Scale 80% on x-axis, 100% on y-axis
    ctx.scale(0.8, 1);
    // Draw the text at the origin, which is now the center of the canvas
    ctx.fillText(text, 0, 0);

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
  document.fonts.load('72pt "Arial Narrow"').then(function () {
    console.log("hi");
    render(); // Call render after the font is available
  });
  function focusEnd(node) {
    node.addEventListener("click", () => {
      const value = node.value; // Store the current value
      node.value = ""; // Clear the value
      node.value = value; // Re-assign the value
    });
  }
  document.fonts.onloadingdone = () => {
    console.log("Font loading complete");
    quality = 0.9; //bypass mem cache
    render();
  };
  $: render(), text, quality, scale, blur, isFontLoaded;
  $: hiddenInput?.blur(), quality, scale;
</script>

<div style="font-family: Arial Narrow;">.</div>

<aside>
  <input
    bind:value={text}
    on:click={() => {
      hiddenInput.focus();
    }}
  /><br />
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <label for="quality"
    ><span>BRATINESS</span><input
      name="quality"
      type="range"
      bind:value={quality}
      min="0.01"
      max="1"
      step=".001"
    />
    {~~((1 - quality) * 1000)}</label
  >
  <label for="blur"
    ><span>TIREDNESS</span><input
      name="blur"
      type="range"
      bind:value={blur}
      min="0"
      max="1"
      step=".001"
    />
    {~~((1 - blur) * 100)}</label
  >
  <label for="scale"
    ><span>SCALE</span><input
      name="scale"
      type="range"
      bind:value={scale}
      min="0"
      max="300"
      step="1"
    />
    {scale}</label
  >
  <a href={imageDataUrl} download="{text}_brat.jpg" class="download-button"
    >download</a
  > or right click/hold and save image
</aside>
{#if imageDataUrl}
  <div style="position: relative;">
    <input
      autofocus
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
        // hiddenInput.focus();
      }}
    />
  </div>
{/if}

<style>
  :global(*) {
    font-family: "Arial Narrow" !important;
  }
  /* aside {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 10;
  } */
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
    /* visibility: hidden; */
    background: transparent;
    color: #000000;
    opacity: 0.0000001;
    outline: none !important;
    border: none;
    z-index: 5;
  }
  input[type="range"] {
    direction: rtl;
  }
</style>
