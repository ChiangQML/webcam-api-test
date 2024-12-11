import './App.css';
import { useState, useRef, useEffect } from "react";

function App() {
    const [isOpen, setIsOpen] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [videoBlob, setVideoBlob] = useState(null);
    const [photos, setPhotos] = useState([]); // State for fetched photos
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const chunks = useRef([]);

    const takePhoto = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(blob => {
                const formData = new FormData();
                formData.append('photo', blob, 'photo.png');

                fetch('http://localhost:3399/api/upload-photo', {
                    method: 'POST',
                    body: formData,
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error("Failed to upload photo");
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log(data);
                        setPhotos([]); // Clear current photos to avoid stale data

                        // Add a slight delay before fetching the latest list
                        setTimeout(fetchPhotos, 500);
                    })
                    .catch(error => console.error('Error uploading photo:', error));
            }, 'image/png');
        }
    };

    const startWebcam = () => {
        if (!streamRef.current) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: false })
                .then(stream => {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                    streamRef.current = stream;
                })
                .catch(err => console.error("Error accessing webcam:", err));
        }
    };

    const stopWebcam = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
            videoRef.current.srcObject = null;
        }
    };

    const webcamSwitchOnOff = () => {
        if (isOpen) stopWebcam();
        else startWebcam();
        setIsOpen(prev => !prev);
    };

    const startRecording = () => {
        if (streamRef.current && !isRecording) {
            const mediaRecorder = new MediaRecorder(streamRef.current);
            mediaRecorder.ondataavailable = (e) => chunks.current.push(e.data);
            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks.current, { type: 'video/mp4' });
                setVideoBlob(blob);
                chunks.current = [];
            };
            mediaRecorder.start();
            mediaRecorderRef.current = mediaRecorder;
            setIsRecording(true);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const recordingSwitchOnOff = () => {
        if (isRecording) stopRecording();
        else startRecording();
    };

    const uploadVideo = () => {
        if (videoBlob) {
            const formData = new FormData();
            formData.append('video', videoBlob, 'video.mp4');

            fetch('http://localhost:3399/api/upload-video', {
                method: 'POST',
                body: formData,
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Failed to upload video");
                    }
                    return response.json();
                })
                .then(data => console.log(data))
                .catch(error => console.error('Error uploading video:', error));
        }
    };

    useEffect(() => {
        return () => stopWebcam();
    }, []);

    return (
        <div className="App">
            <button className={`webcam-btn ${isOpen ? 'active' : ''}`} onClick={webcamSwitchOnOff}>
                {isOpen ? 'Turn Off Webcam' : 'Turn On Webcam'}
            </button>
            <video ref={videoRef} style={{ width: '640px', height: '360px' }}></video>
            <button onClick={recordingSwitchOnOff}>{isRecording ? 'Stop Recording' : 'Start Recording'}</button>
            <button onClick={uploadVideo} disabled={!videoBlob}>Upload Video</button>
            <button onClick={takePhoto}>Take Photo</button>
        </div>
    );
}

export default App;
