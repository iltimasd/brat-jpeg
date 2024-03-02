<script>
    let text = 'brat';
    let imageDataUrl;
    let quality = .75;
    let scale = 100;
    let computedBg = '#8ACF00';

    function render() {
        let offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = 3 * scale;
        offscreenCanvas.height = 2.5 * scale;

        const ctx = offscreenCanvas.getContext('2d');

        // Set the background and draw text as before
        ctx.fillStyle = computedBg; // Use the computed background color
        ctx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
        ctx.fillStyle = 'black';
        ctx.font = '72px Arial Narrow';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, offscreenCanvas.width / 2, offscreenCanvas.height / 2);

        // Generate the image data URL
        imageDataUrl = offscreenCanvas.toDataURL('image/jpeg', quality);

        // When the image data is ready, load it into an <img> and then sample its color
        loadImageAndSampleColor(imageDataUrl);
    }

    function loadImageAndSampleColor(dataUrl) {
        const img = new Image();
        img.onload = function() {
            // Create a canvas to draw the image and sample its color
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            document.body.style.backgroundColor = getBackgroundColor(ctx);
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

    $: render(), text, quality, scale;
</script>
<aside>
<input bind:value={text}/>
<span>BRATINESS</span><input type="range" bind:value={quality} min=0.01 max=1 step=.001/> {~~((1-quality)*1000)}
<span>SCALE</span><input type="range" bind:value={scale} min=0 max=300 step=1/> {scale}
<a href={imageDataUrl} download="{text}_brat.jpg" class="download-button">download</a>
</aside>
{#if imageDataUrl}
    <img id="target" src={imageDataUrl} alt="Rendered Canvas"/>
{/if}

<style>
    * {
        font-family: Arial Narrow;
    }

    #target {
        width: 600px;
        height: 600px;
    }

</style>
