import React, {useRef, useEffect, useState} from 'react';
import { Html5Qrcode } from "html5-qrcode";
import axios from 'axios';

export default function QRScanner(){
  const [result, setResult] = useState(null);
  const scannerId = "html5qr-scanner";

  useEffect(()=>{
    const html5Qr = new Html5Qrcode(scannerId);
    html5Qr.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 250 },
      async (decoded) => {
        // QR expected to be a full URL like /visit/<key> or absolute URL -> extract key
        try {
          const url = new URL(decoded, window.location.origin);
          // if path like /visit/<key>
          if (url.pathname.startsWith('/visit/')) {
            const key = url.pathname.split('/').pop();
            const resp = await axios.get(`${process.env.REACT_APP_API_BASE || 'http://localhost:4000'}/visit/${key}`);
            setResult(resp.data);
            html5Qr.stop();
          } else {
            // fallback: attempt direct fetch
            const resp = await axios.get(decoded);
            setResult(resp.data);
            html5Qr.stop();
          }
        } catch(e){
          console.error(e); setResult({error:'Invalid QR content'});
          html5Qr.stop();
        }
      },
      (err)=>{}
    ).catch(err=> console.error('start failed',err));
    return () => {
      Html5Qrcode.getCameras().then(()=>{}).catch(()=>{});
    };
  },[]);

  return (
    <div>
      <h3>Scan QR</h3>
      <div id={scannerId} style={{width: '320px', height: '320px'}}></div>
      {result && (
        <div className="spot-card">
          <h4>{result.name}</h4>
          <p><b>Location:</b> {result.location}</p>
          <p>{result.description}</p>
          {result.audio_url && (
            <audio controls src={`${process.env.REACT_APP_API_BASE || 'http://localhost:4000'}${result.audio_url}`}/>
          )}
        </div>
      )}
    </div>
  );
}
