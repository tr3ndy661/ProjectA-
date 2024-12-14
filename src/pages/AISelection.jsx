import React from 'react';
import { useNavigate } from 'react-router-dom';

const AISelection = () => {
  const navigate = useNavigate();

  const aiOptions = [
    {
      name: "General Assistant",
      description: "A versatile AI helper for various tasks",
      icon: "🤖"
    },
    {
      name: "Creative Writer",
      description: "Specialized in creative writing and storytelling",
      icon: "✍️"
    },
    {
      name: "Code Expert",
      description: "Your programming and technical companion",
      icon: "💻"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-6">
        <h1 className="text-4xl font-bold text-center mb-12">Choose Your AI Assistant</h1>
        <div className="grid md:grid-cols-3 gap-8">
          {aiOptions.map((ai, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/chat/${ai.name.toLowerCase().replace(' ', '-')}`)}
            >
              <div className="text-4xl mb-4">{ai.icon}</div>
              <h2 className="text-xl font-bold mb-2">{ai.name}</h2>
              <p className="text-gray-600">{ai.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <button 
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AISelection; 