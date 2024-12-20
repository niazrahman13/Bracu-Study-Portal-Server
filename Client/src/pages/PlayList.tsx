import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Button, Spin } from 'antd';
import { courses } from './CourseData';
import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Quill styles
import jsPDF from 'jspdf'; // PDF generation
import html2canvas from 'html2canvas'; // HTML to canvas

const { Title } = Typography;

const Playlist = () => {
  const { playlistUrl } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState(''); // State to store user notes

  const playlist = courses
    .flatMap((course) => course.playlistUrls)
    .find((playlist) => playlist.url === decodeURIComponent(playlistUrl || ''));

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleNotesChange = (value: string) => {
    setNotes(value);
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('notes-container');
    if (element) {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      
      const doc = new jsPDF();
      // Adding image to PDF
      doc.addImage(imgData, 'PNG', 10, 10, 180, 160); // x, y, width, height
      doc.save('notes.pdf');
    }
  };
  

  const handleCopyNotes = () => {
    const el = document.createElement('textarea');
    el.value = notes;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    alert('Notes copied to clipboard. You can paste them in Google Docs.');
  };

  if (!playlist) return <div>Playlist not found</div>;

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>{playlist.name}</Title>

      {/* YouTube playlist player */}
      <div style={{ marginTop: '24px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Spin size="large" />
            <p>Loading videos...</p>
          </div>
        ) : (
          <iframe
            width="100%"
            height="500"
            src={`https://www.youtube.com/embed/videoseries?list=${new URL(playlist.url).searchParams.get('list')}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube Playlist"
          ></iframe>
        )}
      </div>

      {/* Rich Text Editor for Notes */}
      <div id="notes-container" style={{ marginTop: '24px' }}>
        <Title level={3}>Take Notes</Title>
        <ReactQuill
          value={notes}
          onChange={handleNotesChange}
          theme="snow"
          style={{ height: '300px', backgroundColor: '#fff' }}
        />
      </div>

      {/* PDF Download Button */}
      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <Button type="primary" onClick={handleDownloadPDF}>
          Download Notes as PDF
        </Button>
      </div>

      {/* Copy Notes for Google Docs */}
      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <Button type="default" onClick={handleCopyNotes}>
          Copy Notes for Google Docs
        </Button>
      </div>

      {/* Back button */}
      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <Button type="default" onClick={handleBackClick}>
          Back to Playlist
        </Button>
      </div>
    </div>
  );
};

export default Playlist;
