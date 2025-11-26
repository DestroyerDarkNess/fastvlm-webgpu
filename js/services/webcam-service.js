/**
 * Webcam service for managing camera stream
 */

let currentStream = null;

export async function requestWebcamPermission() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: 'user'
            },
            audio: false
        });

        currentStream = stream;
        return stream;
    } catch (error) {
        console.error('Error requesting webcam permission:', error);
        throw new Error(
            error.name === 'NotAllowedError'
                ? 'Camera access denied. Please grant permission to use your camera.'
                : error.name === 'NotFoundError'
                    ? 'No camera found. Please connect a camera and try again.'
                    : 'Failed to access camera: ' + error.message
        );
    }
}

export function getStream() {
    return currentStream;
}

export function stopStream() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
        currentStream = null;
    }
}
