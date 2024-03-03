<script>
  let text = "brat";
  let imageDataUrl;
  let quality = 0.75;
  let scale = 100;
  let blur = 0.5;
  let computedBg = "#8ACF00";

  const offscreenCanvas = document.createElement("canvas");
  const ctx = offscreenCanvas.getContext("2d");

  function render() {
    offscreenCanvas.width = 3 * scale;
    offscreenCanvas.height = 2.5 * scale;

    // Set the background and draw text as before
    ctx.fillStyle = computedBg; // Use the computed background color
    ctx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    ctx.filter = `blur(${blur}px)`;
    ctx.fillStyle = "black";
    ctx.font = "72px Arial Narrow";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, offscreenCanvas.width / 2, offscreenCanvas.height / 2);

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
  $: render(), text, quality, scale, blur;
</script>

<div style="font-family: Arial Narrow;">.</div>

<aside>
  <input bind:value={text} /><br />
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
      min="0.01"
      max="2"
      step=".001"
    />
    {~~(blur * 100)}</label
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
  <img id="target" src={imageDataUrl} alt="Rendered Canvas" />
{/if}

<style>
  :global(*) {
    font-family: "Arial Narrow" !important;
  }

  #target {
    width: 600px;
    height: 600px;
  }
</style>
