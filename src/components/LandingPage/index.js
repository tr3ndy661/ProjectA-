import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Your existing landing page content */}
      <button 
        onClick={() => navigate('/chat')}
        className="try-ai-button"
      >
        Try AI Chat
      </button>
    </div>
  );
}

export default LandingPage;