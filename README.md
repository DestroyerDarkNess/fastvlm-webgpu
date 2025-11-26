# FastVLM WebGPU - Vanilla JavaScript Version

Real-time video captioning powered by FastVLM-0.5B AI model, built with vanilla JavaScript (no frameworks!).

<img src="image.png" alt="meme 1" width="100" height="100"> <img src="image-1.png" alt="meme 2" width="100" height="100">

## Quick Start

### Prerequisites
- WebGPU-enabled browser
- Camera/webcam

### Run Locally

1. **Start a local server:**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Or Node.js
   npx http-server -p 8000
   ```

2. **Open in browser:**
   ```
   http://localhost:8000
   ```

3. **Grant camera permission** when prompted

4. **Click "Start Live Captioning"** to load the AI model

5. **Wait for model to load** (~1-2 minutes first time, cached after)

6. **Start captioning!** The AI will describe what it sees in real-time

## Features

- **Real-time video captioning** using AI
- **Runs entirely in browser** - no server needed, works offline
- **WebGPU acceleration** for fast inference
- **Modern glass morphism UI**
- **Draggable interface elements**
- **Custom prompts** - ask the AI anything about the video
- **Zero dependencies** - pure vanilla JavaScript

## How to Use

### Customize Prompts
Use the prompt input (bottom-left) to ask specific questions:
- "What is the color of my shirt?"
- "Identify any text or written content visible."
- "What emotions or actions are being portrayed?"

Or click suggestion chips for quick prompts.

### Controls
- **Play/Pause button** (top-left) - Start/stop captioning
- **Drag containers** - Move prompt input and caption display anywhere
- **Suggestion chips** - Quick prompt selection

## Project Structure

```
fastvlm-webgpu/
├── index.html              # Entry point
├── favicon.ico             # Favicon
├── styles/
│   ├── main.css           # Base styles
│   └── components.css     # Component styles
└── js/
    ├── main.js            # App entry
    ├── utils/             # Helpers
    ├── services/          # Webcam & AI
    └── components/        # UI components
```

## Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome 113+ | ✅ | Full support |
| Edge 113+ | ✅ | Full support |
| Firefox 141+ | ✅ | Full support |
| Safari 26 Beta | ⚠️ | WebGPU experimental |

## Dependencies

All loaded via CDN (no npm install needed!):
- **@huggingface/transformers** - AI model inference

## Technical Details

- **Model:** FastVLM-0.5B-ONNX (quantized for browser)
- **Framework:** Vanilla JavaScript (ES6 modules)
- **AI Library:** Transformers.js
- **Acceleration:** WebGPU
- **Architecture:** Event-driven component system

## Credits

- Built on [Hugging Face Transformers.js](https://huggingface.co/docs/transformers.js)
- Uses [FastVLM-0.5B-ONNX](https://huggingface.co/onnx-community/FastVLM-0.5B-ONNX) model
- Rewritten in vanilla JS from [React version](huggingface.co/spaces/apple/fastvlm-webgpu)
