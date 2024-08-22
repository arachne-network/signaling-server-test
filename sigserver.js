const socket = io();
const config = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }] // Google STUN server
};
const peerConnections = {};
const localVideo = document.getElementById('localVideo');
const remoteVideos = document.getElementById('remoteVideos');

// Get local media stream
async function startLocalStream() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localVideo.srcObject = stream;
    return stream;
}

// Start streaming
const localStream = startLocalStream();

// Function to create and manage peer connection
async function createPeerConnection(peerId) {
    const pc = new RTCPeerConnection(config);

    pc.onicecandidate = (event) => {
        if (event.candidate) {
            socket.emit('ice-candidate', { targetId: peerId, candidate: event.candidate });
        }
    };

    pc.ontrack = (event) => {
        let videoElement = document.getElementById(`video-${peerId}`);
        if (!videoElement) {
            videoElement = document.createElement('video');
            videoElement.id = `video-${peerId}`;
            videoElement.autoplay = true;
            remoteVideos.appendChild(videoElement);
        }
        videoElement.srcObject = event.streams[0];
    };

    const stream = await localStream;
    stream.getTracks().forEach(track => pc.addTrack(track, stream));

    peerConnections[peerId] = pc;
    return pc;
}

// Measure and report bandwidth
async function measureBandwidth(pc) {
    const stats = await pc.getStats();
    let bytesReceived = 0;
    let bytesSent = 0;

    stats.forEach(report => {
        if (report.type === 'inbound-rtp' && report.kind === 'video') {
            bytesReceived += report.bytesReceived;
        } else if (report.type === 'outbound-rtp' && report.kind === 'video') {
            bytesSent += report.bytesSent;
        }
    });

    const bandwidth = (bytesReceived + bytesSent) / 1024; // in KB
    socket.emit('report-bandwidth', { bandwidth });
}

// Handle incoming updates on bandwidth from the server
socket.on('update-bandwidth', (clients) => {
    // Find the client with the highest bandwidth
    let bestPeer = null;
    let maxBandwidth = 0;

    Object.values(clients).forEach(client => {
        if (client.id !== socket.id && client.bandwidth > maxBandwidth) {
            maxBandwidth = client.bandwidth;
            bestPeer = client.id;
        }
    });

    if (bestPeer && !peerConnections[bestPeer]) {
        connectToPeer(bestPeer);
    }
});

// Function to connect to a peer
async function connectToPeer(peerId) {
    const pc = await createPeerConnection(peerId);

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit('offer', { targetId: peerId, offer });
}

// Handle new peer connection
socket.on('new-peer', async (peerId) => {
    if (!peerConnections[peerId]) {
        connectToPeer(peerId);
    }
});

// Handle incoming offers
socket.on('offer', async ({ offer, from }) => {
    const pc = await createPeerConnection(from);

    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    socket.emit('answer', { targetId: from, answer });
});

// Handle incoming answers
socket.on('answer', async ({ answer, from }) => {
    const pc = peerConnections[from];
    if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
    }
});

// Handle incoming ICE candidates
socket.on('ice-candidate', async ({ candidate, from }) => {
    const pc = peerConnections[from];
    if (pc) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
    }
});

// Handle disconnection
socket.on('peer-disconnected', (peerId) => {
    const videoElement = document.getElementById(`video-${peerId}`);
    if (videoElement) {
        videoElement.remove();
    }
    if (peerConnections[peerId]) {
        peerConnections[peerId].close();
        delete peerConnections[peerId];
    }
});

// Report bandwidth every 5 seconds
setInterval(() => {
    Object.values(peerConnections).forEach(pc => {
        measureBandwidth(pc);
    });
}, 5000);