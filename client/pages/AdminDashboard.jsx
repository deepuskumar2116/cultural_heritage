import React, {useState, useEffect} from 'react';
import axios from 'axios';
import QRCode from 'qrcode.react';

const API = process.env.REACT_APP_API_BASE || 'http://localhost:4000';

export default function AdminDashboard(){
  const [locations,setLocations] = useState([]);
  const [locName,setLocName] = useState('');
  const [spots,setSpots] = useState([]);
  const [qrImage,setQrImage] = useState(null);

  useEffect(()=>{ fetchLocations(); fetchSpots(); },[]);

  async function fetchLocations(){
    const resp = await axios.get(`${API}/api/locations`);
    setLocations(resp.data);
  }
  async function fetchSpots(){
    const resp = await axios.get(`${API}/api/spots`);
    setSpots(resp.data);
  }

  async function addLocation(){
    await axios.post(`${API}/api/admin/location`, {name:locName});
    setLocName('');
    fetchLocations();
  }

  async function getQR(spotId){
    const resp = await axios.get(`${API}/api/spot/${spotId}/qr`);
    setQrImage(resp.data.dataUrl);
  }

  return (
    <div>
      <h3>Admin Dashboard</h3>
      <div>
        <h4>Add Location</h4>
        <input value={locName} onChange={(e)=>setLocName(e.target.value)} placeholder="Name"/>
        <button onClick={addLocation}>Add</button>
      </div>
      <div>
        <h4>Locations</h4>
        <ul>{locations.map(l=> <li key={l.id}>{l.name}</li>)}</ul>
      </div>
      <div>
        <h4>Spots</h4>
        <ul>{spots.map(s=> <li key={s.id}>{s.name} <button onClick={()=>getQR(s.id)}>Generate QR</button></li>)}</ul>
      </div>
      {qrImage && <div><h4>QR</h4><img src={qrImage} alt="qr"/></div>}
    </div>
  );
}
